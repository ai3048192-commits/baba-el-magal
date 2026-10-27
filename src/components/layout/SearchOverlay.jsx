import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { Icon } from "../../lib/icons";
import { formatPrice } from "../../lib/format";

// بحث فوري: النتايج بتظهر وإنت بتكتب (Ctrl+K أو زرار البحث)
export default function SearchOverlay({ onClose }) {
  const { products, db } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products.filter((p) => p.active && p.name.toLowerCase().includes(t)).slice(0, 6);
  }, [q, products]);

  const popular = useMemo(() => products.filter((p) => p.active && p.sections.includes("featured")).slice(0, 4), [products]);

  const go = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose} dir="rtl">
      <div className="max-w-2xl mx-auto mt-16 sm:mt-24 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="glass border border-ink/10 rounded-[2rem] shadow-2xl overflow-hidden animate-scale-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(`/shop?q=${encodeURIComponent(q.trim())}`);
            }}
            className="flex items-center gap-3 px-6 border-b border-ink/10"
          >
            <Search size={22} className="text-brand shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="دوّر على حلة، خلاط، مفرش، قلاية..."
              className="flex-1 bg-transparent py-6 text-base sm:text-lg text-ink placeholder-faint outline-none"
            />
            <kbd className="hidden sm:block text-[10px] font-bold text-faint border border-ink/10 rounded-md px-1.5 py-0.5">ESC</kbd>
          </form>

          <div className="max-h-[60vh] overflow-y-auto p-3">
            {results.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(`/product/${p.id}`)}
                className="group w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-ink/5 text-right transition animate-page cursor-pointer"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <img src={p.image} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-ink line-clamp-1 group-hover:text-brand transition">{p.name}</span>
                  <span className="text-xs text-muted">{db.categories.find((c) => c.id === p.categoryId)?.name}</span>
                </span>
                <span className="text-sm font-black text-brand whitespace-nowrap">{formatPrice(p.price)}</span>
                <ArrowLeft size={16} className="text-faint opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition" />
              </button>
            ))}
            {q && !results.length && <p className="text-center text-sm text-muted py-10">مفيش نتايج لـ "{q}" — جرّب كلمة تانية</p>}
            {!q && (
              <div className="p-2 space-y-5">
                <div className="space-y-3">
                  <span className="text-[11px] font-black text-faint">تصفح الأقسام</span>
                  <div className="flex flex-wrap gap-2">
                    {db.categories.map((c) => (
                      <button key={c.id} onClick={() => go(`/category/${c.id}`)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ink/5 hover:bg-brand hover:text-white text-xs font-bold text-ink-2 transition cursor-pointer">
                        <Icon name={c.icon} size={14} /> {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                {popular.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-black text-faint">الأكثر طلباً</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {popular.map((p) => (
                        <button key={p.id} onClick={() => go(`/product/${p.id}`)} className="group text-right rounded-2xl overflow-hidden bg-ink/5 hover:bg-ink/10 transition cursor-pointer">
                          <img src={p.image} alt="" className="w-full aspect-square object-cover group-hover:scale-105 transition duration-500" />
                          <div className="p-2 text-[11px] font-bold text-ink-2 line-clamp-1">{p.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
