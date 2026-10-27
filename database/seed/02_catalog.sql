-- =====================================================================
--  02_catalog.sql — الأقسام والأقسام الفرعية والمنتجات والتقييمات
--  اتولّد تلقائياً من src/data (2026-10-27) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================

begin;

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

commit;
