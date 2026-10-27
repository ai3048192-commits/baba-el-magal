import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, Truck, RotateCcw, Star, Heart, Share2, ShoppingBag, ChevronLeft, ChevronDown, Maximize2, X, Check, Minus, Plus } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { discountPercent, formatDate, formatPrice } from "../lib/format";
import ProductCard from "../components/shop/ProductCard";
import CheckoutModal from "../components/shop/CheckoutModal";
import { Container, Countdown, EmptyState, PrimaryLink, Reveal, SectionHeader } from "../components/ui";
import usePageTitle from "../lib/usePageTitle";

const lineInput = "w-full bg-transparent border-b border-ink/20 focus:border-ink py-3 text-sm text-ink placeholder-faint outline-none transition";

// قسم بيتفتح ويتقفل (المواصفات / المميزات / الشحن)
function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-[13px] font-bold tracking-[0.15em] text-ink cursor-pointer">
        {title}
        <ChevronDown size={16} strokeWidth={1.6} className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

const StarsRow = ({ value, size = 14 }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={size} strokeWidth={1.5} className={n <= Math.round(value) ? "text-amber-400 fill-amber-400" : "text-faintest"} />)}
  </span>
);

// المفتاح بيصفّر الحالة (الصورة/الكمية/اللون) عند الانتقال لمنتج تاني
export default function ProductPage() {
  const { id } = useParams();
  return <ProductDetails key={id} id={id} />;
}

function ProductDetails({ id }) {
  const { db, products: allProducts, addToCart, toggleWishlist, wishlist, addReview, showToast } = useStore();
  const product = allProducts.find((p) => String(p.id) === id && p.active);
  usePageTitle(product?.name || "المنتج غير موجود");

  const [mainIdx, setMainIdx] = useState(0);
  const [color, setColor] = useState(product?.colors?.[0]?.name || "");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState({ name: "", city: "", comment: "", rating: 5 });

  if (!product) {
    return (
      <Container className="py-20">
        <EmptyState title="المنتج غير موجود" text="ممكن يكون اتشال أو الرابط غلط." action={<PrimaryLink to="/shop">العودة للمتجر</PrimaryLink>} />
      </Container>
    );
  }

  const gallery = [product.image, ...(product.images || [])].filter(Boolean);
  const category = db.categories.find((c) => c.id === product.categoryId);
  const reviews = db.reviews.filter((r) => r.productId === product.id && r.approved).sort((a, b) => (a.date < b.date ? 1 : -1));
  const reviewsTotal = (product.reviewsCount || 0) + reviews.length;
  const off = discountPercent(product);
  const liked = wishlist.includes(product.id);
  const out = product.stock <= 0;
  const related = allProducts.filter((p) => p.active && p.id !== product.id && p.categoryId === product.categoryId && p.sections.includes("catalog")).slice(0, 4);

  const submitReview = (e) => {
    e.preventDefault();
    if (!review.name || !review.comment) return;
    addReview({ ...review, productId: product.id, rating: Number(review.rating), city: review.city || "عميل موثق" });
    setReview({ name: "", city: "", comment: "", rating: 5 });
    setShowForm(false);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("تم نسخ رابط المنتج");
      }
    } catch {
      /* تم الإلغاء */
    }
  };

  return (
    <div dir="rtl" className="pb-28 lg:pb-0">
      {/* مسار التنقل */}
      <Container className="py-6">
        <nav className="flex items-center gap-2 text-[11px] tracking-wider text-faint overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-ink transition">الرئيسية</Link>
          <ChevronLeft size={12} />
          {category && (
            <>
              <Link to={`/category/${category.id}`} className="hover:text-ink transition">{category.name}</Link>
              <ChevronLeft size={12} />
            </>
          )}
          <span className="text-ink-2 truncate">{product.name}</span>
        </nav>
      </Container>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
          {/* المعرض */}
          <div className="lg:sticky lg:top-20 space-y-3 animate-page">
            <div className="relative aspect-square bg-deep overflow-hidden group rounded-[2rem] shadow-xl">
              <img key={mainIdx} src={gallery[mainIdx]} alt={product.name} className="w-full h-full object-cover animate-fade-in img-zoom" />
              <div className="absolute top-4 right-4 flex flex-col items-start gap-1.5">
                {off > 0 && <span className="pill-soft bg-white/90 text-brand !text-xs shadow-sm">−{off}%</span>}
                {product.badge && <span className="pill-soft bg-neutral-900/70 text-white !text-xs">{product.badge}</span>}
              </div>
              <button onClick={() => setZoom(true)} className="absolute bottom-4 left-4 w-11 h-11 rounded-full shadow-md bg-white/90 text-neutral-900 flex items-center justify-center hover:bg-white transition cursor-pointer" aria-label="تكبير">
                <Maximize2 size={17} strokeWidth={1.6} />
              </button>
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {gallery.map((src, idx) => (
                  <button key={idx} onClick={() => setMainIdx(idx)} className={`aspect-square overflow-hidden rounded-2xl bg-deep transition cursor-pointer ${mainIdx === idx ? "ring-2 ring-brand ring-offset-2 ring-offset-base" : "opacity-60 hover:opacity-100"}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="space-y-7 animate-page" style={{ animationDelay: "120ms" }}>
            <div className="space-y-4">
              {category && <span className="eyebrow">{category.name}</span>}
              <h1 className="text-3xl sm:text-4xl font-light text-ink leading-[1.3]">{product.name}</h1>
              <div className="flex items-center gap-3 text-xs text-muted">
                <StarsRow value={product.rating} />
                <span>{product.rating}</span>
                <span className="text-faintest">|</span>
                <span>{reviewsTotal} تقييم</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 py-5 border-y border-ink/10">
              <span className="text-3xl font-black text-ink">{formatPrice(product.price * qty)}</span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-base text-faint line-through">{formatPrice(product.oldPrice * qty)}</span>
                  <span className="text-xs font-bold text-brand tracking-wider">وفّر {formatPrice((product.oldPrice - product.price) * qty)}</span>
                </>
              )}
            </div>

            {product.deal && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 card-inset !border-r-4 !border-r-brand">
                <div>
                  <div className="text-[10px] tracking-[0.25em] font-bold text-brand">{product.deal.badge || "عرض اليوم"}</div>
                  <div className="text-sm font-bold text-ink mt-1">{product.deal.title}{product.deal.percent ? ` — خصم إضافي ${product.deal.percent}%` : ""}</div>
                </div>
                <Countdown endAt={product.deal.endsAt} compact label="" />
              </div>
            )}

            {product.description && <p className="text-[15px] text-muted leading-loose">{product.description}</p>}

            {product.colors?.length > 0 && (
              <div className="space-y-3">
                <div className="text-[11px] font-bold tracking-[0.2em] text-ink">اللون: <span className="text-muted font-normal tracking-normal">{color}</span></div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      className={`w-10 h-10 rounded-full p-1 border transition cursor-pointer ${color === c.name ? "border-ink" : "border-transparent hover:border-ink/30"}`}
                    >
                      <span className="block w-full h-full rounded-full border border-ink/15" style={{ backgroundColor: c.code }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center border border-ink/15 rounded-full">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-[52px] flex items-center justify-center text-ink-2 hover:text-brand cursor-pointer" aria-label="أقل"><Minus size={15} /></button>
                  <span className="w-10 text-center text-sm font-bold text-ink tabular-nums">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-[52px] flex items-center justify-center text-ink-2 hover:text-brand cursor-pointer" aria-label="أكتر"><Plus size={15} /></button>
                </div>
                <button onClick={() => addToCart(product, qty, color)} disabled={out} className="btn-ink flex-1 !rounded-full">
                  <ShoppingBag size={17} strokeWidth={1.8} /> {out ? "نفدت الكمية" : "أضف للسلة"}
                </button>
              </div>
              <button onClick={() => setCheckout(true)} disabled={out} className="btn-outline w-full !rounded-full">اشتري الآن</button>
              <div className="flex items-center justify-center gap-8 pt-2 text-xs font-bold tracking-wider">
                <button onClick={() => toggleWishlist(product)} className={`inline-flex items-center gap-2 transition cursor-pointer ${liked ? "text-brand" : "text-muted hover:text-ink"}`}>
                  <Heart size={16} strokeWidth={1.6} className={liked ? "fill-brand" : ""} /> {liked ? "في المفضلة" : "أضف للمفضلة"}
                </button>
                <button onClick={share} className="inline-flex items-center gap-2 text-muted hover:text-ink transition cursor-pointer">
                  <Share2 size={16} strokeWidth={1.6} /> مشاركة
                </button>
              </div>
              {!out && product.stock <= 10 && <p className="text-center text-xs font-bold text-brand">باقي {product.stock} قطع بس في المخزن</p>}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[[Truck, "توصيل 48 ساعة"], [ShieldCheck, "ضمان أصلي"], [RotateCcw, "استرجاع 14 يوم"]].map(([I, t]) => (
                <div key={t} className="card-inset py-5 space-y-2">
                  <I size={20} strokeWidth={1.4} className="mx-auto text-brand" />
                  <div className="text-[11px] font-bold tracking-wide text-ink-2">{t}</div>
                </div>
              ))}
            </div>

            <div>
              {product.specs?.length > 0 && (
                <Accordion title="المواصفات" defaultOpen>
                  <dl className="divide-y divide-ink/5 text-sm">
                    {product.specs.map((s, i) => (
                      <div key={i} className="flex justify-between gap-4 py-3">
                        <dt className="text-muted">{s.label}</dt>
                        <dd className="text-ink font-bold text-left">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Accordion>
              )}
              {product.features?.length > 0 && (
                <Accordion title="المميزات" defaultOpen={!product.specs?.length}>
                  <ul className="space-y-3">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                        <Check size={15} className="text-brand shrink-0 mt-1" /> {f}
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}
              <Accordion title="الشحن والاسترجاع">
                <ul className="space-y-2.5 text-sm text-muted leading-relaxed">
                  <li>• شحن لكل المحافظات — مجاني للطلبات فوق {formatPrice(db.settings.freeShippingOver)}.</li>
                  <li>• تقدر تعاين المنتج قبل ما تدفع.</li>
                  <li>• استبدال واسترجاع خلال 14 يوم.</li>
                  <li>• تابع شحنتك برقم الطلب من صفحة <Link to="/track" className="text-ink underline">التتبع</Link>.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </Container>

      {/* التقييمات */}
      <section className="mt-24 py-20 bg-deep border-y border-ink/10">
        <Container>
          <div className="grid lg:grid-cols-[300px_1fr] gap-12">
            <Reveal className="card-soft p-8 h-fit text-center lg:text-right space-y-4">
              <span className="eyebrow">آراء العملاء</span>
              <div className="text-7xl font-light text-ink tabular-nums">{product.rating}</div>
              <StarsRow value={product.rating} size={18} />
              <p className="text-sm text-muted">من {reviewsTotal} تقييم</p>
              <button onClick={() => setShowForm(!showForm)} className="btn-outline w-full !rounded-full">{showForm ? "إلغاء" : "اكتب رأيك"}</button>
            </Reveal>

            <div className="space-y-8">
              {showForm && (
                <form onSubmit={submitReview} className="card-soft p-8 space-y-5 animate-scale-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input required placeholder="اسمك *" value={review.name} onChange={(e) => setReview({ ...review, name: e.target.value })} className={lineInput} />
                    <input placeholder="محافظتك" value={review.city} onChange={(e) => setReview({ ...review, city: e.target.value })} className={lineInput} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold tracking-wider text-ink">تقييمك:</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setReview({ ...review, rating: n })} className="cursor-pointer" aria-label={`${n} نجوم`}>
                        <Star size={22} strokeWidth={1.4} className={n <= review.rating ? "text-amber-400 fill-amber-400" : "text-faintest"} />
                      </button>
                    ))}
                  </div>
                  <textarea required rows="3" placeholder="احكيلنا تجربتك مع المنتج..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className={lineInput} />
                  <button type="submit" className="btn-ink !rounded-full">نشر التقييم</button>
                </form>
              )}

              {reviews.length ? (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <Reveal key={r.id} i={i} className="card-soft p-6 sm:p-7">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="text-sm font-bold text-ink">{r.name} <span className="mr-2 text-[10px] font-bold tracking-wider text-emerald-400">✓ مشتري موثق</span></div>
                          <div className="text-[11px] text-faint mt-1">{r.city} · {formatDate(r.date)}</div>
                        </div>
                        <StarsRow value={r.rating} size={13} />
                      </div>
                      <p className="text-[15px] text-muted leading-loose">«{r.comment}»</p>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted py-10 text-center lg:text-right">لسه مفيش تقييمات مكتوبة — كن أول واحد يقيّم المنتج.</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeader eyebrow="ممكن يعجبك" title="منتجات" highlight="مشابهة" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </Container>
        </section>
      )}

      {zoom && (
        <div className="fixed inset-0 z-[65] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoom(false)}>
          <button className="absolute top-6 right-6 text-white/80 hover:text-white cursor-pointer" aria-label="إغلاق"><X size={28} strokeWidth={1.4} /></button>
          <img src={gallery[mainIdx]} alt={product.name} className="max-w-full max-h-[88vh] object-contain animate-scale-in" />
        </div>
      )}

      {checkout && <CheckoutModal items={[{ key: `${product.id}-${color}`, product, qty, color }]} onClose={() => setCheckout(false)} />}

      {/* شريط شراء للموبايل */}
      <div className="fixed bottom-0 inset-x-0 bg-base/95 backdrop-blur-md border-t border-ink/10 p-3 lg:hidden z-30 flex items-center gap-3">
        <div className="shrink-0">
          <span className="text-[10px] text-faint block tracking-wider">الإجمالي</span>
          <span className="text-lg font-black text-ink">{formatPrice(product.price * qty)}</span>
        </div>
        <button onClick={() => addToCart(product, qty, color)} disabled={out} className="btn-ink flex-1 !py-3.5">
          <ShoppingBag size={16} /> أضف للسلة
        </button>
      </div>
    </div>
  );
}
