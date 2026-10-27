// ===== جدول العروض (يومية / أسبوعية / لفترة) =====
// kind:
//   daily  → شغال كل يوم
//   weekly → شغال في أيام محددة من الأسبوع (weekdays: 0 الأحد … 5 الجمعة، 6 السبت)
//   range  → شغال من startDate لحد endDate
// discountPercent: خصم إضافي على سعر المنتج وقت العرض (0 = السعر زي ما هو)
export const offers = [
  {
    id: 1,
    title: "صفقات يوم الجمعة",
    subtitle: "تخفيضات كل جمعة — ينتهي العرض بنفاذ الكمية",
    kind: "weekly",
    weekdays: [5],
    startDate: "",
    endDate: "",
    productIds: [23, 24, 25, 26, 27, 28, 29, 30],
    discountPercent: 0,
    badge: "عرض الجمعة",
    showOnHome: false,
    active: true,
  },
  {
    id: 2,
    title: "صفقة اليوم",
    subtitle: "خصم إضافي 10% على القلاية الهوائية — كل يوم لحد آخر الليل",
    kind: "daily",
    weekdays: [],
    startDate: "",
    endDate: "",
    productIds: [6],
    discountPercent: 10,
    badge: "صفقة اليوم",
    showOnHome: true,
    active: true,
  },
  {
    id: 3,
    title: "ثلاثاء المفروشات",
    subtitle: "خصم 15% على كل المفروشات يوم الثلاثاء",
    kind: "weekly",
    weekdays: [2],
    startDate: "",
    endDate: "",
    productIds: [13, 14, 15, 16, 17, 18],
    discountPercent: 15,
    badge: "ثلاثاء المفروشات",
    showOnHome: true,
    active: true,
  },
  {
    id: 4,
    title: "سبت المطبخ",
    subtitle: "خصم 10% على أدوات المطبخ المختارة كل سبت",
    kind: "weekly",
    weekdays: [6],
    startDate: "",
    endDate: "",
    productIds: [1, 3, 5, 7, 10, 12],
    discountPercent: 10,
    badge: "سبت المطبخ",
    showOnHome: true,
    active: true,
  },
];

// جوائز عجلة الحظ (صفحة عروض الجمعة) — code فاضي = "حظ أوفر"
export const wheelPrizes = [
  { id: 1, label: "خصم 10%", code: "MAGAL10", color: "#E50914" },
  { id: 2, label: "شحن مجاني", code: "FREESHIP", color: "#121216" },
  { id: 3, label: "خصم 15%", code: "MAGAL15", color: "#E50914" },
  { id: 4, label: "كاش باك 100ج", code: "CASH100", color: "#121216" },
  { id: 5, label: "خصم 20%", code: "MAGAL20", color: "#E50914" },
  { id: 6, label: "حظ سعيد المره الجاية", code: "", color: "#121216" },
];

// كوبونات الخصم المقبولة في السلة
// type: percent = نسبة، fixed = مبلغ ثابت، shipping = شحن مجاني
export const coupons = [
  { id: 1, code: "MAGAL10", type: "percent", value: 10, active: true },
  { id: 2, code: "MAGAL15", type: "percent", value: 15, active: true },
  { id: 3, code: "MAGAL20", type: "percent", value: 20, active: true },
  { id: 4, code: "CASH100", type: "fixed", value: 100, active: true },
  { id: 5, code: "FREESHIP", type: "shipping", value: 0, active: true },
];
