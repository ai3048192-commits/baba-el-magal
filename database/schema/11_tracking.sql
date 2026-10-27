-- =====================================================================
--  11_tracking.sql
--  فيه إيه:      تتبع الشحنة برقم الطلب + الموبايل، والتحقق من الكوبون
--  محتاج قبله:   05
--  بيستخدمه:     صفحة /track
-- =====================================================================

-- =====================================================================
-- 11) تتبع الشحنة (العميل) — لازم رقم الطلب + رقم الموبايل
-- =====================================================================
create or replace function public.track_order(p_number text, p_phone text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'number', o.number,
    'status', o.status,
    'createdAt', o.created_at,
    'customer', jsonb_build_object('name', o.customer_name, 'governorate', o.governorate, 'city', o.city),
    'paymentMethod', o.payment_method,
    'total', o.total,
    'deposit', jsonb_build_object('amount', o.deposit_amount, 'paid', o.deposit_paid),
    'trackingNumber', coalesce(o.tracking_number, ''),
    'shippingCompanyId', o.shipping_company_id,
    'companyName', sc.name,
    'trackingUrl', sc.tracking_url,
    'history', coalesce((
      select jsonb_agg(jsonb_build_object('status', e.status, 'note', e.note, 'at', e.created_at) order by e.created_at)
      from public.order_events e where e.order_id = o.id), '[]'::jsonb)
  )
  from public.orders o
  left join public.shipping_companies sc on sc.id = o.shipping_company_id
  where upper(o.number) = upper(trim(p_number))
    and right(regexp_replace(o.phone, '\D', '', 'g'), 10) = right(regexp_replace(p_phone, '\D', '', 'g'), 10)
  limit 1;
$$;

-- التحقق من كوبون من غير ما الأكواد تبقى مكشوفة
create or replace function public.validate_coupon(p_code text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('code', code, 'type', type, 'value', value)
  from public.coupons where lower(code) = lower(trim(p_code)) and active limit 1;
$$;
