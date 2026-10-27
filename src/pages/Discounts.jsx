import { Zap, ShieldCheck, Percent, Timer } from "lucide-react";
import { useStore } from "../store/StoreContext";
import ProductCard from "../components/shop/ProductCard";
import { Container, PageHero, Countdown, EmptyState } from "../components/ui";
import usePageTitle from "../lib/usePageTitle";

// ركن الخصومات الكبرى (/discounts)
export default function Discounts() {
  usePageTitle("الخصومات");
  const { db, products: allProducts } = useStore();
  const deals = allProducts.filter((p) => p.active && p.sections.includes("discounts"));

  return (
    <div dir="rtl" className="pb-24">
      <PageHero
        eyebrow="عروض محدودة"
        title="ركن"
        highlight="الخصومات الكبرى"
        subtitle="تخفيضات حصرية ومحدودة الوقت على تشكيلة مختارة بعناية لتناسب احتياجات منزلك."
      >
        <div className="card-soft px-6 py-4 flex items-center gap-4">
          <div className="p-2.5 bg-brand/10 rounded-2xl text-brand border border-brand/20">
            <Timer size={20} className="animate-pulse" />
          </div>
          <Countdown endAt={db.settings.discountsEndAt} />
        </div>
      </PageHero>

      <Container className="mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            [Zap, "شحن سريع ومجاني للطلبات الكبرى"],
            [ShieldCheck, "ضمان أصلي 100% مع الاستبدال"],
            [Percent, "أعلى نسب توفير لهذا الموسم"],
          ].map(([I, text]) => (
            <div key={text} className="flex items-center gap-3.5 px-4 py-4 card-soft">
              <div className="p-2 rounded-lg bg-brand/10 text-brand"><I size={18} /></div>
              <span className="text-xs sm:text-sm font-medium text-ink-2">{text}</span>
            </div>
          ))}
        </div>

        {deals.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-products gap-3 sm:gap-5">
            {deals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <EmptyState title="لا توجد خصومات حالياً" text="تابعنا، العروض الجديدة جاية قريب!" />
        )}
      </Container>
    </div>
  );
}
