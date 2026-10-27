import { Heart, ShoppingBag, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { discountPercent, formatPrice } from "../lib/format";
import ProductCard from "../components/shop/ProductCard";
import { isOfferActive, nextOfferStart, offerEndsAt } from "../lib/offers";
import usePageTitle from "../lib/usePageTitle";
import LuckyWheel from "../components/shop/LuckyWheel";
import { Container, Countdown, Reveal, SectionHeader } from "../components/ui";

// المنتج الأكثر طلباً — صورة كبيرة جنب التفاصيل (أسلوب المجلات)
function BestsellerFeature({ item, flip }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const sold = Math.max(0, (item.totalStock || 0) - item.stock);
  const pct = item.totalStock ? (sold / item.totalStock) * 100 : 0;
  const liked = wishlist.includes(item.id);

  return (
    <article className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <Reveal variant={flip ? "left" : "right"} className={flip ? "lg:order-2" : ""}>
        <Link to={`/product/${item.id}`} className="relative block aspect-[4/3] bg-deep overflow-hidden rounded-[2rem] shadow-xl">
          <img src={item.image} alt={item.name} className="img-zoom w-full h-full object-cover" />
          <span className="absolute top-4 right-4 pill-soft bg-white/90 text-brand !text-xs shadow-sm">−{discountPercent(item)}%</span>
        </Link>
      </Reveal>
      <Reveal variant={flip ? "right" : "left"} className="space-y-6">
        {item.badge && <span className="eyebrow">{item.badge}</span>}
        <Link to={`/product/${item.id}`} className="block text-2xl sm:text-4xl font-light text-ink leading-[1.3] hover:text-brand transition">{item.name}</Link>
        {item.description && <p className="text-muted leading-loose">{item.description}</p>}
        {item.features?.length > 0 && (
          <ul className="space-y-2.5">
            {item.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-ink-3"><Check size={15} className="text-brand" /> {f}</li>
            ))}
          </ul>
        )}
        {item.totalStock > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold tracking-wider">
              <span className="text-brand">باقي {item.stock} قطع</span>
              <span className="text-faint">اتباع {sold}</span>
            </div>
            <div className="h-px bg-ink/15 relative">
              <div className="absolute inset-y-0 right-0 -top-px h-[3px] bg-brand" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
        <div className="flex items-baseline gap-4 pt-2">
          <span className="text-3xl font-black text-ink">{formatPrice(item.price)}</span>
          <span className="text-base text-faint line-through">{formatPrice(item.oldPrice)}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => addToCart(item)} className="btn-ink flex-1 sm:flex-none !rounded-full">
            <ShoppingBag size={16} /> اطلب الآن
          </button>
          <button onClick={() => toggleWishlist(item)} className={`w-[52px] rounded-full border flex items-center justify-center transition cursor-pointer ${liked ? "bg-brand border-brand text-white" : "border-ink/20 text-ink hover:border-ink"}`} aria-label="المفضلة">
            <Heart size={18} strokeWidth={1.6} className={liked ? "fill-white" : ""} />
          </button>
        </div>
      </Reveal>
    </article>
  );
}

// عروض الجمعة (/friday-offers)
export default function FridayOffers() {
  usePageTitle("عروض الجمعة");
  const { db, products } = useStore();
  const bestsellers = products.filter((p) => p.active && p.sections.includes("bestseller"));
  // عروض الجمعة = العروض الأسبوعية اللي فيها يوم الجمعة (من لوحة التحكم ← العروض)
  const fridayOffers = db.offers.filter((o) => o.active && o.kind === "weekly" && o.weekdays.includes(5));
  const ids = new Set(fridayOffers.flatMap((o) => o.productIds));
  const friday = products.filter((p) => p.active && ids.has(p.id));
  const live = fridayOffers.find((o) => isOfferActive(o));
  const startsAt = !live && fridayOffers[0] ? nextOfferStart(fridayOffers[0]) : null;
  const maxPct = Math.max(0, ...fridayOffers.map((o) => Number(o.discountPercent) || 0));

  return (
    <div dir="rtl">
      {/* الافتتاحية الغامقة */}
      <header className="bg-neutral-950 text-white">
        <Container className="py-20 sm:py-28 text-center">
          <div className="max-w-3xl mx-auto space-y-7 animate-page">
            <span className="eyebrow centered">{live ? "المهرجان شغال دلوقتي" : "كل جمعة"}</span>
            <h1 className="text-5xl sm:text-7xl font-light leading-[1.1] tracking-tight">
              عروض <strong className="font-black">الجمعة</strong>
            </h1>
            <p className="text-white/60 leading-loose max-w-xl mx-auto">
              أقوى تنزيلات الأسبوع على أجهزة المطبخ والمفروشات والأدوات المنزلية الأصلية — بكميات محدودة.
            </p>
            <div className="pt-6 [&_.text-ink]:text-white [&_.text-muted]:text-white/60 [&_.text-faint]:text-white/40">
              {live ? (
                <Countdown endAt={offerEndsAt(live)} label="بيخلص خلال" />
              ) : startsAt ? (
                <Countdown endAt={startsAt} label="بيبدأ يوم الجمعة خلال" />
              ) : null}
            </div>
          </div>
        </Container>
        <div className="border-t border-white/10">
          <Container className="grid grid-cols-3 divide-x divide-x-reverse divide-white/10 text-center text-[11px] font-bold tracking-wider text-white/70">
            <span className="py-5">شحن مجاني فوق {formatPrice(db.settings.freeShippingOver)}</span>
            <span className="py-5">منتجات أصلية بضمان</span>
            <span className="py-5">معاينة قبل الدفع</span>
          </Container>
        </div>
      </header>

      {bestsellers.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container className="space-y-24">
            <SectionHeader eyebrow="الأكثر طلباً" title="صفقات" highlight="الأسبوع" subtitle="أكتر منتجين بيتطلبوا الأسبوع ده — بخصم بيعدي 40%." />
            {bestsellers.map((item, i) => <BestsellerFeature key={item.id} item={item} flip={i % 2 === 1} />)}
          </Container>
        </section>
      )}

      {friday.length > 0 && (
        <section className="py-20 sm:py-28 bg-deep border-t border-ink/10">
          <Container>
            <SectionHeader
              eyebrow="صفقات سريعة"
              title="صفقات"
              highlight="يوم الجمعة"
              subtitle={
                live
                  ? `${live.subtitle || "تخفيضات محددة بالوقت"}${maxPct ? ` — خصم إضافي ${maxPct}% النهارده بس` : ""}`
                  : `العروض دي بتتفعل كل جمعة${maxPct ? ` بخصم إضافي ${maxPct}%` : ""} — احجز دلوقتي بالسعر الحالي`
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-products gap-3 sm:gap-5">
              {friday.map((p, i) => <ProductCard key={p.id} product={p} index={i} showStock />)}
            </div>
          </Container>
        </section>
      )}

      <LuckyWheel />
    </div>
  );
}
