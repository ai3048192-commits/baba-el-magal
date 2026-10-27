-- =====================================================================
--  01_settings.sql
--  فيه إيه:      إعدادات الموقع (الألوان، الخطوط، SEO، التواصل، العربون...) + مفاتيح الربط السرية
--  محتاج قبله:   00
--  بيستخدمه:     الإعدادات في لوحة التحكم + ThemeManager
-- =====================================================================

-- =====================================================================
-- 1) إعدادات الموقع  ← src/data/settings.js
--    كل مفتاح في الإعدادات صف (theme / layout / seo / deposit / phone ...)
-- =====================================================================
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- مفاتيح الـ API السرية (المخزن وغيره) — الأدمن بس يشوفها
create table if not exists public.integration_settings (
  key         text primary key,               -- inventory / payment_gateway ...
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);
