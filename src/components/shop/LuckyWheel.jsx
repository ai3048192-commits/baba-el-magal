import { useState } from "react";
import { Sparkles, Gift, X, Copy, PartyPopper } from "lucide-react";
import { useStore } from "../../store/StoreContext";

// عجلة الحظ الجانبية (صفحة عروض الجمعة) — الجوائز من لوحة التحكم
export default function LuckyWheel() {
  const { db } = useStore();
  const prizes = db.wheelPrizes;
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!db.settings.luckyWheelEnabled || prizes.length < 2) return null;

  const segment = 360 / prizes.length;
  const gradient = `conic-gradient(${prizes
    .map((p, i) => `${p.color} ${i * segment}deg ${(i + 1) * segment}deg`)
    .join(", ")})`;

  const spin = () => {
    if (spinning || won) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * prizes.length);
    // المؤشر فوق (0deg) — نلف العجلة لحد ما منتصف الشريحة يقف تحته
    setRotation(360 * 6 + (360 - (idx * segment + segment / 2)));
    setTimeout(() => {
      setSpinning(false);
      setWon(prizes[idx]);
    }, 4000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(won.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-40 bg-brand text-white py-4 px-3 rounded-l-2xl shadow-[0_0_30px_rgb(var(--brand)/0.6)] border-y border-l border-white/20 hover:pr-4 transition-all cursor-pointer"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="flex items-center gap-1.5 text-xs font-black tracking-wider">
          <Sparkles size={16} className="text-amber-300" /> عجلة الحظ الكبرى
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[65] bg-black/70 backdrop-blur-md flex justify-end animate-fade-in" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-card h-full p-6 sm:p-8 flex flex-col border-l border-ink/10 overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="self-end text-muted hover:text-ink p-2 rounded-full bg-ink/5 cursor-pointer" aria-label="إغلاق">
              <X size={20} />
            </button>

            <div className="text-center space-y-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/20">
                <Gift size={14} /> هدية فورية من {db.settings.storeNameAr}
              </span>
              <h3 className="text-2xl font-black text-ink">عجلة الحظ التفاعلية 🔥</h3>
              <p className="text-muted text-xs">لف العجلة واحصل على كود خصم حصري فوراً!</p>
            </div>

            <div className="relative mx-auto my-10 w-72 h-72">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow" />
              <div
                className="w-full h-full rounded-full border-4 border-brand/50 shadow-2xl relative transition-transform duration-[4000ms] ease-[cubic-bezier(0.17,0.67,0.12,0.99)]"
                style={{ background: gradient, transform: `rotate(${rotation}deg)` }}
              >
                {prizes.map((p, i) => (
                  <div
                    key={p.id}
                    className="absolute inset-0 flex justify-center"
                    style={{ transform: `rotate(${i * segment + segment / 2}deg)` }}
                  >
                    <span className="mt-6 text-[10px] font-black text-white max-w-[70px] text-center leading-tight drop-shadow">{p.label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={spin}
                disabled={spinning || !!won}
                className="absolute inset-0 m-auto z-10 w-16 h-16 rounded-full bg-brand text-white font-black text-xs border-4 border-card shadow-2xl disabled:opacity-60 cursor-pointer"
              >
                {spinning ? "..." : won ? "تم!" : "دَوّر!"}
              </button>
            </div>

            {won && (
              <div className="card-inset p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-sm font-bold">
                  <PartyPopper size={16} /> {won.code ? `مبروك! كسبت ${won.label}` : won.label}
                </div>
                {won.code && (
                  <div className="flex items-center justify-between bg-ink/5 p-3 rounded-2xl">
                    <span className="font-mono font-black text-amber-400 text-lg">{won.code}</span>
                    <button onClick={copy} className="px-3.5 py-1.5 bg-brand text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <Copy size={12} /> {copied ? "تم النسخ!" : "نسخ الكود"}
                    </button>
                  </div>
                )}
                {won.code && <p className="text-[11px] text-faint">استخدم الكود في خطوة إتمام الطلب.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
