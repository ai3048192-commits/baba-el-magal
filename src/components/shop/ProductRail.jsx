import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./ProductCard";

// شريط منتجات أفقي: سحب بالصباع على الموبايل، وأسهم رفيعة على الديسكتوب
export default function ProductRail({ products, showStock = false, perView = "lg:w-[calc((100%-4.5rem)/4)]" }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="space-y-6">
      <div ref={ref} className="no-scrollbar flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:-mx-2 sm:px-2 pt-2 pb-6 -mb-4">
        {products.map((p, i) => (
          <div key={p.id} className={`snap-start shrink-0 w-[68%] sm:w-[44%] md:w-[31%] ${perView}`}>
            <ProductCard product={p} index={i} showStock={showStock} />
          </div>
        ))}
      </div>
      {products.length > 3 && (
        <div className="hidden md:flex items-center justify-center gap-3">
          <button onClick={() => scroll(1)} className="w-11 h-11 border border-ink/20 text-ink flex items-center justify-center hover:bg-ink hover:text-white dark:hover:text-neutral-950 transition cursor-pointer" aria-label="السابق">
            <ChevronRight size={18} strokeWidth={1.6} />
          </button>
          <button onClick={() => scroll(-1)} className="w-11 h-11 border border-ink/20 text-ink flex items-center justify-center hover:bg-ink hover:text-white dark:hover:text-neutral-950 transition cursor-pointer" aria-label="التالي">
            <ChevronLeft size={18} strokeWidth={1.6} />
          </button>
        </div>
      )}
    </div>
  );
}
