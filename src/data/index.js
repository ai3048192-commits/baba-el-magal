// قاعدة البيانات الافتراضية للموقع (Seed)
// أول مرة يفتح الموقع بتتحفظ في المتصفح، وبعدها الأدمن يعدّل عليها من /admin
// نفس البيانات دي موجودة كـ SQL في database/seed.sql (بتتولد بـ npm run db:seed)
import { products } from "./products";
import { categories } from "./categories";
import { reviews } from "./reviews";
import { settings } from "./settings";
import { heroSlides, promoBanner, partners, storeFeatures, about } from "./content";
import { offers, wheelPrizes, coupons } from "./offers";
import { shippingCompanies, shippingZones } from "./shipping";

// زوّد الرقم ده لما تضيف جداول/إعدادات جديدة — البيانات المحفوظة بتتدمج مع الجديدة تلقائياً
export const DB_VERSION = 2;

export const defaultDb = {
  version: DB_VERSION,
  settings,
  categories,
  products,
  reviews,
  heroSlides,
  promoBanner,
  partners,
  storeFeatures,
  about,
  offers,
  wheelPrizes,
  coupons,
  shippingCompanies,
  shippingZones,
  orders: [],
  subscribers: [],
};
