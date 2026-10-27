-- =====================================================================
--  12_security_rls.sql
--  فيه إيه:      الحماية: مين يشوف ويعدّل إيه (العميل / الأدمن)
--  محتاج قبله:   كل الجداول (00 → 07)
--  بيستخدمه:     كل الموقع
-- =====================================================================

-- =====================================================================
-- 12) الحماية (Row Level Security)
--     العميل: يقرا المحتوى بس + يكتب تقييم/اشتراك + يطلب ويتتبع عن طريق الدوال
--     الأدمن: كل حاجة
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'admins','site_settings','integration_settings','categories','subcategories','products','reviews','offers',
    'coupons','wheel_prizes','shipping_companies','shipping_company_credentials','shipping_zones','orders',
    'order_items','order_events','hero_slides','partners','store_features','content_blocks','subscribers',
    'inventory_sync_log','shipping_webhook_log'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists admin_all on public.%I', t);
    execute format('create policy admin_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;

  -- قراءة عامة للمحتوى
  foreach t in array array[
    'site_settings','categories','subcategories','wheel_prizes','shipping_companies','shipping_zones',
    'hero_slides','partners','store_features','content_blocks'
  ] loop
    execute format('drop policy if exists public_read on public.%I', t);
    execute format('create policy public_read on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

drop policy if exists public_read on public.products;
create policy public_read on public.products for select to anon, authenticated using (active);

drop policy if exists public_read on public.offers;
create policy public_read on public.offers for select to anon, authenticated using (active);

drop policy if exists public_read on public.reviews;
create policy public_read on public.reviews for select to anon, authenticated using (approved);

drop policy if exists public_insert on public.reviews;
create policy public_insert on public.reviews for insert to anon, authenticated with check (true);

drop policy if exists public_insert on public.subscribers;
create policy public_insert on public.subscribers for insert to anon, authenticated with check (true);

-- الأدمن يشوف نفسه
drop policy if exists self_read on public.admins;
create policy self_read on public.admins for select to authenticated using (user_id = auth.uid());

-- الدوال اللي العميل مسموح يستخدمها
grant execute on function public.place_order(jsonb)          to anon, authenticated;
grant execute on function public.track_order(text, text)     to anon, authenticated;
grant execute on function public.validate_coupon(text)       to anon, authenticated;
grant execute on function public.effective_price(bigint)     to anon, authenticated;
