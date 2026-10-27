-- =====================================================================
--  00_helpers_and_admins.sql
--  فيه إيه:      الأساسيات: دالة تحديث وقت التعديل + جدول الأدمن + دالة is_admin()
--  محتاج قبله:   لازم يتشغل الأول — كل الملفات اللي بعده بتعتمد عليه
--  بيستخدمه:     لوحة التحكم (مين أدمن)
-- =====================================================================

create extension if not exists pgcrypto;

-- =====================================================================
-- 0) دوال مساعدة
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- الأدمن = أي مستخدم Supabase Auth موجود في جدول admins
create table if not exists public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  name        text,
  role        text not null default 'admin' check (role in ('owner','admin','staff')),
  created_at  timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
