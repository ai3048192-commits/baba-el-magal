// شركات الشحن + مناطق الشحن (سعر ومدة لكل محافظة)
// trackingUrl: رابط التتبع عند الشركة، و {tracking} بيتبدل برقم البوليصة
// api: بيانات الربط — بتتبعت للسيرفر (Supabase Edge Function) مش من المتصفح
const emptyApi = { enabled: false, baseUrl: "", apiKey: "", apiSecret: "", accountId: "", pickupLocationId: "" };

export const shippingCompanies = [
  {
    id: 1,
    name: "مندوب المتجر",
    provider: "manual",
    logo: "",
    phone: "01000000000",
    trackingUrl: "",
    estimatedDays: "1-3",
    codSupported: true,
    active: true,
    api: emptyApi,
  },
  {
    id: 2,
    name: "Bosta",
    provider: "bosta",
    logo: "",
    phone: "",
    trackingUrl: "https://bosta.co/tracking-shipments?shipment-number={tracking}",
    estimatedDays: "2-4",
    codSupported: true,
    active: true,
    api: { ...emptyApi, baseUrl: "https://app.bosta.co/api/v2" },
  },
  {
    id: 3,
    name: "Aramex",
    provider: "aramex",
    logo: "",
    phone: "",
    trackingUrl: "https://www.aramex.com/eg/ar/track/results?ShipmentNumber={tracking}",
    estimatedDays: "2-5",
    codSupported: true,
    active: false,
    api: { ...emptyApi, baseUrl: "https://ws.aramex.net/ShippingAPI.V2" },
  },
  {
    id: 4,
    name: "Mylerz",
    provider: "mylerz",
    logo: "",
    phone: "",
    trackingUrl: "",
    estimatedDays: "2-4",
    codSupported: true,
    active: false,
    api: emptyApi,
  },
];

// مناطق الشحن — أي محافظة مش هنا بتاخد سعر الشحن الافتراضي من الإعدادات
export const shippingZones = [
  { id: 1, governorate: "القاهرة", fee: 50, days: "1-2" },
  { id: 2, governorate: "الجيزة", fee: 50, days: "1-2" },
  { id: 3, governorate: "الإسكندرية", fee: 60, days: "2-3" },
  { id: 4, governorate: "القليوبية", fee: 55, days: "1-3" },
  { id: 5, governorate: "أسوان", fee: 90, days: "4-6" },
  { id: 6, governorate: "البحر الأحمر", fee: 90, days: "4-6" },
];
