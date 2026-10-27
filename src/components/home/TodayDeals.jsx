import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { offerEndsAt, offersOn } from "../../lib/offers";
import { WEEKDAYS } from "../../lib/format";
import ProductRail from "../shop/ProductRail";
import { Container, Countdown, Eyebrow, Reveal } from "../ui";

// عروض النهارده — لوح جانبي فيه العداد + شريط المنتجات
export default function TodayDeals() {
  const { db, products } = useStore();
  const live = offersOn(db.offers).filter((o) => o.showOnHome);
  if (!live.length) return null;
  const ids = new Set(live.flatMap((o) => o.productIds));
  const items = products.filter((p) => p.active && ids.has(p.id)).slice(0, 10);
  if (!items.length) return null;
  const main = live[0];

  return (
    <section dir="rtl" className="py-20 sm:py-28 bg-deep border-y border-ink/10">
      <Container>
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-start">
          <Reveal variant="right" className="lg:sticky lg:top-24 card-soft p-7 sm:p-8 text-center lg:text-right space-y-6">
            <Eyebrow>عروض {WEEKDAYS[new Date().getDay()]}</Eyebrow>
            <h2 className="text-3xl sm:text-[2.6rem] font-light text-ink leading-[1.25]">
              {live.length > 1 ? "عروض" : main.title} <strong className="font-black">{live.length > 1 ? "النهارده" : main.discountPercent ? `−${main.discountPercent}%` : ""}</strong>
            </h2>
            <p className="text-sm text-muted leading-loose">{live.map((o) => o.subtitle || o.title).join(" — ")}</p>
            <div className="py-6 border-y border-ink/10">
              <Countdown endAt={offerEndsAt(main)} label="العرض بيخلص خلال" />
            </div>
            <Link to="/offers" className="btn-ink w-full !rounded-full">
              جدول عروض الأسبوع <ArrowLeft size={15} />
            </Link>
          </Reveal>
          <ProductRail products={items} showStock perView="lg:w-[calc((100%-3rem)/3)]" />
        </div>
      </Container>
    </section>
  );
}
