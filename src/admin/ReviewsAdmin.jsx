import { useState } from "react";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatDate } from "../lib/format";
import { Card, PageTitle } from "./ui";

export default function ReviewsAdmin() {
  const { db, saveItem, removeItem, showToast } = useStore();
  const [filter, setFilter] = useState("all");
  const productName = (id) => db.products.find((p) => p.id === id)?.name || "منتج محذوف";
  const list = [...db.reviews]
    .filter((r) => filter === "all" || (filter === "hidden" ? !r.approved : r.approved))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <PageTitle title="التقييمات" subtitle="آراء العملاء على المنتجات — اخفي أو احذف أي تقييم مش مناسب" />
      <div className="flex gap-2 mb-4">
        {[["all", "الكل"], ["visible", "ظاهرة"], ["hidden", "مخفية"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${filter === id ? "bg-brand border-brand text-white" : "bg-card border-ink/10 text-muted"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list.map((r) => (
          <Card key={r.id} className={r.approved ? "" : "opacity-60"}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-sm font-bold text-ink">{r.name}</div>
                <div className="text-[11px] text-faint">{r.city} • {formatDate(r.date)}</div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-faintest"} />)}
              </div>
            </div>
            <p className="text-xs text-ink-3 leading-relaxed mb-3">"{r.comment}"</p>
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-ink/10">
              <span className="text-[11px] text-faint line-clamp-1">على: {productName(r.productId)}</span>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => {
                    saveItem("reviews", { ...r, approved: !r.approved });
                    showToast(r.approved ? "تم إخفاء التقييم" : "التقييم ظاهر الآن");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-ink-3 hover:bg-ink/5 cursor-pointer"
                >
                  {r.approved ? <><EyeOff size={13} /> إخفاء</> : <><Eye size={13} /> إظهار</>}
                </button>
                <button
                  onClick={() => window.confirm("حذف التقييم؟") && removeItem("reviews", r.id)}
                  className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand/10 cursor-pointer"
                  aria-label="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!list.length && <p className="text-center text-xs text-faint py-10">لا توجد تقييمات.</p>}
    </div>
  );
}
