import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container, Reveal, SectionHeader } from "../ui";

const STEPS = [
  { title: "اختار واطلب", text: "ضيف منتجاتك للسلة واكتب عنوانك في أقل من دقيقة." },
  { title: "بنأكد ونجهز", text: "بنكلمك نأكد الطلب ونغلّفه تغليف آمن ومحترم." },
  { title: "تتبع شحنتك", text: "تابع الطلب خطوة بخطوة برقم الطلب لحد باب بيتك." },
  { title: "عاين وادفع", text: "افتح الشحنة واتأكد بنفسك قبل ما تدفع أي حاجة." },
];

// خطوات وصول الطلب — أرقام كبيرة خفيفة وخطوط رفيعة
export default function HowItWorks() {
  return (
    <section dir="rtl" className="py-20 sm:py-28 bg-deep border-y border-ink/10">
      <Container>
        <SectionHeader eyebrow="تجربة مضمونة" title="طلبك بيوصلك" highlight="في 4 خطوات" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} i={i} className="h-full">
              <div className="card-soft card-hover h-full p-7 text-center sm:text-right">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-brand/10 text-brand items-center justify-center text-xl font-black tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted leading-loose">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link to="/track" className="btn-link">
            عندك طلب؟ تتبعه دلوقتي <ArrowLeft size={14} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
