import { useStore } from "../../store/StoreContext";
import { Container, SectionHeader } from "../ui";

// شريط الشركاء — صور هادية بالأبيض والأسود وبتتلون عند المرور
export default function PartnersMarquee() {
  const { db } = useStore();
  const items = db.partners;
  if (!items.length) return null;

  return (
    <section dir="rtl" className="py-20 sm:py-28 bg-base overflow-hidden">
      <Container>
        <SectionHeader eyebrow="شركاء النجاح" title="بنتعامل مع" highlight="الأفضل" subtitle="براندات ومصانع موثوقة علشان كل منتج يوصلك أصلي ومضمون." />
      </Container>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex gap-6 w-max animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
          {[...items, ...items, ...items, ...items].map((item, i) => (
            <figure key={i} className="group card-soft p-2.5 w-[220px] sm:w-[260px] shrink-0">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-deep">
                <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 img-zoom transition-[filter] duration-700" />
              </div>
              <figcaption className="mt-2.5 mb-1 text-center text-[12px] font-bold tracking-[0.15em] text-muted group-hover:text-ink transition">{item.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
