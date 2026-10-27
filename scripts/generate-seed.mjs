// بيولّد ملفات البيانات من src/data — شغّله بعد أي تعديل في البيانات الافتراضية:
//   npm run db:seed
// الناتج: database/seed/01_… → 06_… (كل جزء لوحده) + database/seed.sql (كله في ملف واحد)
import { mkdirSync, writeFileSync } from "node:fs";
import { products } from "../src/data/products.js";
import { categories } from "../src/data/categories.js";
import { reviews } from "../src/data/reviews.js";
import { settings } from "../src/data/settings.js";
import { heroSlides, promoBanner, partners, storeFeatures, about } from "../src/data/content.js";
import { offers, wheelPrizes, coupons } from "../src/data/offers.js";
import { shippingCompanies, shippingZones } from "../src/data/shipping.js";

const q = (v) => (v === null || v === undefined || v === "" ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v === null || v === undefined || v === "" ? "null" : Number(v));
const b = (v) => (v ? "true" : "false");
const json = (v) => `${q(JSON.stringify(v ?? null))}::jsonb`;
const textArr = (arr = []) => (arr.length ? `array[${arr.map(q).join(", ")}]::text[]` : "'{}'::text[]");
const intArr = (arr = [], type = "int") => `'{${arr.join(",")}}'::${type}[]`;

// كل جزء ملف لوحده — section() بتبدأ جزء جديد
const parts = [];
const section = (file, title) => parts.push({ file, title, lines: [] });
const add = (s) => parts[parts.length - 1].lines.push(s);
const insert = (table, cols, rows) => {
  if (!rows.length) return;
  add(`insert into public.${table} (${cols.join(", ")}) values\n${rows.map((r) => `  (${r.join(", ")})`).join(",\n")}\non conflict do nothing;\n`);
};
const resetSeq = (table) => add(`select setval(pg_get_serial_sequence('public.${table}', 'id'), coalesce((select max(id) from public.${table}), 1));\n`);

// الإعدادات (من غير كلمة مرور الأدمن ومفاتيح الربط)
// eslint-disable-next-line no-unused-vars
const { adminPassword, integrations, ...publicSettings } = settings;
section("01_settings.sql", "إعدادات الموقع (كل مفتاح صف) + إعدادات ربط المخزن");
insert("site_settings", ["key", "value"], Object.entries(publicSettings).map(([k, v]) => [q(k), json(v)]));
insert("integration_settings", ["key", "value"], [[q("inventory"), json(integrations.inventory)]]);

section("02_catalog.sql", "الأقسام والأقسام الفرعية والمنتجات والتقييمات");
insert("categories", ["id", "name", "icon", "sort_order"], categories.map((c) => [q(c.id), q(c.name), q(c.icon), n(c.order)]));
insert(
  "subcategories",
  ["category_id", "name", "sort_order"],
  categories.flatMap((c) => c.subcategories.map((s, i) => [q(c.id), q(s), n(i + 1)])),
);

insert(
  "products",
  ["id", "name", "description", "price", "old_price", "rating", "reviews_count", "category_id", "subcategory", "image", "images", "badge", "tag", "stock", "total_stock", "features", "specs", "colors", "sections", "active"],
  products.map((p) => [
    n(p.id), q(p.name), q(p.description || ""), n(p.price), n(p.oldPrice || 0), n(p.rating), n(p.reviewsCount || 0),
    q(p.categoryId), q(p.subcategory), q(p.image), textArr(p.images), q(p.badge || ""), q(p.tag || ""), n(p.stock), n(p.totalStock || 0),
    textArr(p.features), json(p.specs || []), json(p.colors || []), textArr(p.sections), b(p.active),
  ]),
);
resetSeq("products");

insert(
  "reviews",
  ["id", "product_id", "name", "city", "comment", "rating", "approved", "created_at"],
  reviews.map((r) => [n(r.id), n(r.productId), q(r.name), q(r.city), q(r.comment), n(r.rating), b(r.approved), q(r.date)]),
);
resetSeq("reviews");

section("03_offers.sql", "جدول العروض + الكوبونات + جوائز عجلة الحظ");
insert(
  "offers",
  ["id", "title", "subtitle", "kind", "weekdays", "start_date", "end_date", "product_ids", "discount_percent", "badge", "show_on_home", "active"],
  offers.map((o) => [n(o.id), q(o.title), q(o.subtitle), q(o.kind), intArr(o.weekdays), q(o.startDate), q(o.endDate), intArr(o.productIds, "bigint"), n(o.discountPercent), q(o.badge), b(o.showOnHome), b(o.active)]),
);
resetSeq("offers");
insert("coupons", ["id", "code", "type", "value", "active"], coupons.map((c) => [n(c.id), q(c.code), q(c.type), n(c.value), b(c.active)]));
resetSeq("coupons");
insert("wheel_prizes", ["id", "label", "code", "color", "sort_order"], wheelPrizes.map((w, i) => [n(w.id), q(w.label), q(w.code || ""), q(w.color), n(i + 1)]));
resetSeq("wheel_prizes");

section("04_shipping.sql", "شركات الشحن + أسعار المحافظات");
insert(
  "shipping_companies",
  ["id", "name", "provider", "logo", "phone", "tracking_url", "estimated_days", "cod_supported", "active"],
  shippingCompanies.map((c) => [n(c.id), q(c.name), q(c.provider), q(c.logo || ""), q(c.phone || ""), q(c.trackingUrl || ""), q(c.estimatedDays), b(c.codSupported), b(c.active)]),
);
resetSeq("shipping_companies");
insert(
  "shipping_company_credentials",
  ["company_id", "enabled", "base_url"],
  shippingCompanies.map((c) => [n(c.id), b(c.api?.enabled), q(c.api?.baseUrl || "")]),
);
insert("shipping_zones", ["id", "governorate", "fee", "days"], shippingZones.map((z) => [n(z.id), q(z.governorate), n(z.fee), q(z.days)]));
resetSeq("shipping_zones");

section("05_content.sql", "السلايدر، الشركاء، مميزات المتجر، البانر، من نحن");
insert("hero_slides", ["id", "image", "subtitle", "title", "highlight", "description", "sort_order"], heroSlides.map((h, i) => [n(h.id), q(h.image), q(h.subtitle), q(h.title), q(h.highlight), q(h.description), n(i + 1)]));
resetSeq("hero_slides");
insert("partners", ["id", "name", "image", "sort_order"], partners.map((p, i) => [n(p.id), q(p.name), q(p.image), n(i + 1)]));
resetSeq("partners");
insert("store_features", ["id", "icon", "title", "text", "sort_order"], storeFeatures.map((f, i) => [n(f.id), q(f.icon), q(f.title), q(f.text), n(i + 1)]));
resetSeq("store_features");
insert("content_blocks", ["key", "data"], [[q("promoBanner"), json(promoBanner)], [q("about"), json(about)]]);

const date = new Date().toISOString().slice(0, 10);
const header = (name, title) =>
  `-- =====================================================================
--  ${name} — ${title}
--  اتولّد تلقائياً من src/data (${date}) — ماتعدلش هنا، عدّل src/data وشغّل npm run db:seed
--  آمن يتشغل أكتر من مرة (on conflict do nothing)
-- =====================================================================
`;

const NL = "\n";
const dir = new URL("../database/seed/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const p of parts) {
  writeFileSync(new URL(p.file, dir), [header(p.file, p.title), "begin;", "", ...p.lines, "commit;", ""].join(NL), "utf8");
}
const all = [
  header("seed.sql", "كل البيانات في ملف واحد (بعد schema.sql)"),
  "begin;",
  "",
  ...parts.flatMap((p) => [`-- ---------- ${p.file}: ${p.title} ----------`, ...p.lines]),
  "commit;",
  "",
].join(NL);
writeFileSync(new URL("../database/seed.sql", import.meta.url), all, "utf8");
console.log(`✓ database/seed/ (${parts.length} ملفات) + seed.sql — ${products.length} منتج، ${categories.length} قسم، ${offers.length} عرض، ${shippingCompanies.length} شركات شحن`);
