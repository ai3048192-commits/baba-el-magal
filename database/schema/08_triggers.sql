-- =====================================================================
--  08_triggers.sql
--  فيه إيه:      تحديث وقت التعديل تلقائياً
--  محتاج قبله:   01، 02، 05
--  بيستخدمه:     —
-- =====================================================================

-- =====================================================================
-- 8) Triggers
-- =====================================================================
drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists trg_settings_updated on public.site_settings;
create trigger trg_settings_updated before update on public.site_settings for each row execute function public.set_updated_at();
