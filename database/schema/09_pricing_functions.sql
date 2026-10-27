-- =====================================================================
--  09_pricing_functions.sql
--  فيه إيه:      دوال الأسعار: العرض شغال؟ سعر المنتج النهارده كام؟
--  محتاج قبله:   02، 03
--  بيستخدمه:     الأسعار بعد العروض
-- =====================================================================

-- =====================================================================
-- 9) منطق العروض والأسعار (نفس منطق src/lib/offers.js) — بتوقيت القاهرة
-- =====================================================================
create or replace function public.offer_is_live(o public.offers)
returns boolean language sql stable as $$
  select o.active and case o.kind
    when 'daily'  then true
    when 'weekly' then extract(dow from (now() at time zone 'Africa/Cairo'))::int = any(o.weekdays)
    when 'range'  then (now() at time zone 'Africa/Cairo')::date
                       between coalesce(o.start_date, '-infinity'::date) and coalesce(o.end_date, 'infinity'::date)
    else false
  end;
$$;

-- سعر المنتج النهارده بعد أكبر خصم عرض شغال
create or replace function public.effective_price(p_id bigint)
returns numeric language sql stable as $$
  select round(p.price * (1 - coalesce(max(o.discount_percent), 0) / 100.0))
  from public.products p
  left join public.offers o on p.id = any(o.product_ids) and public.offer_is_live(o)
  where p.id = p_id
  group by p.price;
$$;

-- قراءة إعداد رقمي/نصي من site_settings
create or replace function public.setting(p_key text)
returns jsonb language sql stable security definer set search_path = public as $$
  select value from public.site_settings where key = p_key;
$$;
