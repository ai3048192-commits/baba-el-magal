import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Truck, Lock, ArrowRight, Heart, Minus, Plus, TicketPercent, X, ShieldCheck, RotateCcw, HandCoins, MapPin } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatPrice, GOVERNORATES, PAYMENT_METHODS } from "../lib/format";
import { calcTotals, shippingFor } from "../lib/pricing";
import CheckoutModal from "../components/shop/CheckoutModal";
import ProductRail from "../components/shop/ProductRail";
import CheckoutSteps from "../components/shop/CheckoutSteps";
import { Container, EmptyState, PrimaryLink, Reveal, SectionHeader } from "../components/ui";
import usePageTitle from "../lib/usePageTitle";

// سلة المشتريات (/cart)
export default function Cart() {
  usePageTitle("سلة المشتريات");
  const { db, products, cartItems, updateCartQty, removeFromCart, clearCart, toggleWishlist, wishlist, showToast } = useStore();
  const [checkout, setCheckout] = useState(false);
  const [governorate, setGovernorate] = useState("القاهرة");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);

  const totals = calcTotals(cartItems, db, { coupon, governorate, paymentMethod: "cod" });
  const zone = shippingFor(db, governorate);
  const freeOver = Number(db.settings.freeShippingOver || 0);
  const remaining = Math.max(0, freeOver - totals.subtotal);
  const progress = freeOver ? Math.min(100, (totals.subtotal / freeOver) * 100) : 0;
  const pieces = cartItems.reduce((s, i) => s + i.qty, 0);
  const saved = cartItems.reduce((s, i) => s + Math.max(0, (i.product.oldPrice || 0) - i.product.price) * i.qty, 0);
  const payments = Object.keys(PAYMENT_METHODS).filter((m) => db.settings.paymentMethods?.[m]);

  const suggestions = useMemo(() => {
    const inCart = new Set(cartItems.map((i) => i.productId));
    return products.filter((p) => p.active && p.sections.includes("featured") && !inCart.has(p.id)).slice(0, 8);
  }, [products, cartItems]);

  const applyCoupon = (e) => {
    e.preventDefault();
    const found = db.coupons.find((c) => c.active && c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (!found) return showToast("كود الخصم غير صحيح", "error");
    setCoupon(found);
    setCouponInput("");
    showToast("تم تطبيق كود الخصم 🎉");
  };

  const moveToWishlist = (item) => {
    if (!wishlist.includes(item.product.id)) toggleWishlist(item.product);
    removeFromCart(item.key);
  };

  return (
    <div dir="rtl" className="pb-24">
      {/* الهيدر */}
      <section className="bg-deep border-b border-ink/10">
        <Container className="py-10 sm:py-14 text-center space-y-6">
          <div className="space-y-3 animate-page">
            <span className="eyebrow centered">سلة المشتريات</span>
            <h1 className="text-3xl sm:text-5xl font-light text-ink">
              سلة <strong className="font-black">مشترياتك</strong>
              {pieces > 0 && <span className="mr-3 align-middle pill-soft bg-brand/10 text-brand !text-xs">{pieces} قطعة</span>}
            </h1>
          </div>
          {cartItems.length > 0 && <div className="animate-page" style={{ animationDelay: "100ms" }}><CheckoutSteps current={0} /></div>}
        </Container>
      </section>

      <Container className="mt-10">
        {cartItems.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="السلة فاضية" text="لسه ما ضفتش حاجة — ابدأ التسوق وضيف المنتجات اللي تعجبك." action={<PrimaryLink to="/shop" className="!rounded-full">ابدأ التسوق</PrimaryLink>} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
            <div className="space-y-4">
              {/* الشحن المجاني */}
              {freeOver > 0 && (
                <Reveal className="card-soft p-5">
                  <div className="flex items-center justify-between gap-3 mb-4 text-sm">
                    {remaining > 0 ? (
                      <span className="text-ink-2">
                        فاضلك <strong className="text-brand">{formatPrice(remaining)}</strong> وتاخد <strong className="text-ink">شحن مجاني</strong>
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-500">🎉 مبروك! طلبك عليه شحن مجاني</span>
                    )}
                    <span className="text-[11px] text-faint whitespace-nowrap">الحد: {formatPrice(freeOver)}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-ink/[0.06]">
                    <div className={`absolute inset-y-0 right-0 rounded-full transition-all duration-700 ${remaining > 0 ? "bg-brand" : "bg-emerald-500"}`} style={{ width: `${progress}%` }} />
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ${remaining > 0 ? "bg-brand text-white" : "bg-emerald-500 text-white"}`}
                      style={{ right: `${progress}%` }}
                    >
                      <Truck size={14} className="-scale-x-100" />
                    </span>
                  </div>
                </Reveal>
              )}

              {/* المنتجات */}
              {cartItems.map((item, i) => {
                const p = item.product;
                const cat = db.categories.find((c) => c.id === p.categoryId);
                const colorCode = p.colors?.find((c) => c.name === item.color)?.code;
                return (
                  <div key={item.key} style={{ animationDelay: `${i * 60}ms` }} className="animate-page card-soft p-3 sm:p-4 flex gap-4">
                    <Link to={`/product/${p.id}`} className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-deep group">
                      <img src={p.image} alt="" className="w-full h-full object-cover img-zoom" />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <span className="text-[11px] text-faint">{cat?.name}</span>
                          <Link to={`/product/${p.id}`} className="block text-sm sm:text-[15px] font-bold text-ink hover:text-brand line-clamp-2 leading-relaxed transition">{p.name}</Link>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                            {item.color && (
                              <span className="inline-flex items-center gap-1.5">
                                {colorCode && <span className="w-3 h-3 rounded-full border border-ink/15" style={{ backgroundColor: colorCode }} />} {item.color}
                              </span>
                            )}
                            <span>{formatPrice(p.price)} للقطعة</span>
                            {p.deal && <span className="pill-soft bg-amber-400/15 text-amber-400 !py-0.5">{p.deal.badge || "عرض اليوم"}</span>}
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="text-base sm:text-lg font-black text-ink">{formatPrice(p.price * item.qty)}</div>
                          {p.oldPrice > p.price && <div className="text-[11px] text-faint line-through">{formatPrice(p.oldPrice * item.qty)}</div>}
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button onClick={() => updateCartQty(item.key, item.qty - 1)} className="w-9 h-9 flex items-center justify-center text-ink-2 hover:text-brand cursor-pointer" aria-label="أقل">
                            {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                          </button>
                          <span key={item.qty} className="w-8 text-center text-sm font-bold text-ink tabular-nums animate-digit">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.key, item.qty + 1)} disabled={item.qty >= p.stock} className="w-9 h-9 flex items-center justify-center text-ink-2 hover:text-brand disabled:opacity-30 cursor-pointer" aria-label="أكتر">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveToWishlist(item)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold text-muted hover:text-brand hover:bg-brand/5 transition cursor-pointer">
                            <Heart size={14} /> <span className="hidden sm:inline">للمفضلة</span>
                          </button>
                          <button onClick={() => removeFromCart(item.key)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold text-muted hover:text-brand hover:bg-brand/5 transition cursor-pointer">
                            <Trash2 size={14} /> <span className="hidden sm:inline">حذف</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between items-center px-1 pt-1">
                <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-ink transition">
                  <ArrowRight size={14} /> كمّل تسوق
                </Link>
                <button onClick={() => window.confirm("تفريغ السلة كلها؟") && clearCart()} className="text-xs font-bold text-faint hover:text-brand transition cursor-pointer">تفريغ السلة</button>
              </div>
            </div>

            {/* الملخص */}
            <aside className="card-soft p-6 space-y-5 lg:sticky lg:top-24">
              <h3 className="text-base font-black text-ink">ملخص الطلب</h3>

              <label className="block space-y-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted"><MapPin size={13} className="text-brand" /> احسب الشحن لمحافظتك</span>
                <select value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="w-full card-inset rounded-xl px-3.5 py-3 text-sm text-ink outline-none focus:ring-4 focus:ring-brand/10 cursor-pointer">
                  {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
                </select>
                {zone.days && <span className="block text-[11px] text-faint">التوصيل خلال {zone.days} يوم</span>}
              </label>

              {coupon ? (
                <div className="flex items-center justify-between card-inset rounded-xl px-3.5 py-3 text-sm">
                  <span className="flex items-center gap-2 font-bold text-emerald-500"><TicketPercent size={16} /> {coupon.code}</span>
                  <button onClick={() => setCoupon(null)} className="text-faint hover:text-brand cursor-pointer" aria-label="إلغاء الكوبون"><X size={16} /></button>
                </div>
              ) : (
                <form onSubmit={applyCoupon} className="flex items-center gap-2 card-inset rounded-xl p-1.5 focus-within:ring-4 focus-within:ring-brand/10">
                  <TicketPercent size={16} className="text-faint mr-2 shrink-0" />
                  <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="كود الخصم" className="flex-1 min-w-0 bg-transparent py-2 text-sm text-ink placeholder-faint outline-none font-mono" />
                  <button type="submit" className="px-4 py-2 rounded-lg bg-ink text-white dark:text-neutral-900 text-xs font-bold hover:bg-brand hover:text-white transition cursor-pointer">تطبيق</button>
                </form>
              )}

              <dl className="space-y-3 text-sm pt-1">
                <div className="flex justify-between text-muted"><dt>المجموع ({pieces} قطعة)</dt><dd className="text-ink font-bold">{formatPrice(totals.subtotal)}</dd></div>
                {saved > 0 && <div className="flex justify-between text-muted"><dt>وفّرت من الأسعار</dt><dd className="text-emerald-500 font-bold">{formatPrice(saved)}</dd></div>}
                {totals.discount > 0 && <div className="flex justify-between text-muted"><dt>خصم الكوبون</dt><dd className="text-emerald-500 font-bold">− {formatPrice(totals.discount)}</dd></div>}
                <div className="flex justify-between text-muted"><dt>الشحن ({governorate})</dt><dd className="font-bold">{totals.shipping ? <span className="text-ink">{formatPrice(totals.shipping)}</span> : <span className="text-emerald-500">مجاناً</span>}</dd></div>
                <div className="flex justify-between items-baseline pt-4 border-t border-dashed border-ink/15">
                  <dt className="font-black text-ink">الإجمالي</dt>
                  <dd className="text-2xl font-black text-ink">{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              {totals.deposit > 0 && payments.includes("cod") && (
                <div className="flex gap-2.5 card-inset rounded-xl p-3.5 text-[12px] text-muted leading-relaxed">
                  <HandCoins size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>لو هتدفع عند الاستلام: مطلوب عربون <strong className="text-ink">{formatPrice(totals.deposit)}</strong> والباقي للمندوب.</span>
                </div>
              )}

              <button onClick={() => setCheckout(true)} className="btn-ink w-full !rounded-full !py-4 !text-sm">
                <Lock size={16} /> إتمام الطلب
              </button>

              <div className="flex flex-wrap justify-center gap-1.5">
                {payments.map((m) => <span key={m} className="pill-soft bg-ink/[0.05] text-muted">{PAYMENT_METHODS[m]}</span>)}
              </div>

              <ul className="space-y-2 pt-4 border-t border-ink/10 text-[12px] text-muted">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> عاين المنتج قبل ما تدفع</li>
                <li className="flex items-center gap-2"><RotateCcw size={14} className="text-emerald-500" /> استبدال واسترجاع خلال 14 يوم</li>
                <li className="flex items-center gap-2"><Truck size={14} className="text-emerald-500" /> تتبع شحنتك خطوة بخطوة</li>
              </ul>
            </aside>
          </div>
        )}
      </Container>

      {suggestions.length > 0 && (
        <section className="mt-24">
          <Container>
            <SectionHeader eyebrow="ممكن يعجبك" title="كمّل" highlight="تجهيز بيتك" />
            <ProductRail products={suggestions} />
          </Container>
        </section>
      )}

      {checkout && (
        <CheckoutModal items={cartItems} initialCoupon={coupon} initialGovernorate={governorate} onClose={() => setCheckout(false)} onDone={clearCart} />
      )}
    </div>
  );
}
