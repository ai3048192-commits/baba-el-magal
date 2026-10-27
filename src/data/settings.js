// إعدادات المتجر العامة — كل حاجة هنا بتتعدل من لوحة التحكم ← الإعدادات
export const settings = {
  // ===== الهوية =====
  storeName: "baba-el-magal",
  storeNameAr: "بابا المجال",
  tagline:
    "متجرك المتكامل لتجهيز المودرن والعرائس بأرقى الأدوات المنزلية، أطقم الأواني الجرانيت والتيفال الأصلية، وأحدث الأجهزة الكهربائية الذكية للمطبخ العصري.",
  logoImage: "", // فاضي = اللوجو الافتراضي (أيقونة + اسم المتجر)
  favicon: "/favicon.svg",

  // ===== المظهر =====
  theme: {
    brand: "#E50914", // اللون الأساسي (الأزرار والعناوين الملونة)
    brandDark: "#BE123C", // لون الضغط/المرور على الأزرار
    accent: "#F43F5E", // نهاية التدرج في العناوين
    // الوضع الغامق
    bg: "#070709", // خلفية الموقع
    surface: "#121216", // خلفية الكروت
    surface2: "#0A0A0C", // خلفية الأقسام والحقول
    // الوضع الفاتح
    lightBg: "#F5F5F7",
    lightSurface: "#FFFFFF",
    lightSurface2: "#EEEEF2",
    fontBody: "Tajawal",
    fontHeading: "Tajawal",
    defaultMode: "dark", // dark / light / system (حسب جهاز الزائر) — لأول زيارة بس، وبعدها اختيار الزائر
  },

  // ===== التخطيط =====
  layout: {
    containerWidth: 80, // بالـ rem (80 = 1280px)
    productColumns: 4, // عدد أعمدة المنتجات في الشاشات الكبيرة
    homeSections: [
      { id: "hero", visible: true },
      { id: "categories", visible: true },
      { id: "todayDeals", visible: true },
      { id: "deals", visible: true },
      { id: "banner", visible: true },
      { id: "featured", visible: true },
      { id: "steps", visible: true },
      { id: "partners", visible: true },
    ],
    navCategoriesCount: 3, // كام قسم يظهر جنب "كل الأقسام" في الهيدر
    showTopBar: true,
    stickyHeader: true,
    showFloatingSocial: true,
    showNewsletter: true,
    maintenanceMode: false,
    maintenanceMessage: "الموقع تحت الصيانة وهنرجع قريب جداً بعروض جديدة 🔥",
  },

  // ===== SEO =====
  seo: {
    title: "بابا المجال | أدوات منزلية وأجهزة مطبخ ومفروشات",
    description:
      "بابا المجال — أدوات منزلية، مستلزمات مطبخ، مفروشات وأجهزة كهربائية بأفضل الأسعار في مصر مع شحن سريع ومعاينة قبل الدفع.",
    keywords: "أدوات منزلية, أجهزة مطبخ, مفروشات, جهاز عروسة, حلل جرانيت, قلاية هوائية",
    ogImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    googleAnalyticsId: "", // G-XXXXXXX
    facebookPixelId: "",
    indexing: true, // false = منع جوجل من أرشفة الموقع
    customCss: "",
  },

  // ===== التواصل =====
  phone: "01000000000",
  phoneLabel: "+20 100 000 0000 (استفسارات الأجهزة)",
  email: "orders@redstore.com",
  address: "المعرض الرئيسي: القاهرة، مصر",
  whatsappNumber: "201000000000",
  whatsappMessage:
    "مرحباً، أود الاستفسار عن الأدوات المنزلية وأطقم العرائس المتوفرة لديكم.",
  walletNumber: "01099887766",
  instapayAddress: "babaelmagal@instapay",

  social: {
    facebook: "https://facebook.com/yourstore",
    instagram: "https://instagram.com/yourstore",
    telegram: "https://t.me/yourstore",
    tiktok: "",
  },

  // ===== الشريط العلوي والإشعارات =====
  topBarText: "شحن مجاني للطلبات فوق 500 جنيه",
  notificationTitle: "التنبيهات العاجلة",
  notificationText:
    "تم تفعيل خصومات الشتاء الكبرى بنسبة 50% على كافة الأقسام!",

  // ===== الشحن =====
  shippingFee: 60, // لو المحافظة مش متسجلة في مناطق الشحن
  freeShippingOver: 500,
  defaultShippingCompanyId: 1,

  // ===== الدفع والعربون =====
  paymentMethods: { cod: true, card: false, wallet: true, fawry: true },
  deposit: {
    enabled: true,
    type: "percent", // percent = نسبة من الإجمالي، fixed = مبلغ ثابت
    value: 10,
    minOrder: 2000, // العربون مطلوب للطلبات من المبلغ ده وأكتر
    note: "العربون بيتخصم من إجمالي الطلب، والباقي بتدفعه للمندوب عند الاستلام بعد المعاينة.",
  },

  // ===== العروض =====
  discountsEndAt: "", // عداد ركن الخصومات (فاضي = نهاية اليوم)
  luckyWheelEnabled: true,

  // ===== الربط (APIs) =====
  integrations: {
    supabaseUrl: "", // https://xxxx.supabase.co
    supabaseAnonKey: "", // anon public key
    functionsUrl: "", // https://xxxx.supabase.co/functions/v1
    inventory: {
      enabled: false,
      provider: "custom", // custom / odoo / zoho / erpnext
      baseUrl: "",
      apiKey: "",
      syncStock: true,
      syncOrders: true,
      intervalMinutes: 30,
    },
  },

  // كلمة مرور لوحة التحكم (غيّرها من الإعدادات)
  adminPassword: "admin123",
};
