import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import ProductCard from "../shop/ProductCard";
import { Container, Reveal, SectionHeader } from "../ui";

// منتجات مختارة — تبويبات نصية بخط تحتها
export default function FeaturedProducts() {
  const { db, products: allProducts } = useStore();
  const featured = allProducts.filter((p) => p.active && p.sections.includes("featured"));
  const cats = db.categories.filter((c) => featured.some((p) => p.categoryId === c.id));
  const [tab, setTab] = useState("all");
  const list = (tab === "all" ? featured : featured.filter((p) => p.categoryId === tab)).slice(0, 8);

  if (!featured.length) return null;

  return (
    <section dir="rtl" className="py-20 sm:py-28 bg-base">
      <Container>
        <SectionHeader eyebrow="مختارات" title="الأكثر" highlight="حباً" subtitle="المنتجات اللي عملاءنا بيرجعولها كل مرة." />
        <Reveal className="flex justify-center gap-8 mb-12 border-b border-ink/10 overflow-x-auto no-scrollbar">
          {[{ id: "all", name: "الكل" }, ...cats].map((c) => (
            <button
              key={c.id}
              onClick={() => setTab(c.id)}
              className={`relative shrink-0 pb-3 text-[13px] font-bold tracking-wide transition-colors cursor-pointer ${tab === c.id ? "text-ink" : "text-faint hover:text-ink"}`}
            >
              {c.name}
              <span className={`absolute bottom-0 inset-x-0 h-0.5 bg-brand origin-right transition-transform duration-500 ${tab === c.id ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </Reveal>
        <div key={tab} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-products gap-3 sm:gap-5">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <Reveal className="mt-14 text-center">
          <Link to="/shop" className="btn-outline">
            اكتشف المتجر كله <ArrowLeft size={15} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
