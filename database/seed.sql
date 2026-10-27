-- =====================================================================
--  seed.sql — كل البيانات في ملف واحد (بعد schema.sql)
--  اتولّد تلقائياً من src/data (2026-10-27) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================

begin;

-- ---------- 01_settings.sql: إعدادات الموقع (كل مفتاح صف) + إعدادات ربط المخزن ----------
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

-- ---------- 02_catalog.sql: الأقسام والأقسام الفرعية والمنتجات والتقييمات ----------
insert into public.categories (id, name, icon, sort_order) values
  ('home-tools', 'أدوات منزلية', 'Box', 1),
  ('kitchen', 'مستلزمات المطبخ', 'Utensils', 2),
  ('linens', 'المفروشات والمنسوجات', 'Sparkles', 3),
  ('electrical', 'الأجهزة الكهربائية', 'Zap', 4),
  ('gadgets', 'ابتكارات وصيانة', 'Wrench', 5),
  ('decor', 'ديكورات منزلية', 'Palette', 6)
on conflict do nothing;

insert into public.subcategories (category_id, name, sort_order) values
  ('home-tools', 'منظمات الدولاب، الأدراج والأحذية', 1),
  ('home-tools', 'أدوات ومعدات التنظيف والمسح والكنس', 2),
  ('home-tools', 'شماعات، علاقات ومجففات الملابس', 3),
  ('home-tools', 'أدوات الغسيل، الكوي ومستلزمات الغسالات', 4),
  ('home-tools', 'صناديق وسلال التخزين الكبرى', 5),
  ('home-tools', 'سلات المهملات وأكياس القمامة', 6),
  ('kitchen', 'حلل، طاسات وأطقم طهي كاملة', 1),
  ('kitchen', 'أطقم التوابل، البرطمانات وحفظ الطعام', 2),
  ('kitchen', 'أدوات تقطيع، سكاكين ومقاور', 3),
  ('kitchen', 'أطقم عشاء، أكواب ومجّات', 4),
  ('kitchen', 'مصفاة، ملاعق سيليكون وأدوات غرف', 5),
  ('kitchen', 'صواني الفرن، قوالب الكيك والبوتاجاز', 6),
  ('linens', 'ملايات سرير، بطاطين وألحفة', 1),
  ('linens', 'ستائر ومفارش شيفون وبلتاكين', 2),
  ('linens', 'خدديات، مراتب طبية ووسائد نوم', 3),
  ('linens', 'فوط، بشاكير وأرواب حمام', 4),
  ('linens', 'مفارش سفرة ومجالس عربية', 5),
  ('electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 1),
  ('electrical', 'أجهزة القهوة والمشروبات', 2),
  ('electrical', 'كشافات، ليد وأدوات إضاءة الطوارئ', 3),
  ('electrical', 'مشتركات كهرباء، مفاتيح وأسلاك', 4),
  ('electrical', 'مستلزمات العناية الشخصية', 5),
  ('electrical', 'مراوح صغيرة ومشايات هواء', 6),
  ('gadgets', 'أدوات صيانة سريعة ومفكات متعددة', 1),
  ('gadgets', 'ابتكارات ذكية لتسهيل أعمال البيت', 2),
  ('gadgets', 'شماعات لاصقة، حوامل بدون ثقب', 3),
  ('gadgets', 'أشرطة لحام، سيليكون ومواد عزل', 4),
  ('decor', 'تابلوهات، ساعات حائط ولوحات فنية', 1),
  ('decor', 'إضاءات ديكورية وسلاسل ليد', 2),
  ('decor', 'أباجورات، فازات وورود صناعية', 3),
  ('decor', 'سجاد صغير، مشاية ومفارش أرضية', 4)
on conflict do nothing;

insert into public.products (id, name, description, price, old_price, rating, reviews_count, category_id, subcategory, image, images, badge, tag, stock, total_stock, features, specs, colors, sections, active) values
  (1, 'طقم حلل جرانيت تركي أصلي 10 قطع - غطاء زجاجي مقاوم للحرارة', null, 4500, 5500, 5, 0, 'kitchen', 'حلل، طاسات وأطقم طهي كاملة', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'الأكثر طلباً', 'إصدار 2026', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (2, 'خلاط يدوي هاند بلندر متعدد الوظائف 1000 وات - أداء جبار', null, 1200, 1500, 4.8, 0, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1570222094114-d074f7e1e6e5?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'تخفيض خاص', 'الأعلى ريڤيو', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (3, 'طقم سكاكين ستانلس ستيل ألماني احترافي 8 قطع مع حامل خشب فاخر', null, 950, 1100, 4.5, 0, 'kitchen', 'أدوات تقطيع، سكاكين ومقاور', 'https://images.unsplash.com/photo-1593618998160-cacffd50f113?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'حصري', 'احترافي', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (4, 'ماكينة قهوة اسبريسو ديجيتال باللبن - صانعة البهجة الصباحية', null, 7800, 8900, 4.9, 0, 'electrical', 'أجهزة القهوة والمشروبات', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e1?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'فاخر', 'VIP', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (5, 'طقم منظمات ثلاجة ومطبخ شفافة محكمة الغلق - 6 قطع بريميوم', null, 550, 700, 4.7, 0, 'kitchen', 'أطقم التوابل، البرطمانات وحفظ الطعام', 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'عرض نار', 'عملي', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (6, 'قلاية هوائية أير فرير ديجيتال سعة 6 لتر - بدون زيت صحية', null, 4200, 5000, 4.9, 0, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'الأكثر مبيعاً', 'صحي', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (7, 'طقم عشاء بورسلين تركي فاخر 60 قطعة كامل للعرائس', null, 9500, 11000, 4.8, 0, 'kitchen', 'أطقم عشاء، أكواب ومجّات', 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'مميز', 'عرائس', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog', 'featured']::text[], true),
  (8, 'ميزان مطبخ رقمي ذكي بشاشة ليد حساسة حتى 10 كجم', null, 350, 450, 4.3, 0, 'kitchen', 'مصفاة، ملاعق سيليكون وأدوات غرف', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'ذكي', 'إصدار محدث', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (9, 'غلاية مياه كهربائية ستانلس ستيل 1.7 لتر حماية ضد الجفاف', null, 680, 850, 4.4, 0, 'electrical', 'أجهزة القهوة والمشروبات', 'https://images.unsplash.com/photo-1594213985161-d448c4842e0f?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'خصم', 'سريع', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (10, 'طقم صواني فرن تيفال مقاومة للالتصاق 3 قطع بمقاسات مختلفة', null, 1350, 1600, 4.6, 0, 'kitchen', 'صواني الفرن، قوالب الكيك والبوتاجاز', 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'رائج', 'أساسي', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (11, 'ماكينة صنع القهوة التركية البن اليدوية والكهربائية', null, 890, 1100, 4.2, 0, 'electrical', 'أجهزة القهوة والمشروبات', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'جديد', 'أصلي', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (12, 'علب توابل مغناطيسية معدنية ستانلس ستيل مع حامل جداري - 12 قطعة', null, 450, 600, 4.7, 0, 'kitchen', 'أطقم التوابل، البرطمانات وحفظ الطعام', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'منظم ذكي', 'عملي', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (13, 'طقم ملايات سرير قطن مصري 100% - 4 قطع (سرير كبير)', null, 850, 1100, 4.9, 0, 'linens', 'ملايات سرير، بطاطين وألحفة', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'الأكثر طلباً', 'قطن خالص', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (14, 'بطانية شتوية ثقيلة مزدوجة الطبقات - ناعمة ودافئة للغاية', null, 1250, 1600, 4.8, 0, 'linens', 'ملايات سرير، بطاطين وألحفة', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'عرض شتوي', 'تدفئة فائقة', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (15, 'طقم ستائر غرف نوم ومسحوق شيفون فاخر مع بلتاكين', null, 950, 1300, 4.6, 0, 'linens', 'ستائر ومفارش شيفون وبلتاكين', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'تصميم عصري', 'ديكور', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (16, 'وسائد نوم طبية ميموري فوم لدعم الرقبة والعمود الفقري', null, 450, 600, 4.9, 0, 'linens', 'خدديات، مراتب طبية ووسائد نوم', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'صحي ومريح', 'VIP', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (17, 'طقم فوط وبشاكير حمام قطن تركي عالي الامتصاص - 5 قطع', null, 720, 950, 4.7, 0, 'linens', 'فوط، بشاكير وأرواب حمام', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'تخفيض', 'عرائس', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (18, 'مفرش سفرة مطرز فخم مع 6 كوفيرات مطابقة', null, 1100, 1450, 4.5, 0, 'linens', 'مفارش سفرة ومجالس عربية', 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'جديد', 'سفرة', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['catalog']::text[], true),
  (19, 'طقم حلل جرانيت تركي أصلي 10 قطع - خصم حارق لفترة محدودة', null, 3800, 5500, 4.9, 0, 'kitchen', 'حلل، طاسات وأطقم طهي كاملة', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'عرض نار', 'وفر 1700 جنيه', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['discounts']::text[], true),
  (20, 'ماكينة قهوة اسبريسو ديجيتال باللبن - عرض العرائس الحصري', null, 6500, 8900, 5, 0, 'electrical', 'أجهزة القهوة والمشروبات', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e1?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'تخفيض كبير', 'عرائس VIP', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['discounts']::text[], true),
  (21, 'قلاية هوائية أير فرير ديجيتال سعة 6 لتر - عرض خاص جداً', null, 3499, 5000, 4.8, 0, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'توفير هائل', 'بدون زيت', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['discounts']::text[], true),
  (22, 'طقم عشاء بورسلين تركي فاخر 60 قطعة كامل - سعر لقطة', null, 7999, 11000, 4.9, 0, 'kitchen', 'أطقم عشاء، أكواب ومجّات', 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop', '{}'::text[], 'تصفية موسمية', 'الأكثر طلباً', 20, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, array['discounts']::text[], true),
  (23, 'ماكينة ديلونجي اسبريسو ومشروبات دافئة باللبن', null, 2999, 4800, 4.8, 142, 'electrical', 'أجهزة القهوة والمشروبات', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e1?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 8, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (24, 'طقم عشاء بورسلين تركي فاخر 60 قطعة كامل', null, 6499, 9500, 4.9, 89, 'kitchen', 'أطقم عشاء، أكواب ومجّات', 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 3, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (25, 'مفرش سرير قطيفة شتوي 5 قطع مبطن بالكامل', null, 850, 1600, 4.7, 210, 'linens', 'ملايات سرير، بطاطين وألحفة', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 12, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (26, 'خلاط مولينكس متعدد الوظائف 3*1 دورق زجاجي', null, 1199, 2200, 4.9, 315, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 5, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (27, 'طقم مقالي سيراميك صحي 3 قطع مقاسات مختلفة', null, 1350, 2100, 4.6, 76, 'kitchen', 'حلل، طاسات وأطقم طهي كاملة', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 9, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (28, 'مكواة بخار عامودية ملابس وستائر 2000 واط', null, 1899, 2900, 4.8, 184, 'home-tools', 'أدوات الغسيل، الكوي ومستلزمات الغسالات', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 7, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (29, 'طقم سكاكين ياباني استانلس ستيل 6 قطع مع حامل', null, 799, 1400, 4.9, 420, 'kitchen', 'أدوات تقطيع، سكاكين ومقاور', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 2, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (30, 'صانعة سندوتشات ووافل 4*1 ديجيتال', null, 1450, 2300, 4.7, 95, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop', '{}'::text[], null, null, 11, 0, '{}'::text[], '[]'::jsonb, '[]'::jsonb, '{}'::text[], true),
  (31, 'طقم حلل جرانيت تركي سافلون 12 قطعة كامل - الإصدار الفاخر', 'مصنوع من 7 طبقات جرانيت نقي عالي التوصيل للحرارة. يد غير موصلة للحرارة مع أغطية بايركس مقوى نقي ضد الكسر.', 4999, 8500, 4.9, 328, 'kitchen', 'حلل، طاسات وأطقم طهي كاملة', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1000&auto=format&fit=crop', '{}'::text[], 'الأكثر طلباً 🔥', null, 6, 30, array['ضمان 5 سنوات ضد التلصيق', 'خالي تماماً من مواد PFOA الضارة', 'مناسب لجميع أنواع البوتاجازات (غاز/كهرباء)']::text[], '[]'::jsonb, '[]'::jsonb, array['bestseller']::text[], true),
  (32, 'قلاية هوائية فيليبس XXL دبل باسكيت 7.2 لتر - العصر الذهبي للصحة', 'شاشة ديجيتال باللمس مع 8 برامج طهي مسبقة الإعداد. تقنية Rapid Air لتقليل الدهون بنسبة 90%.', 5200, 8900, 5, 512, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop', '{}'::text[], 'صفقة الموسم ⚡', null, 4, 25, array['سعة ضخمة تكفي لعائلة 6 أفراد', 'شاشة إلكترونية تفاعلية', 'سلة متحركة سهلة التنظيف بالصحون']::text[], '[]'::jsonb, '[]'::jsonb, array['bestseller']::text[], true),
  (33, 'قلاية هوائية ذكية (Airfryer Pro) سعة 8 لتر - إصدار باب المجال الفاخر', 'تقنية طهي بالدوران الهوائي السريع بزاوية 360° لإنقاص نسبة الدهون 90%. تأتي مع شاشة Touch لمسية ذكية و12 برنامج طهي محدد مسبقاً.', 3499, 4999, 4.9, 1247, 'electrical', 'أجهزة مطبخ صغيرة (خلاطات، قلايات)', 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=1000&auto=format&fit=crop', array['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=1000&auto=format&fit=crop']::text[], 'خصم حصري 30%', 'شحن مجاني اليوم', 20, 0, array['تقنية RapidAir 360°: توزيع الهواء الساخن بالتساوي للحصول على طعام مقرمش بدون زيت.', 'سلة سريعة التنظيف: حلة داخلية قابلة للفك وسهلة الغسيل في غسالة الأطباق.', 'توفير 60% كهرباء: نظام تسخين ذكي يقلل استهلاك الطاقة مقارنة بالأفران التقليدية.', 'أمان كامل للأطفال: مقبض بارد عازل للحرارة وقفل أمان يمنع الانزلاق.']::text[], '[{"label":"السعة الفعلية","value":"8.0 لتر (تكفي عائلة 6-8 أفراد)"},{"label":"القدرة الكهربائية","value":"2200 واط (طهي فائق السرعة)"},{"label":"نوع الشاشة","value":"شاشة LED باللمس الذكي"},{"label":"نطاق درجة الحرارة","value":"80°C إلى 200°C"},{"label":"المؤقت التلقائي","value":"حتى 60 دقيقة مع إيقاف آلي"},{"label":"طلاء السلة","value":"تيفلون مانع للالتصاق خالي من PFOA"},{"label":"برامج الطهي","value":"12 برنامج معدة مسبقاً"},{"label":"الضمان المعتمد","value":"24 شهر ضد عيوب التصنيع"}]'::jsonb, '[{"name":"أسود ملكي فاخر","code":"#111111"},{"name":"فضي ميتاليك","code":"#777777"},{"name":"أبيض لؤلؤي","code":"#eeeeee"}]'::jsonb, array['catalog', 'featured']::text[], true)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.products', 'id'), coalesce((select max(id) from public.products), 1));

insert into public.reviews (id, product_id, name, city, comment, rating, approved, created_at) values
  (1, 33, 'م. أحمد عبد الفتاح', 'القاهرة - شيراتون', 'بصراحة ممتازة جداً فوق ما توقعت، سريعة وصوتها هادي والقلي طلع مقرمش جداً بدون زيت. التوصيل كان سريع جداً واستلمت بعد معاينة الجهاز.', 5, true, '2026-10-20'),
  (2, 33, 'د. سارة خليل', 'الإسكندرية - سموحة', 'حجم الـ 8 لتر ما شاء الله كبير جداً وبياخد فرخة كاملة بالخضار. الشاشة سهلة والاستجابة فورية. شكراً باب المجال على جودة المنتج.', 5, true, '2026-10-18'),
  (3, 33, 'محمود طلبة', 'الجيزة - 6 أكتوبر', 'سعرها ممتاز جداً بالنسبة لمواصفاتها وسعتها، والتغليف كان محترم ومقفول بختم الشركة الاصلي.', 5, true, '2026-10-15')
on conflict do nothing;

select setval(pg_get_serial_sequence('public.reviews', 'id'), coalesce((select max(id) from public.reviews), 1));

-- ---------- 03_offers.sql: جدول العروض + الكوبونات + جوائز عجلة الحظ ----------
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

-- ---------- 04_shipping.sql: شركات الشحن + أسعار المحافظات ----------
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

-- ---------- 05_content.sql: السلايدر، الشركاء، مميزات المتجر، البانر، من نحن ----------
insert into public.hero_slides (id, image, subtitle, title, highlight, description, sort_order) values
  (1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&auto=format&fit=crop', 'بيتك الذكي يبدأ من هنا', 'أدوات منزلية تريح بالك', 'في بابا المجال', 'اكتشف أحدث الأجهزة الذكية وأدوات التنظيم الفاخرة المصممة خصيصاً لتوفير وقتك وجهدك اليومي بجودة عالمية.', 1),
  (2, 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1920&auto=format&fit=crop', 'ولعنا الأسعار الحقيقية في مصر', 'جودة أصلية وأسعار لا تُنافس', 'في بابا المجال', 'توليفة سحرية من أشرس أدوات الديكور والمطبخ المضمونة 100% مع ضمان حقيقي وشحن سريع لحد باب بيتك.', 2)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.hero_slides', 'id'), coalesce((select max(id) from public.hero_slides), 1));

insert into public.partners (id, name, image, sort_order) values
  (1, 'أجهزة منزلية ذكية', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&auto=format&fit=crop', 1),
  (2, 'أدوات مطبخ فاخرة', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400&auto=format&fit=crop', 2),
  (3, 'إلكترونيات حديثة', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=400&auto=format&fit=crop', 3),
  (4, 'أجهزة العناية بالمنزل', 'https://images.unsplash.com/photo-1585659722983-386f5542b6a5?q=80&w=400&auto=format&fit=crop', 4),
  (5, 'مستلزمات عصرية', 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=400&auto=format&fit=crop', 5)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.partners', 'id'), coalesce((select max(id) from public.partners), 1));

insert into public.store_features (id, icon, title, text, sort_order) values
  (1, 'Truck', 'شحن سريع وآمن', 'لجميع المحافظات بأمان تام', 1),
  (2, 'RotateCcw', 'استبدال واسترجاع', 'خلال 14 يوم بكل سهولة', 2),
  (3, 'ShieldCheck', 'ضمان أصلي 100%', 'أجهزة منزلية معتمدة ومضمونة', 3),
  (4, 'Headphones', 'دعم فني متواصل', 'مساعدة لاختيار الأجهزة 24/7', 4)
on conflict do nothing;

select setval(pg_get_serial_sequence('public.store_features', 'id'), coalesce((select max(id) from public.store_features), 1));

insert into public.content_blocks (key, data) values
  ('promoBanner', '{"label":"عروض الموسم الحصرية من بابا المجال","titleStart":"خصم حصري","highlight":"50%","titleEnd":"على أفخم تشكيلة مفروشات","text":"جدد راحة بيتك بأرقى خامات المفروشات التركية والمصرية الأصلية. جودة تناسب فخامة ذوقك وبأسعار لفترة محدودة.","buttonText":"تصفح العرض الآن","link":"/friday-offers","image":"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop","imageBadge":"توفير نصف الثمن"}'::jsonb),
  ('about', '{"badge":"الوجهة الأولى لكل بيت وعروسة في مصر","title":"لسنا مجرد متجر.. نحن","highlight":"\"باب المجال\"","intro":"المنصة الرائدة لكسر أسعار السوق، نوفر لك أجود أدوات المطبخ، الأجهزة الذكية، والمفروشات الأصلية.. جودة عالمية بسعر يناسب كل ميزانية.","storyTitle":"ليه سمينا نفسنا \"باب المجال\"؟","story1":"تأسسنا بهدف رئيسي لا حيد عنه: كسر الاحتكار والقضاء على مبالغات أسعار التجار. إذا كنت تهدف لتجهيز بيتك الجديد بأفضل شكل، فنحن نؤمن لك الحل الشامل والمباشر من المصانع والمستوردين دون حلقات وسيطة ترفع السعر.","story2":"تخصصنا يشمل أطقم الجرانيت الأصلية، القلايات الهوائية الذكية، أطقم العشاء الفاخرة، والمفروشات التي تدمج بين الشياكة المطلقة والمتانة المعمرة.","stats":[{"id":1,"icon":"Users","title":"+50 ألف","text":"عميل سعيد يثق بنا"},{"id":2,"icon":"Gem","title":"100%","text":"منتجات أصلية ومضمونة"},{"id":3,"icon":"MapPin","title":"27","text":"محافظة نغطيها بشحن سريع"},{"id":4,"icon":"Headphones","title":"24/7","text":"دعم فني ومتابعة مستمرة"}],"pillars":[{"id":1,"title":"الشفافية المطلقة","text":"المنتج الذي تراه في الصور هو ما تستلمه تماماً، بدون أي مفاجآت أو صور وهمية."},{"id":2,"title":"أسعار كسر الحتة","text":"عروضنا المستمرة مصممة خصيصاً لتوفير ميزانية بيتك وضمان أرخص سعر في مصر."},{"id":3,"title":"خدمة ما بعد البيع","text":"فريق دعم محترف يتابع معك خطوة بخطوة لتفعيل الضمان والإجابة عن أي استفسار."}],"features":[{"id":1,"icon":"PackageCheck","title":"المعاينة قبل الدفع","text":"افتح شحنتك وتأكد من جودة منتجك بنفسك بكامل الحرية قبل تسليم أي مبلغ."},{"id":2,"icon":"Gem","title":"خامات أصلية 100%","text":"مفروشات وأجهزة بأعلى المعايير العالمية بعيداً عن التقليد والخامات الرديئة."},{"id":3,"icon":"Truck","title":"توصيل آمن لكل مصر","text":"شبكة شحن سريعة بتغليف هندسي متين يحمي شحنتك حتى باب بيتك."},{"id":4,"icon":"BadgePercent","title":"باكجات العرائس الخاصة","text":"تجميعات توفير حصرية تمنحك خصومات ضخمة لتجهيز منزلك بالكامل بأقل تكلفة."}]}'::jsonb)
on conflict do nothing;

commit;
