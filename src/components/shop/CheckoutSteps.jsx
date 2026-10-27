// مؤشر الخطوات (السلة ← التوصيل ← الدفع)
export default function CheckoutSteps({ current = 0 }) {
  const steps = ["السلة", "التوصيل", "الدفع", "التأكيد"];
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2 sm:gap-3">
          <span className={`flex items-center gap-2 text-[11px] sm:text-xs font-bold ${i <= current ? "text-ink" : "text-faint"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition ${i < current ? "bg-emerald-500 text-white" : i === current ? "bg-brand text-white ring-4 ring-brand/15" : "bg-ink/[0.06] text-faint"}`}>
              {i < current ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </span>
          {i < steps.length - 1 && <span className={`w-6 sm:w-12 h-px ${i < current ? "bg-emerald-500" : "bg-ink/15"}`} />}
        </li>
      ))}
    </ol>
  );
}
