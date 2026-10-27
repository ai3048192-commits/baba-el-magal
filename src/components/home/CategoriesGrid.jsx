import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { Container, Reveal, SectionHeader } from "../ui";

// تسوق حسب الأقسام — صور طولية وتحتها الاسم (أسلوب المجلات)
export default function CategoriesGrid() {
  const { db, products } = useStore();
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const inCat = (id) => products.filter((p) => p.active && p.categoryId === id);

  return (
    <section dir="rtl" className="py-20 sm:py-28 bg-base">
      <Container>
        <SectionHeader eyebrow="المجموعات" title="تسوق حسب" highlight="القسم" subtitle="كل اللي بيتك محتاجه، متقسم ومختار بعناية." />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {categories.map((cat, i) => {
            const items = inCat(cat.id);
            return (
              <Reveal key={cat.id} i={i}>
                <Link to={`/category/${cat.id}`} className="group card-soft card-hover block text-center p-2.5 h-full">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-deep">
                    {items[0]?.image && <img src={items[0].image} alt={cat.name} loading="lazy" className="img-zoom w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-700" />
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pill-soft bg-white/90 text-neutral-900 !text-[11px] !px-4 !py-2">
                      تسوق الآن
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-[14px] font-bold text-ink group-hover:text-brand transition">{cat.name}</h3>
                  <span className="block pb-1.5 text-[11px] text-faint">{items.length} منتج</span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <Link to="/shop" className="btn-link">
            كل المنتجات <ArrowLeft size={14} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
