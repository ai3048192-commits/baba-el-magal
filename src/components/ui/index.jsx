// مكونات الواجهة المشتركة — الأسلوب الكلاسيكي الفاخر (كل الصفحات بتبني عليها)
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Star, PackageOpen } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import useCountdown from "../../lib/useCountdown";
import { useInView } from "../../lib/motion";

// ظهور ناعم مع التمرير — i = ترتيب العنصر (للظهور ورا بعض)
export function Reveal({ as: Tag = "div", i = 0, variant = "up", className = "", children, ...rest }) {
  const [ref, visible] = useInView();
  return (
    <Tag ref={ref} data-variant={variant} style={{ "--i": i % 8 }} className={`reveal ${visible ? "is-visible" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

// اللوجو: صورة من الإعدادات، أو اسم المتجر بحروف متباعدة
export function Logo({ size = "md", light = false }) {
  const { db } = useStore();
  const { logoImage, storeName, storeNameAr } = db.settings;
  if (logoImage) return <img src={logoImage} alt={storeName} className={size === "sm" ? "h-8 w-auto" : "h-11 w-auto"} />;
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span className={`font-black uppercase ${light ? "text-white" : "text-ink"} ${size === "sm" ? "text-base tracking-[0.25em]" : "text-2xl tracking-[0.3em]"}`}>{storeName}</span>
      {size !== "sm" && <span className="mt-1.5 text-[9px] font-bold tracking-[0.35em] text-brand">{storeNameAr}</span>}
    </span>
  );
}

export function Container({ className = "", children }) {
  return <div className={`w-full max-w-site mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, centered = false }) {
  return <span className={`eyebrow ${centered ? "centered" : ""}`}>{children}</span>;
}

// الكلمة المميزة في العنوان: تقيلة وسط عنوان خفيف
export function GradientText({ children, className = "" }) {
  return <strong className={`font-black text-ink ${className}`}>{children}</strong>;
}

// عنوان القسم: في النص لو مفيش زرار جنبه، ولو فيه زرار يبقى العنوان يمين والزرار شمال
export function SectionHeader({ eyebrow, title, highlight, subtitle, action, center }) {
  const centered = center ?? !action;
  return (
    <Reveal className={`mb-10 sm:mb-14 ${centered ? "text-center flex flex-col items-center" : "flex flex-col md:flex-row md:items-end md:justify-between gap-6"}`}>
      <div className={`space-y-4 ${centered ? "max-w-2xl" : "max-w-2xl"}`}>
        {eyebrow && <Eyebrow centered={centered}>{eyebrow}</Eyebrow>}
        <h2 className="text-3xl sm:text-[2.6rem] font-light text-ink leading-[1.25] tracking-tight">
          {title} {highlight && <GradientText>{highlight}</GradientText>}
        </h2>
        {subtitle && <p className="text-muted text-sm sm:text-[15px] leading-loose">{subtitle}</p>}
      </div>
      {action && <div className={`shrink-0 ${centered ? "mt-6" : ""}`}>{action}</div>}
    </Reveal>
  );
}

// هيدر الصفحات الداخلية: هادي وفي النص
export function PageHero({ eyebrow, title, highlight, subtitle, children }) {
  return (
    <section className="relative w-full bg-deep border-b border-ink/10">
      <Container className="py-14 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-5 animate-page">
          {eyebrow && <Eyebrow centered>{eyebrow}</Eyebrow>}
          <h1 className="text-4xl sm:text-6xl font-light text-ink leading-[1.15] tracking-tight">
            {title} {highlight && <GradientText>{highlight}</GradientText>}
          </h1>
          {subtitle && <p className="text-muted text-sm sm:text-base leading-loose max-w-xl mx-auto">{subtitle}</p>}
        </div>
        {children && (
          <div className="mt-10 flex justify-center animate-page" style={{ animationDelay: "150ms" }}>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}

export function Stars({ value, size = 12 }) {
  return (
    <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px]">
      <Star size={size} className="fill-amber-400" />
      {value}
    </span>
  );
}

// عداد تنازلي كلاسيك: أرقام خفيفة كبيرة بينهم خطوط رفيعة
export function Countdown({ endAt, label = "ينتهي العرض خلال", compact = false }) {
  const t = useCountdown(endAt);
  const cells = [
    ...(t.days > 0 ? [{ v: t.days, l: "يوم" }] : []),
    { v: t.hours, l: "ساعة" },
    { v: t.minutes, l: "دقيقة" },
    { v: t.seconds, l: "ثانية", accent: true },
  ];
  return (
    <div className="inline-flex flex-col items-center gap-3">
      {label && <span className="text-[10px] text-muted font-bold tracking-[0.25em]">{label}</span>}
      <div className="flex items-stretch divide-x divide-x-reverse divide-ink/15" dir="ltr">
        {cells.map((c) => (
          <div key={c.l} className={`flex flex-col items-center ${compact ? "px-3" : "px-5"}`}>
            <span key={c.v} className={`animate-digit font-light tabular-nums leading-none ${compact ? "text-2xl" : "text-4xl"} ${c.accent ? "text-brand" : "text-ink"}`}>
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="mt-1.5 text-[9px] text-faint font-bold tracking-[0.2em]">{c.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ icon: IconCmp = PackageOpen, title, text, action }) {
  return (
    <Reveal className="card-soft py-20 sm:py-24 px-6 text-center space-y-5">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-brand/10 flex items-center justify-center text-brand">
        <IconCmp size={30} strokeWidth={1.4} />
      </div>
      <h3 className="text-2xl font-light text-ink">{title}</h3>
      {text && <p className="text-sm text-muted max-w-sm mx-auto leading-loose">{text}</p>}
      {action && <div className="pt-2">{action}</div>}
    </Reveal>
  );
}

export function PrimaryLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`btn-ink ${className}`}>
      {children}
    </Link>
  );
}

export function GhostLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`group btn-outline ${className}`}>
      {children}
    </Link>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const error = toast.type === "error";
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-none w-[calc(100%-2rem)] max-w-sm" key={toast.key}>
      <div
        className={`relative overflow-hidden flex items-center gap-3 px-5 py-4 shadow-2xl text-[13px] font-bold animate-[toastIn_.35s_cubic-bezier(.22,1,.36,1)] ${
          error ? "bg-card text-ink border border-brand/50" : "bg-neutral-950 text-white"
        }`}
      >
        {error ? <AlertTriangle size={17} className="text-brand shrink-0" /> : <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />}
        <span className="flex-1">{toast.message}</span>
        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand animate-progress" style={{ animationDuration: "2.8s", animationDirection: "reverse" }} />
      </div>
    </div>
  );
}
