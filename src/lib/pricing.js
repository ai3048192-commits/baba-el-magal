// حساب إجمالي الطلب: المجموع، الكوبون، الشحن حسب المحافظة، والعربون

export function shippingFor(db, governorate) {
  const zone = db.shippingZones.find((z) => z.governorate === governorate);
  return zone ? { fee: Number(zone.fee), days: zone.days } : { fee: Number(db.settings.shippingFee || 0), days: "" };
}

export function calcTotals(items, db, { coupon = null, governorate = "", paymentMethod = "cod" } = {}) {
  const { settings } = db;
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  let discount = 0;
  const freeOver = Number(settings.freeShippingOver || 0); // 0 = مفيش شحن مجاني
  let freeShip = freeOver > 0 && subtotal >= freeOver;
  if (coupon?.type === "percent") discount = Math.round((subtotal * coupon.value) / 100);
  if (coupon?.type === "fixed") discount = Math.min(subtotal, Number(coupon.value));
  if (coupon?.type === "shipping") freeShip = true;

  const zone = shippingFor(db, governorate);
  const shipping = freeShip ? 0 : zone.fee;
  const total = subtotal - discount + shipping;

  // العربون: للدفع عند الاستلام بس، ومن حد أدنى للطلب
  const d = settings.deposit || {};
  let deposit = 0;
  if (d.enabled && paymentMethod === "cod" && subtotal >= Number(d.minOrder || 0)) {
    deposit = d.type === "fixed" ? Number(d.value) : Math.round((total * Number(d.value)) / 100);
    deposit = Math.min(deposit, total);
  }

  return { subtotal, discount, shipping, total, deposit, dueOnDelivery: total - deposit, shippingDays: zone.days };
}
