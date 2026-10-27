-- =====================================================================
--  13_storage_and_first_admin.sql
--  فيه إيه:      مكان رفع الصور + خطوة تفعيل أول أدمن
--  محتاج قبله:   00
--  بيستخدمه:     رفع صور المنتجات
-- =====================================================================

-- =====================================================================
-- 13) تخزين الصور (Supabase Storage)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images public read" on storage.objects;
create policy "images public read" on storage.objects for select using (bucket_id = 'images');

drop policy if exists "images admin write" on storage.objects;
create policy "images admin write" on storage.objects for all to authenticated
  using (bucket_id = 'images' and public.is_admin())
  with check (bucket_id = 'images' and public.is_admin());
-- =====================================================================
-- 14) تفعيل أول أدمن (بعد ما تعمل يوزر من Authentication ← Users)
--     غيّر الإيميل وشغّل السطر ده لوحده:
-- insert into public.admins (user_id, email, name, role)
-- select id, email, 'صاحب المتجر', 'owner' from auth.users where email = 'you@example.com';
-- =====================================================================
