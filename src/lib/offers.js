// منطق جدول العروض: العرض شغال النهارده؟ بينتهي إمتى؟ والسعر بعد العرض كام؟

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const endOfDay = (d) => {
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return e;
};

export function isOfferActive(offer, date = new Date()) {
  if (!offer.active) return false;
  if (offer.kind === "daily") return true;
  if (offer.kind === "weekly") return (offer.weekdays || []).includes(date.getDay());
  if (offer.kind === "range") {
    const today = ymd(date);
    return (!offer.startDate || today >= offer.startDate) && (!offer.endDate || today <= offer.endDate);
  }
  return false;
}

// وقت انتهاء العرض (للعداد)
export function offerEndsAt(offer, date = new Date()) {
  if (offer.kind === "range" && offer.endDate) return endOfDay(new Date(`${offer.endDate}T00:00:00`)).toISOString();
  return endOfDay(date).toISOString();
}

// أول يوم جاي العرض هيشتغل فيه (للعروض الأسبوعية)
export function nextOfferStart(offer, date = new Date()) {
  for (let i = 1; i <= 7; i++) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    if (isOfferActive(offer, d)) return d.toISOString();
  }
  return null;
}

// العروض الشغالة في يوم معين
export const offersOn = (offers, date = new Date()) => offers.filter((o) => isOfferActive(o, date));

// تطبيق العروض على المنتجات: لو المنتج في أكتر من عرض بياخد أكبر خصم
export function applyOffers(products, offers, date = new Date()) {
  const live = offersOn(offers, date);
  if (!live.length) return products;
  return products.map((p) => {
    const mine = live.filter((o) => o.productIds.includes(p.id));
    if (!mine.length) return p;
    const best = mine.reduce((a, b) => (Number(b.discountPercent) > Number(a.discountPercent) ? b : a));
    const pct = Number(best.discountPercent) || 0;
    const deal = { offerId: best.id, title: best.title, badge: best.badge, endsAt: offerEndsAt(best, date), percent: pct };
    if (!pct) return { ...p, deal };
    return {
      ...p,
      price: Math.round(p.price * (1 - pct / 100)),
      oldPrice: Math.max(p.oldPrice || 0, p.price),
      basePrice: p.price,
      deal,
    };
  });
}
