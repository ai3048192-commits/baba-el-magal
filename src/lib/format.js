// دوال مساعدة للعرض والحسابات

export const formatPrice = (n) => `${Number(n || 0).toLocaleString("ar-EG")} ج.م`;

export const formatNumber = (n) => Number(n || 0).toLocaleString("ar-EG");

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
};

export const formatDateTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
};

export const discountPercent = (product) => {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
};

export const nextId = (items) =>
  items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

// حالات الطلب بالترتيب — أول 6 هي خطوات شريط التتبع
export const ORDER_STATUSES = [
  { id: "new", label: "تم استلام الطلب", short: "جديد", className: "bg-brand/10 text-brand border-brand/30" },
  { id: "confirmed", label: "تم تأكيد الطلب", short: "مؤكد", className: "bg-violet-400/10 text-violet-300 border-violet-400/30" },
  { id: "processing", label: "جاري التجهيز والتغليف", short: "قيد التجهيز", className: "bg-amber-400/10 text-amber-400 border-amber-400/30" },
  { id: "shipped", label: "تم التسليم لشركة الشحن", short: "تم الشحن", className: "bg-sky-400/10 text-sky-400 border-sky-400/30" },
  { id: "out_for_delivery", label: "خرج مع المندوب للتوصيل", short: "خرج للتوصيل", className: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30" },
  { id: "delivered", label: "تم التسليم للعميل", short: "تم التسليم", className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30" },
  { id: "cancelled", label: "تم إلغاء الطلب", short: "ملغي", className: "bg-ink/5 text-muted border-ink/10" },
  { id: "returned", label: "مرتجع", short: "مرتجع", className: "bg-ink/5 text-muted border-ink/10" },
];

export const TRACK_STEPS = ORDER_STATUSES.slice(0, 6);

export const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export const PAYMENT_METHODS = {
  cod: "الدفع عند الاستلام",
  card: "بطاقة ائتمان",
  wallet: "محفظة إلكترونية",
  fawry: "خدمة فوري",
};

export const SECTIONS = [
  { id: "catalog", label: "المتجر والأقسام" },
  { id: "featured", label: "منتجات مختارة (الرئيسية)" },
  { id: "discounts", label: "ركن الخصومات" },
  { id: "bestseller", label: "الأكثر طلباً" },
];

export const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية",
  "الغربية", "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "الفيوم",
  "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
  "مطروح", "البحر الأحمر", "الوادي الجديد", "السويس", "الإسماعيلية",
  "بورسعيد", "شمال سيناء", "جنوب سيناء",
];

// أسماء أقسام الصفحة الرئيسية (للترتيب والإخفاء من الإعدادات)
export const HOME_SECTION_LABELS = {
  hero: "السلايدر الرئيسي",
  categories: "تسوق حسب الأقسام",
  todayDeals: "عروض النهارده",
  deals: "ركن الخصومات",
  banner: "البانر الترويجي",
  featured: "منتجات مختارة",
  steps: "خطوات الطلب",
  partners: "شريط الشركاء",
};
