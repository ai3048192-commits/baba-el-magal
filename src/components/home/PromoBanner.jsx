import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { Reveal } from "../ui";

// البانر الترويجي — صورة بعرض الصفحة وفي نصها صندوق كلام (المحتوى من لوحة التحكم)
export default function PromoBanner() {
  const { db } = useStore();
  const b = db.promoBanner;
  if (!b) return null;

  return (
    <section dir="rtl" className="relative group overflow-hidden min-h-[520px] flex items-center justify-center py-20 px-4">
      <img src={b.image} alt={b.titleEnd} className="img-zoom absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      <Reveal variant="scale" className="relative max-w-xl w-full bg-base/90 backdrop-blur-md rounded-[2rem] shadow-2xl p-10 sm:p-14 text-center space-y-6">
        <span className="eyebrow centered">{b.label}</span>
        <h2 className="text-3xl sm:text-5xl font-light text-ink leading-[1.2]">
          {b.titleStart} <strong className="font-black text-brand">{b.highlight}</strong>
          <span className="block mt-2 text-2xl sm:text-3xl">{b.titleEnd}</span>
        </h2>
        <p className="text-sm text-muted leading-loose">{b.text}</p>
        <Link to={b.link || "/friday-offers"} className="btn-ink !rounded-full">
          {b.buttonText} <ArrowLeft size={15} />
        </Link>
        {b.imageBadge && <div className="text-[11px] font-bold tracking-[0.25em] text-faint">{b.imageBadge}</div>}
      </Reveal>
    </section>
  );
}
