-- =====================================================================
--  10_place_order.sql
--  فيه إيه:      تسجيل الطلب: الأسعار والشحن والعربون بتتحسب جوه قاعدة البيانات
--  محتاج قبله:   01 → 09
--  بيستخدمه:     زرار "تأكيد الطلب"
-- =====================================================================

-- =====================================================================
-- 10) تسجيل الطلب (العميل) — الأسعار والشحن والعربون بتتحسب هنا مش في المتصفح
-- =====================================================================
create or replace function public.place_order(payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_item       jsonb;
  v_product    public.products%rowtype;
  v_qty        int;
  v_price      numeric;
  v_subtotal   numeric := 0;
  v_discount   numeric := 0;
  v_shipping   numeric := 0;
  v_total      numeric;
  v_deposit    numeric := 0;
  v_coupon     public.coupons%rowtype;
  v_free_over  numeric := coalesce((public.setting('freeShippingOver') #>> '{}')::numeric, 0);
  v_dep        jsonb   := coalesce(public.setting('deposit'), '{}'::jsonb);
  v_method     text    := coalesce(payload->>'paymentMethod', 'cod');
  v_customer   jsonb   := payload->'customer';
  v_free       boolean;
  v_number     text    := payload->>'number';
  v_order_id   bigint;
begin
  if jsonb_array_length(coalesce(payload->'items', '[]'::jsonb)) = 0 then
    raise exception 'السلة فاضية';
  end if;
  if coalesce(v_customer->>'name', '') = '' or coalesce(v_customer->>'phone', '') !~ '^01[0-9]{9}$' then
    raise exception 'بيانات العميل غير صحيحة';
  end if;

  -- المجموع من أسعار قاعدة البيانات
  for v_item in select * from jsonb_array_elements(payload->'items') loop
    v_qty := (v_item->>'qty')::int;
    select * into v_product from public.products where id = (v_item->>'productId')::bigint and active;
    if not found then raise exception 'منتج غير متاح: %', v_item->>'name'; end if;
    if v_qty is null or v_qty < 1 then raise exception 'كمية غير صحيحة'; end if;
    if v_product.stock < v_qty then raise exception 'الكمية المطلوبة من "%" مش متوفرة', v_product.name; end if;
    v_subtotal := v_subtotal + public.effective_price(v_product.id) * v_qty;
  end loop;

  -- الكوبون
  v_free := v_free_over > 0 and v_subtotal >= v_free_over;
  if coalesce(payload->>'coupon', '') <> '' then
    select * into v_coupon from public.coupons where lower(code) = lower(payload->>'coupon') and active;
    if found then
      if v_coupon.type = 'percent'  then v_discount := round(v_subtotal * v_coupon.value / 100); end if;
      if v_coupon.type = 'fixed'    then v_discount := least(v_subtotal, v_coupon.value); end if;
      if v_coupon.type = 'shipping' then v_free := true; end if;
    end if;
  end if;

  -- الشحن حسب المحافظة
  if not v_free then
    select fee into v_shipping from public.shipping_zones where governorate = v_customer->>'governorate';
    if not found then v_shipping := coalesce((public.setting('shippingFee') #>> '{}')::numeric, 0); end if;
  end if;
  v_total := v_subtotal - v_discount + v_shipping;

  -- العربون
  if coalesce((v_dep->>'enabled')::boolean, false) and v_method = 'cod'
     and v_subtotal >= coalesce((v_dep->>'minOrder')::numeric, 0) then
    v_deposit := case when v_dep->>'type' = 'fixed'
                      then (v_dep->>'value')::numeric
                      else round(v_total * (v_dep->>'value')::numeric / 100) end;
    v_deposit := least(v_deposit, v_total);
  end if;

  -- رقم الطلب (من الموقع لو سليم ومش مكرر، وإلا رقم جديد)
  if v_number is null or v_number !~ '^BEM-[0-9]{4,12}$' or exists (select 1 from public.orders where number = v_number) then
    loop
      v_number := 'BEM-' || lpad((floor(random() * 100000000))::bigint::text, 8, '0');
      exit when not exists (select 1 from public.orders where number = v_number);
    end loop;
  end if;

  insert into public.orders (
    number, customer_name, phone, phone2, governorate, city, address, landmark, preferred_time, notes,
    payment_method, wallet_phone, wallet_ref, fawry_code, coupon_code,
    subtotal, discount, shipping, total, deposit_amount, deposit_phone, deposit_ref, shipping_company_id
  ) values (
    v_number, v_customer->>'name', v_customer->>'phone', v_customer->>'phone2', v_customer->>'governorate',
    v_customer->>'city', v_customer->>'address', v_customer->>'landmark', v_customer->>'preferredTime', v_customer->>'notes',
    v_method, payload->'payment'->>'walletPhone', payload->'payment'->>'ref', payload->'payment'->>'fawryCode',
    nullif(payload->>'coupon', ''),
    v_subtotal, v_discount, v_shipping, v_total, v_deposit,
    payload->'deposit'->>'phone', payload->'deposit'->>'ref',
    (public.setting('defaultShippingCompanyId') #>> '{}')::bigint
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(payload->'items') loop
    v_qty := (v_item->>'qty')::int;
    select * into v_product from public.products where id = (v_item->>'productId')::bigint;
    insert into public.order_items (order_id, product_id, name, image, price, qty, color)
    values (v_order_id, v_product.id, v_product.name, v_product.image, public.effective_price(v_product.id), v_qty, v_item->>'color');
    update public.products set stock = stock - v_qty where id = v_product.id;
  end loop;

  insert into public.order_events (order_id, status, note, source, created_by) values (v_order_id, 'new', null, 'customer', null);

  return jsonb_build_object('number', v_number, 'subtotal', v_subtotal, 'discount', v_discount,
                            'shipping', v_shipping, 'total', v_total, 'deposit', v_deposit);
end $$;
