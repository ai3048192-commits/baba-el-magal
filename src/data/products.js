// جدول المنتجات — كل منتجات الموقع في مكان واحد
// sections = أماكن ظهور المنتج:
//   catalog   → صفحة المتجر وصفحات الأقسام
//   featured  → شبكة "منتجات مختارة" في الرئيسية
//   discounts → ركن الخصومات (الرئيسية + /discounts)
//   bestseller→ الأكثر طلباً (أعلى صفحة عروض الجمعة)

const img = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

const base = {
  description: "",
  oldPrice: 0,
  rating: 4.5,
  reviewsCount: 0,
  images: [],
  badge: "",
  tag: "",
  stock: 20,
  totalStock: 0,
  features: [],
  specs: [],
  colors: [],
  active: true,
};

const p = (data) => ({ ...base, ...data });

export const products = [
  // ===== المتجر العام (كانت في ShopPage) =====
  p({ id: 1, name: "طقم حلل جرانيت تركي أصلي 10 قطع - غطاء زجاجي مقاوم للحرارة", price: 4500, oldPrice: 5500, rating: 5, categoryId: "kitchen", subcategory: "حلل، طاسات وأطقم طهي كاملة", image: img("1584269600464-37b1b58a9fe7"), badge: "الأكثر طلباً", tag: "إصدار 2026", sections: ["catalog", "featured"] }),
  p({ id: 2, name: "خلاط يدوي هاند بلندر متعدد الوظائف 1000 وات - أداء جبار", price: 1200, oldPrice: 1500, rating: 4.8, categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)", image: img("1570222094114-d074f7e1e6e5"), badge: "تخفيض خاص", tag: "الأعلى ريڤيو", sections: ["catalog", "featured"] }),
  p({ id: 3, name: "طقم سكاكين ستانلس ستيل ألماني احترافي 8 قطع مع حامل خشب فاخر", price: 950, oldPrice: 1100, rating: 4.5, categoryId: "kitchen", subcategory: "أدوات تقطيع، سكاكين ومقاور", image: img("1593618998160-cacffd50f113"), badge: "حصري", tag: "احترافي", sections: ["catalog", "featured"] }),
  p({ id: 4, name: "ماكينة قهوة اسبريسو ديجيتال باللبن - صانعة البهجة الصباحية", price: 7800, oldPrice: 8900, rating: 4.9, categoryId: "electrical", subcategory: "أجهزة القهوة والمشروبات", image: img("1517668808822-9ebb02f2a0e1"), badge: "فاخر", tag: "VIP", sections: ["catalog", "featured"] }),
  p({ id: 5, name: "طقم منظمات ثلاجة ومطبخ شفافة محكمة الغلق - 6 قطع بريميوم", price: 550, oldPrice: 700, rating: 4.7, categoryId: "kitchen", subcategory: "أطقم التوابل، البرطمانات وحفظ الطعام", image: img("1584568694244-14fbdf83bd30"), badge: "عرض نار", tag: "عملي", sections: ["catalog", "featured"] }),
  p({ id: 6, name: "قلاية هوائية أير فرير ديجيتال سعة 6 لتر - بدون زيت صحية", price: 4200, oldPrice: 5000, rating: 4.9, categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)", image: img("1556910103-1c02745aae4d"), badge: "الأكثر مبيعاً", tag: "صحي", sections: ["catalog", "featured"] }),
  p({ id: 7, name: "طقم عشاء بورسلين تركي فاخر 60 قطعة كامل للعرائس", price: 9500, oldPrice: 11000, rating: 4.8, categoryId: "kitchen", subcategory: "أطقم عشاء، أكواب ومجّات", image: img("1615870216519-2f9fa575fa5c"), badge: "مميز", tag: "عرائس", sections: ["catalog", "featured"] }),
  p({ id: 8, name: "ميزان مطبخ رقمي ذكي بشاشة ليد حساسة حتى 10 كجم", price: 350, oldPrice: 450, rating: 4.3, categoryId: "kitchen", subcategory: "مصفاة، ملاعق سيليكون وأدوات غرف", image: img("1556911220-e15b29be8c8f"), badge: "ذكي", tag: "إصدار محدث", sections: ["catalog"] }),
  p({ id: 9, name: "غلاية مياه كهربائية ستانلس ستيل 1.7 لتر حماية ضد الجفاف", price: 680, oldPrice: 850, rating: 4.4, categoryId: "electrical", subcategory: "أجهزة القهوة والمشروبات", image: img("1594213985161-d448c4842e0f"), badge: "خصم", tag: "سريع", sections: ["catalog"] }),
  p({ id: 10, name: "طقم صواني فرن تيفال مقاومة للالتصاق 3 قطع بمقاسات مختلفة", price: 1350, oldPrice: 1600, rating: 4.6, categoryId: "kitchen", subcategory: "صواني الفرن، قوالب الكيك والبوتاجاز", image: img("1588854337236-6889d631faa8"), badge: "رائج", tag: "أساسي", sections: ["catalog"] }),
  p({ id: 11, name: "ماكينة صنع القهوة التركية البن اليدوية والكهربائية", price: 890, oldPrice: 1100, rating: 4.2, categoryId: "electrical", subcategory: "أجهزة القهوة والمشروبات", image: img("1514432324607-a09d9b4aefdd"), badge: "جديد", tag: "أصلي", sections: ["catalog"] }),
  p({ id: 12, name: "علب توابل مغناطيسية معدنية ستانلس ستيل مع حامل جداري - 12 قطعة", price: 450, oldPrice: 600, rating: 4.7, categoryId: "kitchen", subcategory: "أطقم التوابل، البرطمانات وحفظ الطعام", image: img("1596797038530-2c107229654b"), badge: "منظم ذكي", tag: "عملي", sections: ["catalog"] }),

  // ===== المفروشات (كانت في LinensPage) =====
  p({ id: 13, name: "طقم ملايات سرير قطن مصري 100% - 4 قطع (سرير كبير)", price: 850, oldPrice: 1100, rating: 4.9, categoryId: "linens", subcategory: "ملايات سرير، بطاطين وألحفة", image: img("1522771739844-6a9f6d5f14af"), badge: "الأكثر طلباً", tag: "قطن خالص", sections: ["catalog"] }),
  p({ id: 14, name: "بطانية شتوية ثقيلة مزدوجة الطبقات - ناعمة ودافئة للغاية", price: 1250, oldPrice: 1600, rating: 4.8, categoryId: "linens", subcategory: "ملايات سرير، بطاطين وألحفة", image: img("1584100936595-c0654b55a2e2"), badge: "عرض شتوي", tag: "تدفئة فائقة", sections: ["catalog"] }),
  p({ id: 15, name: "طقم ستائر غرف نوم ومسحوق شيفون فاخر مع بلتاكين", price: 950, oldPrice: 1300, rating: 4.6, categoryId: "linens", subcategory: "ستائر ومفارش شيفون وبلتاكين", image: img("1513694203232-719a280e022f"), badge: "تصميم عصري", tag: "ديكور", sections: ["catalog"] }),
  p({ id: 16, name: "وسائد نوم طبية ميموري فوم لدعم الرقبة والعمود الفقري", price: 450, oldPrice: 600, rating: 4.9, categoryId: "linens", subcategory: "خدديات، مراتب طبية ووسائد نوم", image: img("1584132967334-10e028bd69f7"), badge: "صحي ومريح", tag: "VIP", sections: ["catalog"] }),
  p({ id: 17, name: "طقم فوط وبشاكير حمام قطن تركي عالي الامتصاص - 5 قطع", price: 720, oldPrice: 950, rating: 4.7, categoryId: "linens", subcategory: "فوط، بشاكير وأرواب حمام", image: img("1616486338812-3dadae4b4ace"), badge: "تخفيض", tag: "عرائس", sections: ["catalog"] }),
  p({ id: 18, name: "مفرش سفرة مطرز فخم مع 6 كوفيرات مطابقة", price: 1100, oldPrice: 1450, rating: 4.5, categoryId: "linens", subcategory: "مفارش سفرة ومجالس عربية", image: img("1615870216519-2f9fa575fa5c"), badge: "جديد", tag: "سفرة", sections: ["catalog"] }),

  // ===== ركن الخصومات (كانت في Discounts) =====
  p({ id: 19, name: "طقم حلل جرانيت تركي أصلي 10 قطع - خصم حارق لفترة محدودة", price: 3800, oldPrice: 5500, rating: 4.9, categoryId: "kitchen", subcategory: "حلل، طاسات وأطقم طهي كاملة", image: img("1584269600464-37b1b58a9fe7"), badge: "عرض نار", tag: "وفر 1700 جنيه", sections: ["discounts"] }),
  p({ id: 20, name: "ماكينة قهوة اسبريسو ديجيتال باللبن - عرض العرائس الحصري", price: 6500, oldPrice: 8900, rating: 5, categoryId: "electrical", subcategory: "أجهزة القهوة والمشروبات", image: img("1517668808822-9ebb02f2a0e1"), badge: "تخفيض كبير", tag: "عرائس VIP", sections: ["discounts"] }),
  p({ id: 21, name: "قلاية هوائية أير فرير ديجيتال سعة 6 لتر - عرض خاص جداً", price: 3499, oldPrice: 5000, rating: 4.8, categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)", image: img("1556910103-1c02745aae4d"), badge: "توفير هائل", tag: "بدون زيت", sections: ["discounts"] }),
  p({ id: 22, name: "طقم عشاء بورسلين تركي فاخر 60 قطعة كامل - سعر لقطة", price: 7999, oldPrice: 11000, rating: 4.9, categoryId: "kitchen", subcategory: "أطقم عشاء، أكواب ومجّات", image: img("1615870216519-2f9fa575fa5c"), badge: "تصفية موسمية", tag: "الأكثر طلباً", sections: ["discounts"] }),

  // ===== صفقات الجمعة — بتظهر عن طريق عرض "صفقات يوم الجمعة" في src/data/offers.js =====
  p({ id: 23, name: "ماكينة ديلونجي اسبريسو ومشروبات دافئة باللبن", price: 2999, oldPrice: 4800, rating: 4.8, reviewsCount: 142, stock: 8, categoryId: "electrical", subcategory: "أجهزة القهوة والمشروبات", image: img("1517668808822-9ebb02f2a0e1"), sections: [] }),
  p({ id: 24, name: "طقم عشاء بورسلين تركي فاخر 60 قطعة كامل", price: 6499, oldPrice: 9500, rating: 4.9, reviewsCount: 89, stock: 3, categoryId: "kitchen", subcategory: "أطقم عشاء، أكواب ومجّات", image: img("1615870216519-2f9fa575fa5c"), sections: [] }),
  p({ id: 25, name: "مفرش سرير قطيفة شتوي 5 قطع مبطن بالكامل", price: 850, oldPrice: 1600, rating: 4.7, reviewsCount: 210, stock: 12, categoryId: "linens", subcategory: "ملايات سرير، بطاطين وألحفة", image: img("1522771739844-6a9f6d5f14af"), sections: [] }),
  p({ id: 26, name: "خلاط مولينكس متعدد الوظائف 3*1 دورق زجاجي", price: 1199, oldPrice: 2200, rating: 4.9, reviewsCount: 315, stock: 5, categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)", image: img("1570222094114-d054a817e56b"), sections: [] }),
  p({ id: 27, name: "طقم مقالي سيراميك صحي 3 قطع مقاسات مختلفة", price: 1350, oldPrice: 2100, rating: 4.6, reviewsCount: 76, stock: 9, categoryId: "kitchen", subcategory: "حلل، طاسات وأطقم طهي كاملة", image: img("1583947215259-38e31be8751f"), sections: [] }),
  p({ id: 28, name: "مكواة بخار عامودية ملابس وستائر 2000 واط", price: 1899, oldPrice: 2900, rating: 4.8, reviewsCount: 184, stock: 7, categoryId: "home-tools", subcategory: "أدوات الغسيل، الكوي ومستلزمات الغسالات", image: img("1610557892470-55d9e80c0bce"), sections: [] }),
  p({ id: 29, name: "طقم سكاكين ياباني استانلس ستيل 6 قطع مع حامل", price: 799, oldPrice: 1400, rating: 4.9, reviewsCount: 420, stock: 2, categoryId: "kitchen", subcategory: "أدوات تقطيع، سكاكين ومقاور", image: img("1593618998160-e34014e67546"), sections: [] }),
  p({ id: 30, name: "صانعة سندوتشات ووافل 4*1 ديجيتال", price: 1450, oldPrice: 2300, rating: 4.7, reviewsCount: 95, stock: 11, categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)", image: img("1565299585323-38d6b0865b47"), sections: [] }),

  // ===== الأكثر طلباً هذا الأسبوع (أعلى صفحة الجمعة) =====
  p({
    id: 31,
    name: "طقم حلل جرانيت تركي سافلون 12 قطعة كامل - الإصدار الفاخر",
    description: "مصنوع من 7 طبقات جرانيت نقي عالي التوصيل للحرارة. يد غير موصلة للحرارة مع أغطية بايركس مقوى نقي ضد الكسر.",
    features: ["ضمان 5 سنوات ضد التلصيق", "خالي تماماً من مواد PFOA الضارة", "مناسب لجميع أنواع البوتاجازات (غاز/كهرباء)"],
    price: 4999, oldPrice: 8500, rating: 4.9, reviewsCount: 328, stock: 6, totalStock: 30,
    badge: "الأكثر طلباً 🔥", categoryId: "kitchen", subcategory: "حلل، طاسات وأطقم طهي كاملة",
    image: img("1584269600464-37b1b58a9fe7", 1000), sections: ["bestseller"],
  }),
  p({
    id: 32,
    name: "قلاية هوائية فيليبس XXL دبل باسكيت 7.2 لتر - العصر الذهبي للصحة",
    description: "شاشة ديجيتال باللمس مع 8 برامج طهي مسبقة الإعداد. تقنية Rapid Air لتقليل الدهون بنسبة 90%.",
    features: ["سعة ضخمة تكفي لعائلة 6 أفراد", "شاشة إلكترونية تفاعلية", "سلة متحركة سهلة التنظيف بالصحون"],
    price: 5200, oldPrice: 8900, rating: 5, reviewsCount: 512, stock: 4, totalStock: 25,
    badge: "صفقة الموسم ⚡", categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)",
    image: img("1556910103-1c02745aae4d", 1000), sections: ["bestseller"],
  }),

  // ===== منتج كامل التفاصيل (كان في ProductsPage) =====
  p({
    id: 33,
    name: "قلاية هوائية ذكية (Airfryer Pro) سعة 8 لتر - إصدار باب المجال الفاخر",
    description: "تقنية طهي بالدوران الهوائي السريع بزاوية 360° لإنقاص نسبة الدهون 90%. تأتي مع شاشة Touch لمسية ذكية و12 برنامج طهي محدد مسبقاً.",
    price: 3499, oldPrice: 4999, rating: 4.9, reviewsCount: 1247,
    badge: "خصم حصري 30%", tag: "شحن مجاني اليوم",
    categoryId: "electrical", subcategory: "أجهزة مطبخ صغيرة (خلاطات، قلايات)",
    image: img("1585515320310-259814833e62", 1000),
    images: [img("1556911220-e15b29be8c8f", 1000), img("1544025162-d76694265947", 1000), img("1507048331197-7d4ac70811cf", 1000)],
    colors: [
      { name: "أسود ملكي فاخر", code: "#111111" },
      { name: "فضي ميتاليك", code: "#777777" },
      { name: "أبيض لؤلؤي", code: "#eeeeee" },
    ],
    specs: [
      { label: "السعة الفعلية", value: "8.0 لتر (تكفي عائلة 6-8 أفراد)" },
      { label: "القدرة الكهربائية", value: "2200 واط (طهي فائق السرعة)" },
      { label: "نوع الشاشة", value: "شاشة LED باللمس الذكي" },
      { label: "نطاق درجة الحرارة", value: "80°C إلى 200°C" },
      { label: "المؤقت التلقائي", value: "حتى 60 دقيقة مع إيقاف آلي" },
      { label: "طلاء السلة", value: "تيفلون مانع للالتصاق خالي من PFOA" },
      { label: "برامج الطهي", value: "12 برنامج معدة مسبقاً" },
      { label: "الضمان المعتمد", value: "24 شهر ضد عيوب التصنيع" },
    ],
    features: [
      "تقنية RapidAir 360°: توزيع الهواء الساخن بالتساوي للحصول على طعام مقرمش بدون زيت.",
      "سلة سريعة التنظيف: حلة داخلية قابلة للفك وسهلة الغسيل في غسالة الأطباق.",
      "توفير 60% كهرباء: نظام تسخين ذكي يقلل استهلاك الطاقة مقارنة بالأفران التقليدية.",
      "أمان كامل للأطفال: مقبض بارد عازل للحرارة وقفل أمان يمنع الانزلاق.",
    ],
    sections: ["catalog", "featured"],
  }),
];
