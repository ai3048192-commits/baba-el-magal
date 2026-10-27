import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { Icon } from "../lib/icons";
import { useCountUp, useInView } from "../lib/motion";
import usePageTitle from "../lib/usePageTitle";
import { Container, Eyebrow, Reveal } from "../components/ui";

// رقم بيعد لحد قيمته (بيدعم "+50 ألف" و "100%" و "24/7")
function StatValue({ text, visible }) {
  const m = String(text).match(/^(\D*)(\d+)(.*)$/);
  const plain = !m || String(text).includes("/");
  const n = useCountUp(m ? Number(m[2]) : 0, visible && !plain);
  if (plain) return <>{text}</>;
  return (
    <>
      {m[1]}
      {n}
      {m[3]}
    </>
  );
}

// من نحن (/about) — أسلوب المجلات، وكل النصوص من لوحة التحكم
export default function About() {
  usePageTitle("من نحن");
  const { db, products } = useStore();
  const a = db.about;
  const [statsRef, statsVisible] = useInView();
  const imgs = products.filter((p) => p.active).slice(0, 3).map((p) => p.image);

  return (
    <div dir="rtl">
      {/* الافتتاحية */}
      <header className="bg-deep border-b border-ink/10">
        <Container className="py-20 sm:py-28 text-center">
          <div className="max-w-3xl mx-auto space-y-7 animate-page">
            <Eyebrow centered>{a.badge}</Eyebrow>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-ink leading-[1.15] tracking-tight">
              {a.title} <strong className="font-black block mt-2">{a.highlight}</strong>
            </h1>
            <p className="text-muted text-base sm:text-lg leading-loose max-w-2xl mx-auto">{a.intro}</p>
          </div>
        </Container>
      </header>

      {/* الأرقام */}
      <Container>
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 -mt-10 relative z-10">
          {a.stats.map((s, i) => (
            <Reveal key={s.id} i={i} className="card-soft py-10 px-4 text-center">
              <Icon name={s.icon} size={22} strokeWidth={1.4} className="mx-auto text-brand mb-4" />
              <div className="text-4xl sm:text-5xl font-light text-ink tabular-nums">
                <StatValue text={s.title} visible={statsVisible} />
              </div>
              <p className="text-xs text-muted tracking-wide mt-2">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* الحكاية */}
      <Container className="py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
          <Reveal variant="right" className="relative">
            <div className="grid grid-cols-2 gap-4">
              {imgs[0] && <div className="aspect-[3/4] bg-deep overflow-hidden rounded-[1.5rem] shadow-xl"><img src={imgs[0]} alt="" className="w-full h-full object-cover" /></div>}
              <div className="space-y-4 pt-12">
                {imgs[1] && <div className="aspect-square bg-deep overflow-hidden rounded-[1.5rem] shadow-xl"><img src={imgs[1]} alt="" className="w-full h-full object-cover" /></div>}
                {imgs[2] && <div className="aspect-[4/3] bg-deep overflow-hidden rounded-[1.5rem] shadow-xl"><img src={imgs[2]} alt="" className="w-full h-full object-cover" /></div>}
              </div>
            </div>
          </Reveal>
          <Reveal variant="left" className="space-y-7">
            <Eyebrow>حكايتنا</Eyebrow>
            <h2 className="text-3xl sm:text-5xl font-light text-ink leading-[1.25]">{a.storyTitle}</h2>
            <p className="text-ink-3 leading-loose">{a.story1}</p>
            <p className="text-muted leading-loose">{a.story2}</p>
            <ul className="space-y-3 pt-2">
              {["بدون أسعار وهمية", "معاينة كاملة قبل الاستلام", "ضمان حقيقي وموثوق"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-bold text-ink-2">
                  <span className="w-6 h-px bg-brand" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>

      {/* الركائز */}
      <section className="bg-deep border-y border-ink/10 py-24">
        <Container>
          <Reveal className="text-center mb-14">
            <Eyebrow centered>اللي بنؤمن بيه</Eyebrow>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
            {a.pillars.map((p, i) => (
              <Reveal key={p.id} i={i} className="card-soft p-9 space-y-4">
                <div className="text-5xl font-light text-brand/80 tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-xl font-bold text-ink">{p.title}</h3>
                <p className="text-sm text-muted leading-loose">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ليه إحنا */}
      <Container className="py-24 sm:py-32">
        <Reveal className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Eyebrow centered>تجربة الشراء</Eyebrow>
          <h2 className="text-3xl sm:text-5xl font-light text-ink">تجربة <strong className="font-black">تضمن راحتك</strong></h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {a.features.map((f, i) => (
            <Reveal key={f.id} i={i} className="card-soft p-8 text-center space-y-4">
              <span className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                <Icon name={f.icon} size={24} strokeWidth={1.4} />
              </span>
              <h3 className="text-lg font-bold text-ink">{f.title}</h3>
              <p className="text-sm text-muted leading-loose">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* الدعوة */}
      <section className="bg-neutral-950 text-white">
        <Container className="py-24 text-center">
          <Reveal className="max-w-2xl mx-auto space-y-7">
            <span className="eyebrow centered">ابدأ النهارده</span>
            <h2 className="text-3xl sm:text-5xl font-light leading-[1.25]">مستعد تبدأ <strong className="font-black">التوفير الحقيقي</strong>؟</h2>
            <p className="text-white/60 leading-loose">اكتشف أقوى عروض الموسم ودلل بيتك بأقل سعر وأعلى جودة.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/friday-offers" className="btn-light">استعرض العروض <ArrowLeft size={15} /></Link>
              <Link to="/shop" className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-neutral-950">المتجر</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
