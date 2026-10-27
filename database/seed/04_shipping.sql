-- =====================================================================
--  04_shipping.sql — شركات الشحن + أسعار المحافظات
--  اتولّد تلقائياً من src/data (2026-10-27) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================

begin;

insert into public.shipping_companies (id, name, provider, logo, phone, tracking_url, estimated_days, cod_supported, active) values
  (1, 'مندوب المتجر', 'manual', null, '01000000000', null, '1-3', true, true),
  (2, 'Bosta', 'bosta', null, null, 'https://bosta.co/tracking-shipments?shipment-number={tracking}', '2-4', true, true),
  (3, 'Aramex', 'aramex', null, null, 'https://www.aramex.com/eg/ar/track/results?ShipmentNumber={tracking}', '2-5', true, false),
  (4, 'Mylerz', 'mylerz', null, null, null, '2-4', true, false)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.shipping_companies', 'id'), coalesce((select max(id) from public.shipping_companies), 1));

insert into public.shipping_company_credentials (company_id, enabled, base_url) values
  (1, false, null),
  (2, false, 'https://app.bosta.co/api/v2'),
  (3, false, 'https://ws.aramex.net/ShippingAPI.V2'),
  (4, false, null)
on conflict do nothing;

insert into public.shipping_zones (id, governorate, fee, days) values
  (1, 'القاهرة', 50, '1-2'),
  (2, 'الجيزة', 50, '1-2'),
  (3, 'الإسكندرية', 60, '2-3'),
  (4, 'القليوبية', 55, '1-3'),
  (5, 'أسوان', 90, '4-6'),
  (6, 'البحر الأحمر', 90, '4-6')
on conflict do nothing;

select setval(pg_get_serial_sequence('public.shipping_zones', 'id'), coalesce((select max(id) from public.shipping_zones), 1));

commit;
