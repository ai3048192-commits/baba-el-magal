-- =====================================================================
--  05_content.sql — السلايدر، الشركاء، مميزات المتجر، البانر، من نحن
--  اتولّد تلقائياً من src/data (2026-10-27) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================

begin;

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
