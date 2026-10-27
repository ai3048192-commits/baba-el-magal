-- =====================================================================
--  03_offers.sql — جدول العروض + الكوبونات + جوائز عجلة الحظ
--  اتولّد تلقائياً من src/data (2026-10-27) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================

begin;

insert into public.offers (id, title, subtitle, kind, weekdays, start_date, end_date, product_ids, discount_percent, badge, show_on_home, active) values
  (1, 'صفقات يوم الجمعة', 'تخفيضات كل جمعة — ينتهي العرض بنفاذ الكمية', 'weekly', '{5}'::int[], null, null, '{23,24,25,26,27,28,29,30}'::bigint[], 0, 'عرض الجمعة', false, true),
  (2, 'صفقة اليوم', 'خصم إضافي 10% على القلاية الهوائية — كل يوم لحد آخر الليل', 'daily', '{}'::int[], null, null, '{6}'::bigint[], 10, 'صفقة اليوم', true, true),
  (3, 'ثلاثاء المفروشات', 'خصم 15% على كل المفروشات يوم الثلاثاء', 'weekly', '{2}'::int[], null, null, '{13,14,15,16,17,18}'::bigint[], 15, 'ثلاثاء المفروشات', true, true),
  (4, 'سبت المطبخ', 'خصم 10% على أدوات المطبخ المختارة كل سبت', 'weekly', '{6}'::int[], null, null, '{1,3,5,7,10,12}'::bigint[], 10, 'سبت المطبخ', true, true)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.offers', 'id'), coalesce((select max(id) from public.offers), 1));

insert into public.coupons (id, code, type, value, active) values
  (1, 'MAGAL10', 'percent', 10, true),
  (2, 'MAGAL15', 'percent', 15, true),
  (3, 'MAGAL20', 'percent', 20, true),
  (4, 'CASH100', 'fixed', 100, true),
  (5, 'FREESHIP', 'shipping', 0, true)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.coupons', 'id'), coalesce((select max(id) from public.coupons), 1));

insert into public.wheel_prizes (id, label, code, color, sort_order) values
  (1, 'خصم 10%', 'MAGAL10', '#E50914', 1),
  (2, 'شحن مجاني', 'FREESHIP', '#121216', 2),
  (3, 'خصم 15%', 'MAGAL15', '#E50914', 3),
  (4, 'كاش باك 100ج', 'CASH100', '#121216', 4),
  (5, 'خصم 20%', 'MAGAL20', '#E50914', 5),
  (6, 'حظ سعيد المره الجاية', null, '#121216', 6)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.wheel_prizes', 'id'), coalesce((select max(id) from public.wheel_prizes), 1));

commit;
