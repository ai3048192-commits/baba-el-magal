import { useState } from "react";
import { CalendarClock, Flame, Timer } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { isOfferActive, offerEndsAt, offersOn } from "../lib/offers";
import { WEEKDAYS } from "../lib/format";
import usePageTitle from "../lib/usePageTitle";
import ProductCard from "../components/shop/ProductCard";
import { Container, Countdown, EmptyState, PageHero, PrimaryLink, SectionHeader } from "../components/ui";

const next7Days = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

// عروض اليوم (/offers) + جدول عروض الأسبوع
export default function Offers() {
  usePageTitle("عروض اليوم");
  const { db, products } = useStore();
  const days = next7Days();
  const [selected, setSelected] = useState(0);
  const today = offersOn(db.offers);
  const dayOffers = offersOn(db.offers, days[selected]);

  return (
    <div dir="rtl" className="pb-24">
      <PageHero
        eyebrow={`عروض ${WEEKDAYS[new Date().getDay()]}`}
        title="عروض"
        highlight="النهارده"
        subtitle="كل يوم عروض جديدة بتبدأ الساعة 12 بالليل وبتخلص آخر اليوم — تابع الجدول وماتفوتش عرضك."
      >
        <div className="card-soft px-6 py-4 flex items-center gap-4">
          <div className="p-2.5 bg-brand/10 rounded-2xl text-brand border border-brand/20"><Timer size={20} className="animate-pulse" /></div>
          <Countdown label="عروض النهارده بتخلص خلال" />
        </div>
      </PageHero>

      <Container className="mt-10 space-y-14">
        {today.length === 0 && (
          <EmptyState icon={CalendarClock} title="مفيش عروض شغالة النهارده" text="شوف جدول الأسبوع تحت وارجعلنا في يوم العرض." action={<PrimaryLink to="/shop">تسوق المنتجات</PrimaryLink>} />
        )}

        {today.map((offer) => {
          const items = products.filter((p) => p.active && offer.productIds.includes(p.id));
          if (!items.length) return null;
          return (
            <section key={offer.id}>
              <SectionHeader
                eyebrow={<><Flame size={11} className="inline" /> {offer.badge || "عرض اليوم"}</>}
                title={offer.title}
                highlight={offer.discountPercent > 0 ? `خصم ${offer.discountPercent}%` : ""}
                subtitle={offer.subtitle}
                action={
                  <div className="bg-card border border-ink/10 px-4 py-3 rounded-2xl">
                    <Countdown endAt={offerEndsAt(offer)} compact label="ينتهي خلال" />
                  </div>
                }
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-products gap-3 sm:gap-5">
                {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} showStock />)}
              </div>
            </section>
          );
        })}

        {/* جدول الأسبوع */}
        <section className="card-soft p-5 sm:p-8">
          <SectionHeader eyebrow="جدول العروض" title="عروض" highlight="الأسبوع ده" subtitle="اختار اليوم وشوف العروض اللي مستنياك." />
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-6">
            {days.map((d, i) => {
              const count = db.offers.filter((o) => isOfferActive(o, d)).length;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`rounded-2xl border p-2 sm:p-3 text-center transition cursor-pointer ${
                    selected === i ? "bg-brand border-brand text-white" : "bg-card border-ink/10 text-ink-3 hover:border-brand/40"
                  }`}
                >
                  <div className="text-[10px] sm:text-xs font-bold">{i === 0 ? "النهارده" : WEEKDAYS[d.getDay()]}</div>
                  <div className="text-lg sm:text-2xl font-black mt-1">{d.getDate()}</div>
                  <div className={`text-[9px] sm:text-[10px] mt-1 ${selected === i ? "text-ink/80" : "text-faint"}`}>{count} عرض</div>
                </button>
              );
            })}
          </div>
          {dayOffers.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dayOffers.map((o) => {
                const items = products.filter((p) => o.productIds.includes(p.id)).slice(0, 4);
                return (
                  <div key={o.id} className="flex items-center gap-4 p-4 card-soft">
                    <div className="flex -space-x-3 space-x-reverse shrink-0">
                      {items.map((p) => <img key={p.id} src={p.image} alt="" className="w-11 h-11 rounded-2xl object-cover border-2 border-card" />)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-ink">{o.title}</div>
                      <div className="text-[11px] text-muted line-clamp-1">{o.subtitle}</div>
                    </div>
                    {o.discountPercent > 0 && <span className="mr-auto shrink-0 text-xs font-black text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-lg">-{o.discountPercent}%</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-xs text-faint py-6">مفيش عروض متسجلة في اليوم ده.</p>
          )}
        </section>
      </Container>
    </div>
  );
}
