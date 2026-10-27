// الربط مع Supabase عن طريق REST مباشرة (من غير مكتبات إضافية)
// الإعدادات بتيجي من لوحة التحكم ← الإعدادات ← الربط، أو من ملف .env:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
// الجداول والدوال (place_order / track_order) في database/schema.sql

const SESSION_KEY = "bem_sb_session";

export function getConfig(settings) {
  const i = settings?.integrations || {};
  const url = (i.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const key = i.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  const functionsUrl = (i.functionsUrl || (url ? `${url}/functions/v1` : "")).replace(/\/$/, "");
  return url && key ? { url, key, functionsUrl } : null;
}

async function request(cfg, path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await fetch(`${cfg.url}${path}`, {
    method,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${token || cfg.key}`,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || data?.error_description || data?.msg || `HTTP ${res.status}`);
  return data;
}

export const rpc = (cfg, fn, args, token) => request(cfg, `/rest/v1/rpc/${fn}`, { method: "POST", body: args, token });

export async function testConnection(cfg) {
  await request(cfg, "/rest/v1/categories?select=id&limit=1");
  return true;
}

// ===== العميل =====
export const remotePlaceOrder = (cfg, order) => rpc(cfg, "place_order", { payload: order });
export const remoteTrackOrder = (cfg, number, phone) => rpc(cfg, "track_order", { p_number: number, p_phone: phone });

// ===== الأدمن (تسجيل دخول Supabase Auth — المستخدم لازم يكون في جدول admins) =====
export async function signIn(cfg, email, password) {
  const data = await request(cfg, "/auth/v1/token?grant_type=password", { method: "POST", body: { email, password } });
  const session = { token: data.access_token, email, expiresAt: Date.now() + data.expires_in * 1000 };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export function getSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    return s && s.expiresAt > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export function signOut() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

// تحويل طلب من شكل قاعدة البيانات لشكل الموقع
const fromRow = (o) => ({
  id: `remote-${o.id}`,
  remoteId: o.id,
  number: o.number,
  status: o.status,
  createdAt: o.created_at,
  customer: {
    name: o.customer_name, phone: o.phone, phone2: o.phone2, governorate: o.governorate, city: o.city,
    address: o.address, landmark: o.landmark, preferredTime: o.preferred_time, notes: o.notes,
  },
  items: (o.order_items || []).map((i) => ({ productId: i.product_id, name: i.name, image: i.image, price: Number(i.price), qty: i.qty, color: i.color })),
  history: (o.order_events || []).sort((a, b) => (a.created_at > b.created_at ? 1 : -1)).map((e) => ({ status: e.status, note: e.note, at: e.created_at })),
  paymentMethod: o.payment_method,
  payment: { walletPhone: o.wallet_phone, ref: o.wallet_ref, fawryCode: o.fawry_code },
  coupon: o.coupon_code,
  subtotal: Number(o.subtotal), discount: Number(o.discount), shipping: Number(o.shipping), total: Number(o.total),
  deposit: { amount: Number(o.deposit_amount), paid: o.deposit_paid, phone: o.deposit_phone, ref: o.deposit_ref },
  shippingCompanyId: o.shipping_company_id,
  trackingNumber: o.tracking_number || "",
  remote: true,
});

export async function remoteListOrders(cfg, token) {
  const rows = await request(cfg, "/rest/v1/orders?select=*,order_items(*),order_events(*)&order=created_at.desc&limit=500", { token });
  return rows.map(fromRow);
}

export async function remoteUpdateOrder(cfg, token, order, event) {
  await request(cfg, `/rest/v1/orders?id=eq.${order.remoteId}`, {
    method: "PATCH",
    token,
    headers: { Prefer: "return=minimal" },
    body: {
      status: order.status,
      tracking_number: order.trackingNumber || null,
      shipping_company_id: order.shippingCompanyId || null,
      deposit_paid: !!order.deposit?.paid,
    },
  });
  if (event) {
    await request(cfg, "/rest/v1/order_events", {
      method: "POST",
      token,
      headers: { Prefer: "return=minimal" },
      body: { order_id: order.remoteId, status: event.status, note: event.note || null },
    });
  }
}

// ===== Edge Functions (شركات الشحن / المخزن) =====
export async function callFunction(cfg, name, body, token) {
  const res = await fetch(`${cfg.functionsUrl}/${name}`, {
    method: "POST",
    headers: { apikey: cfg.key, Authorization: `Bearer ${token || cfg.key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

// ===== رفع بيانات لوحة التحكم كلها لـ Supabase (upsert — مش بيمسح حاجة) =====
const upsert = (cfg, token, table, rows, onConflict = "id") =>
  rows.length
    ? request(cfg, `/rest/v1/${table}?on_conflict=${onConflict}`, {
        method: "POST",
        token,
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: rows,
      })
    : Promise.resolve();

export async function pushAllToSupabase(cfg, token, db) {
  // eslint-disable-next-line no-unused-vars
  const { adminPassword, integrations, ...publicSettings } = db.settings;
  const steps = [
    ["site_settings", Object.entries(publicSettings).map(([key, value]) => ({ key, value })), "key"],
    ["integration_settings", [{ key: "inventory", value: integrations?.inventory || {} }], "key"],
    ["categories", db.categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, sort_order: c.order }))],
    ["subcategories", db.categories.flatMap((c) => c.subcategories.map((name, i) => ({ category_id: c.id, name, sort_order: i + 1 }))), "category_id,name"],
    ["products", db.products.map((p) => ({
      id: p.id, name: p.name, description: p.description || "", price: p.price, old_price: p.oldPrice || 0, rating: p.rating,
      reviews_count: p.reviewsCount || 0, category_id: p.categoryId, subcategory: p.subcategory || null, image: p.image,
      images: p.images || [], badge: p.badge || "", tag: p.tag || "", stock: p.stock, total_stock: p.totalStock || 0,
      features: p.features || [], specs: p.specs || [], colors: p.colors || [], sections: p.sections || [], active: p.active,
    }))],
    ["offers", db.offers.map((o) => ({
      id: o.id, title: o.title, subtitle: o.subtitle, kind: o.kind, weekdays: o.weekdays, start_date: o.startDate || null,
      end_date: o.endDate || null, product_ids: o.productIds, discount_percent: o.discountPercent, badge: o.badge,
      show_on_home: o.showOnHome, active: o.active,
    }))],
    ["coupons", db.coupons.map(({ id, code, type, value, active }) => ({ id, code, type, value, active }))],
    ["wheel_prizes", db.wheelPrizes.map((w, i) => ({ id: w.id, label: w.label, code: w.code || "", color: w.color, sort_order: i + 1 }))],
    ["shipping_companies", db.shippingCompanies.map((c) => ({
      id: c.id, name: c.name, provider: c.provider, logo: c.logo || "", phone: c.phone || "", tracking_url: c.trackingUrl || "",
      estimated_days: c.estimatedDays || "", cod_supported: c.codSupported, active: c.active,
    }))],
    ["shipping_company_credentials", db.shippingCompanies.map((c) => ({
      company_id: c.id, enabled: !!c.api?.enabled, base_url: c.api?.baseUrl || "", api_key: c.api?.apiKey || "",
      api_secret: c.api?.apiSecret || "", account_id: c.api?.accountId || "", pickup_location_id: c.api?.pickupLocationId || "",
    })), "company_id"],
    ["shipping_zones", db.shippingZones.map(({ id, governorate, fee, days }) => ({ id, governorate, fee, days }))],
    ["hero_slides", db.heroSlides.map((h, i) => ({ id: h.id, image: h.image, subtitle: h.subtitle, title: h.title, highlight: h.highlight, description: h.description, sort_order: i + 1 }))],
    ["partners", db.partners.map((p, i) => ({ id: p.id, name: p.name, image: p.image, sort_order: i + 1 }))],
    ["store_features", db.storeFeatures.map((f, i) => ({ id: f.id, icon: f.icon, title: f.title, text: f.text, sort_order: i + 1 }))],
    ["content_blocks", [{ key: "promoBanner", data: db.promoBanner }, { key: "about", data: db.about }], "key"],
  ];
  for (const [table, rows, onConflict] of steps) await upsert(cfg, token, table, rows, onConflict);
  return steps.length;
}

// ===== تحميل بيانات الموقع العامة من Supabase (بيشتغل عند فتح الموقع لكل الزوار) =====
// بيرجع بس الجداول اللي فيها بيانات — عشان قاعدة بيانات فاضية ما تمسحش الموقع
export async function pullPublicData(cfg) {
  const get = (path) => request(cfg, `/rest/v1/${path}`);
  const [settingsRows, cats, subs, products, offers, prizes, companies, zones, slides, partners, features, blocks, reviews] = await Promise.all([
    get("site_settings?select=key,value"),
    get("categories?select=*&order=sort_order"),
    get("subcategories?select=*&order=sort_order"),
    get("products?select=*&order=id"),
    get("offers?select=*&order=id"),
    get("wheel_prizes?select=*&order=sort_order"),
    get("shipping_companies?select=*&order=id"),
    get("shipping_zones?select=*&order=id"),
    get("hero_slides?select=*&order=sort_order"),
    get("partners?select=*&order=sort_order"),
    get("store_features?select=*&order=sort_order"),
    get("content_blocks?select=key,data"),
    get("reviews?select=*&order=created_at.desc&limit=500"),
  ]);
  const out = {};
  if (settingsRows.length) out.settings = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));
  if (cats.length)
    out.categories = cats.map((c) => ({ id: c.id, name: c.name, icon: c.icon, order: c.sort_order, subcategories: subs.filter((s) => s.category_id === c.id).map((s) => s.name) }));
  if (products.length)
    out.products = products.map((p) => ({
      id: p.id, name: p.name, description: p.description, price: Number(p.price), oldPrice: Number(p.old_price), rating: Number(p.rating),
      reviewsCount: p.reviews_count, categoryId: p.category_id, subcategory: p.subcategory || "", image: p.image, images: p.images || [],
      badge: p.badge, tag: p.tag, stock: p.stock, totalStock: p.total_stock, features: p.features || [], specs: p.specs || [],
      colors: p.colors || [], sections: p.sections || [], active: p.active,
    }));
  if (offers.length)
    out.offers = offers.map((o) => ({
      id: o.id, title: o.title, subtitle: o.subtitle, kind: o.kind, weekdays: o.weekdays || [], startDate: o.start_date || "", endDate: o.end_date || "",
      productIds: (o.product_ids || []).map(Number), discountPercent: Number(o.discount_percent), badge: o.badge, showOnHome: o.show_on_home, active: o.active,
    }));
  if (prizes.length) out.wheelPrizes = prizes.map(({ id, label, code, color }) => ({ id, label, code, color }));
  if (companies.length)
    out.shippingCompanies = companies.map((c) => ({
      id: c.id, name: c.name, provider: c.provider, logo: c.logo, phone: c.phone, trackingUrl: c.tracking_url, estimatedDays: c.estimated_days,
      codSupported: c.cod_supported, active: c.active, api: { enabled: false, baseUrl: "", apiKey: "", apiSecret: "", accountId: "", pickupLocationId: "" },
    }));
  if (zones.length) out.shippingZones = zones.map((z) => ({ id: z.id, governorate: z.governorate, fee: Number(z.fee), days: z.days }));
  if (slides.length) out.heroSlides = slides.map(({ id, image, subtitle, title, highlight, description }) => ({ id, image, subtitle, title, highlight, description }));
  if (partners.length) out.partners = partners.map(({ id, name, image }) => ({ id, name, image }));
  if (features.length) out.storeFeatures = features.map(({ id, icon, title, text }) => ({ id, icon, title, text }));
  blocks.forEach((b) => (out[b.key] = b.data));
  if (reviews.length)
    out.reviews = reviews.map((r) => ({ id: r.id, productId: r.product_id, name: r.name, city: r.city, comment: r.comment, rating: r.rating, date: r.created_at, approved: r.approved }));
  return out;
}

// تقييم أو اشتراك من الزائر (مسموح بالـ RLS)
export const remoteInsert = (cfg, table, row) =>
  request(cfg, `/rest/v1/${table}`, { method: "POST", headers: { Prefer: "return=minimal" }, body: row });
