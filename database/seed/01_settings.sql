-- =====================================================================
--  01_settings.sql — إعدادات الموقع (كل مفتاح صف) + إعدادات ربط المخزن
--  اتولّد تلقائياً من src/data (2026-10-27) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================

begin;

insert into public.site_settings (key, value) values
  ('storeName', '"baba-el-magal"'::jsonb),
  ('storeNameAr', '"بابا المجال"'::jsonb),
  ('tagline', '"متجرك المتكامل لتجهيز المودرن والعرائس بأرقى الأدوات المنزلية، أطقم الأواني الجرانيت والتيفال الأصلية، وأحدث الأجهزة الكهربائية الذكية للمطبخ العصري."'::jsonb),
  ('logoImage', '""'::jsonb),
  ('favicon', '"/favicon.svg"'::jsonb),
  ('theme', '{"brand":"#E50914","brandDark":"#BE123C","accent":"#F43F5E","bg":"#070709","surface":"#121216","surface2":"#0A0A0C","lightBg":"#F5F5F7","lightSurface":"#FFFFFF","lightSurface2":"#EEEEF2","fontBody":"Tajawal","fontHeading":"Tajawal","defaultMode":"dark"}'::jsonb),
  ('layout', '{"containerWidth":80,"productColumns":4,"homeSections":[{"id":"hero","visible":true},{"id":"categories","visible":true},{"id":"todayDeals","visible":true},{"id":"deals","visible":true},{"id":"banner","visible":true},{"id":"featured","visible":true},{"id":"steps","visible":true},{"id":"partners","visible":true}],"navCategoriesCount":3,"showTopBar":true,"stickyHeader":true,"showFloatingSocial":true,"showNewsletter":true,"maintenanceMode":false,"maintenanceMessage":"الموقع تحت الصيانة وهنرجع قريب جداً بعروض جديدة 🔥"}'::jsonb),
  ('seo', '{"title":"بابا المجال | أدوات منزلية وأجهزة مطبخ ومفروشات","description":"بابا المجال — أدوات منزلية، مستلزمات مطبخ، مفروشات وأجهزة كهربائية بأفضل الأسعار في مصر مع شحن سريع ومعاينة قبل الدفع.","keywords":"أدوات منزلية, أجهزة مطبخ, مفروشات, جهاز عروسة, حلل جرانيت, قلاية هوائية","ogImage":"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop","googleAnalyticsId":"","facebookPixelId":"","indexing":true,"customCss":""}'::jsonb),
  ('phone', '"01000000000"'::jsonb),
  ('phoneLabel', '"+20 100 000 0000 (استفسارات الأجهزة)"'::jsonb),
  ('email', '"orders@redstore.com"'::jsonb),
  ('address', '"المعرض الرئيسي: القاهرة، مصر"'::jsonb),
  ('whatsappNumber', '"201000000000"'::jsonb),
  ('whatsappMessage', '"مرحباً، أود الاستفسار عن الأدوات المنزلية وأطقم العرائس المتوفرة لديكم."'::jsonb),
  ('walletNumber', '"01099887766"'::jsonb),
  ('instapayAddress', '"babaelmagal@instapay"'::jsonb),
  ('social', '{"facebook":"https://facebook.com/yourstore","instagram":"https://instagram.com/yourstore","telegram":"https://t.me/yourstore","tiktok":""}'::jsonb),
  ('topBarText', '"شحن مجاني للطلبات فوق 500 جنيه"'::jsonb),
  ('notificationTitle', '"التنبيهات العاجلة"'::jsonb),
  ('notificationText', '"تم تفعيل خصومات الشتاء الكبرى بنسبة 50% على كافة الأقسام!"'::jsonb),
  ('shippingFee', '60'::jsonb),
  ('freeShippingOver', '500'::jsonb),
  ('defaultShippingCompanyId', '1'::jsonb),
  ('paymentMethods', '{"cod":true,"card":false,"wallet":true,"fawry":true}'::jsonb),
  ('deposit', '{"enabled":true,"type":"percent","value":10,"minOrder":2000,"note":"العربون بيتخصم من إجمالي الطلب، والباقي بتدفعه للمندوب عند الاستلام بعد المعاينة."}'::jsonb),
  ('discountsEndAt', '""'::jsonb),
  ('luckyWheelEnabled', 'true'::jsonb)
on conflict do nothing;

insert into public.integration_settings (key, value) values
  ('inventory', '{"enabled":false,"provider":"custom","baseUrl":"","apiKey":"","syncStock":true,"syncOrders":true,"intervalMinutes":30}'::jsonb)
on conflict do nothing;

commit;
