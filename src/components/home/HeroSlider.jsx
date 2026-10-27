import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";

const SLIDE_MS = 7000;
const pad = (n) => String(n).padStart(2, "0");

// الهيرو الكلاسيك: صورة بعرض الشاشة + نص أنيق + عداد الشرائح
export default function HeroSlider() {
  const { db } = useStore();
  const slides = db.heroSlides;
  const count = slides.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, count]);

  if (!count) return null;
  const i = index % count;
  const current = slides[i];
  const go = (d) => setIndex((x) => (x + d + count) % count);

  return (
    <section dir="rtl" className="relative w-full h-[78vh] min-h-[520px] max-h-[860px] overflow-hidden bg-neutral-950">
      {slides.map((s, idx) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-[1400ms] ${idx === i ? "opacity-100" : "opacity-0"}`}>
          <img src={s.image} alt={s.title} className={`w-full h-full object-cover ${idx === i ? "animate-kenburns" : ""}`} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/40 to-black/10" />

      <div className="relative z-10 h-full max-w-site mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div key={current.id} className="max-w-2xl text-white space-y-7">
          <span className="animate-page inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.35em] text-white/85">
            <span className="w-10 h-px bg-brand" />
            {current.subtitle}
          </span>
          <h1 className="animate-page text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.12] tracking-tight" style={{ animationDelay: "120ms" }}>
            {current.title}
            <strong className="block font-black mt-2">{current.highlight}</strong>
          </h1>
          <p className="animate-page text-sm sm:text-base text-white/75 leading-loose max-w-lg" style={{ animationDelay: "240ms" }}>
            {current.description}
          </p>
          <div className="animate-page flex flex-wrap gap-3 pt-2" style={{ animationDelay: "360ms" }}>
            <Link to="/shop" className="btn-light">
              تسوق المجموعة <ArrowLeft size={16} />
            </Link>
            <Link to="/offers" className="btn-outline !border-white/70 !text-white hover:!bg-white hover:!text-neutral-950">
              عروض النهارده
            </Link>
          </div>
        </div>
      </div>

      {/* العداد والأسهم */}
      {count > 1 && (
        <div className="absolute bottom-8 inset-x-0 z-10">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-4 text-sm font-light tabular-nums" dir="ltr">
              <span className="font-bold">{pad(i + 1)}</span>
              <span className="relative w-24 sm:w-40 h-px bg-white/30 overflow-hidden">
                <span key={index} className="absolute inset-0 bg-white animate-progress" style={{ animationDuration: `${SLIDE_MS}ms`, transformOrigin: "left" }} />
              </span>
              <span className="text-white/60">{pad(count)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} className="w-11 h-11 border border-white/40 flex items-center justify-center hover:bg-white hover:text-neutral-950 transition cursor-pointer" aria-label="السابق">
                <ChevronRight size={18} strokeWidth={1.6} />
              </button>
              <button onClick={() => go(1)} className="w-11 h-11 border border-white/40 flex items-center justify-center hover:bg-white hover:text-neutral-950 transition cursor-pointer" aria-label="التالي">
                <ChevronLeft size={18} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
