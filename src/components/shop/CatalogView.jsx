import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";
import { EmptyState } from "../ui";

const PRICE_RANGES = [
  { label: "كل الأسعار", min: 0, max: Infinity },
  { label: "أقل من 500 ج", min: 0, max: 500 },
  { label: "500 – 1000 ج", min: 500, max: 1000 },
  { label: "1000 – 4000 ج", min: 1000, max: 4000 },
  { label: "أكتر من 4000 ج", min: 4000, max: Infinity },
];

const SORTS = [
  { id: "default", label: "الترتيب الافتراضي" },
  { id: "low-high", label: "السعر: الأقل الأول" },
  { id: "high-low", label: "السعر: الأعلى الأول" },
  { id: "rating", label: "الأعلى تقييماً" },
  { id: "discount", label: "أعلى خصم" },
];

// شبكة منتجات مع بحث + فلترة + ترتيب
// options: [{ value, label }] ، getValue(product) يرجع قيمة الفلتر للمنتج
export default function CatalogView({ products, options, getValue, filterTitle = "التصنيفات", initialFilter = "all", initialSearch = "", searchPlaceholder = "ابحث عن منتج..." }) {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState(initialSearch);
  const [priceIdx, setPriceIdx] = useState(0);
  const [sort, setSort] = useState("default");
  const [drawer, setDrawer] = useState(false);

  const result = useMemo(() => {
    const q = search.trim().toLowerCase();
    const range = PRICE_RANGES[priceIdx];
    const list = products.filter(
      (p) => (filter === "all" || getValue(p) === filter) && (!q || p.name.toLowerCase().includes(q)) && p.price >= range.min && p.price <= range.max,
    );
    const off = (p) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0);
    if (sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort === "high-low") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "discount") list.sort((a, b) => off(b) - off(a));
    return list;
  }, [products, filter, search, priceIdx, sort, getValue]);

  const dirty = filter !== "all" || priceIdx !== 0 || search !== "" || sort !== "default";
  const reset = () => {
    setFilter("all");
    setSearch("");
    setPriceIdx(0);
    setSort("default");
  };
  const countFor = (value) => products.filter((p) => getValue(p) === value).length;

  const tab = (active, onClick, label, count) => (
    <button
      key={label}
      onClick={onClick}
      className={`relative shrink-0 pb-3 text-[13px] font-bold tracking-wide transition-colors cursor-pointer ${active ? "text-ink" : "text-faint hover:text-ink"}`}
    >
      {label}
      {count != null && <sup className="mr-1 text-[9px] text-faint">{count}</sup>}
      <span className={`absolute bottom-0 inset-x-0 h-0.5 bg-brand origin-right transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  );

  const priceList = (
    <ul className="space-y-3.5">
      {PRICE_RANGES.map((r, idx) => (
        <li key={r.label}>
          <button onClick={() => setPriceIdx(idx)} className={`flex items-center gap-3 text-[13px] transition cursor-pointer ${priceIdx === idx ? "text-ink font-bold" : "text-muted hover:text-ink"}`}>
            <span className={`w-3.5 h-3.5 border flex items-center justify-center transition ${priceIdx === idx ? "border-brand" : "border-ink/30"}`}>
              {priceIdx === idx && <span className="w-1.5 h-1.5 bg-brand" />}
            </span>
            {r.label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-8">
      {/* تبويبات الأقسام */}
      <div className="no-scrollbar flex gap-8 overflow-x-auto border-b border-ink/10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
        {tab(filter === "all", () => setFilter("all"), "الكل", products.length)}
        {options.map((o) => tab(filter === o.value, () => setFilter(o.value), o.label, countFor(o.value)))}
      </div>

      {/* شريط الأدوات */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} strokeWidth={1.6} className="absolute right-0 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent border-b border-ink/20 focus:border-ink pr-7 pl-7 py-2.5 text-sm text-ink placeholder-faint outline-none transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute left-0 top-1/2 -translate-y-1/2 text-faint hover:text-ink cursor-pointer" aria-label="مسح">
              <X size={15} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 text-[13px]">
          <span className="text-muted hidden sm:inline">
            <strong className="text-ink">{result.length}</strong> منتج
          </span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-b border-ink/20 py-2 pl-2 text-ink font-bold outline-none cursor-pointer">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button onClick={() => setDrawer(true)} className="lg:hidden inline-flex items-center gap-2 font-bold text-ink cursor-pointer">
            <SlidersHorizontal size={15} strokeWidth={1.6} /> السعر
          </button>
          {dirty && <button onClick={reset} className="btn-link !text-[11px] !text-brand">مسح الكل</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.25em] text-ink mb-5 pb-3 border-b border-ink/10">نطاق السعر</h4>
              {priceList}
            </div>
            <div className="border-t border-ink/10 pt-6 text-center">
              <div className="text-[10px] tracking-[0.25em] text-faint font-bold">{filterTitle}</div>
              <div className="text-5xl font-light text-ink mt-2 tabular-nums">{result.length}</div>
              <div className="text-xs text-muted">منتج مطابق</div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {result.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="مفيش منتجات مطابقة"
              text="جرّب تغيّر كلمة البحث أو نطاق السعر."
              action={<button onClick={reset} className="btn-outline">مسح الفلاتر</button>}
            />
          ) : (
            <div key={`${filter}-${priceIdx}-${sort}`} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {result.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[65] bg-black/50 flex justify-end lg:hidden animate-fade-in" onClick={() => setDrawer(false)}>
          <div className="bg-base w-full max-w-xs h-full p-6 overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-ink/10">
              <span className="text-[11px] font-bold tracking-[0.25em] text-ink">نطاق السعر</span>
              <button onClick={() => setDrawer(false)} className="text-faint cursor-pointer" aria-label="إغلاق"><X size={18} /></button>
            </div>
            {priceList}
            <button onClick={() => setDrawer(false)} className="btn-ink w-full mt-8">عرض {result.length} منتج</button>
          </div>
        </div>
      )}
    </div>
  );
}
