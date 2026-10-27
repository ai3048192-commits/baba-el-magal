import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import ProductCard from "../shop/ProductCard";
import { Container, SectionHeader, Countdown, Reveal } from "../ui";

// ركن الخصومات في الرئيسية
export default function DealsSection({ limit = 4 }) {
  const { db, products: allProducts } = useStore();
  const deals = allProducts.filter((p) => p.active && p.sections.includes("discounts")).slice(0, limit);
  if (!deals.length) return null;

  return (
    <section dir="rtl" className="py-20 sm:py-28 bg-base">
      <Container>
        <SectionHeader
          eyebrow="لفترة محدودة"
          title="ركن"
          highlight="الخصومات"
          subtitle="تخفيضات حصرية على تشكيلة مختارة — لحد ما الكمية تخلص."
          action={<Countdown endAt={db.settings.discountsEndAt} compact />}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-products gap-3 sm:gap-5">
          {deals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <Reveal className="mt-14 text-center">
          <Link to="/discounts" className="btn-link">
            كل الخصومات <ArrowLeft size={14} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
