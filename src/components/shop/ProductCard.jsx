import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, Check, Star } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { discountPercent, formatPrice } from "../../lib/format";
import { Reveal } from "../ui";

// كارت المنتج الرايق — بيستخدم في كل الشبكات
// index = ترتيبه في الشبكة عشان يظهر ورا اللي قبله
export default function ProductCard({ product, showStock = false, index = 0 }) {
  const { addToCart, toggleWishlist, wishlist, db } = useStore();
  const [loaded, setLoaded] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const [added, setAdded] = useState(false);
  const off = discountPercent(product);
  const liked = wishlist.includes(product.id);
  const category = db.categories.find((c) => c.id === product.categoryId);
  const outOfStock = product.stock <= 0;
  const hoverImg = product.images?.[0];
  const lowStock = showStock && product.stock > 0 && product.stock <= 12;

  const add = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Reveal i={index} className="h-full">
      <article className="group card-soft card-hover h-full flex flex-col p-2.5">
        {/* الصورة */}
        <div className="relative aspect-square rounded-[1.1rem] bg-deep overflow-hidden">
          {!loaded && <div className="absolute inset-0 skeleton" />}
          <Link to={`/product/${product.id}`} aria-label={product.name} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`img-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${hoverImg ? "group-hover:opacity-0" : ""}`}
            />
            {hoverImg && <img src={hoverImg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" />}
          </Link>

          <div className="absolute top-2.5 right-2.5 flex flex-col items-start gap-1.5 pointer-events-none">
            {off > 0 && <span className="pill-soft bg-white/90 text-brand shadow-sm">−{off}%</span>}
            {product.deal && <span className="pill-soft bg-neutral-900/75 text-white">{product.deal.badge || "عرض اليوم"}</span>}
          </div>

          <button
            onClick={() => {
              toggleWishlist(product);
              setPopKey((k) => k + 1);
            }}
            className={`absolute top-2.5 left-2.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-300 cursor-pointer ${
              liked ? "bg-brand text-white" : "bg-white/85 text-neutral-700 hover:text-brand"
            }`}
            aria-label="المفضلة"
          >
            <Heart key={popKey} size={15} strokeWidth={1.9} className={`${popKey ? "animate-pop" : ""} ${liked ? "fill-white" : ""}`} />
          </button>

          {outOfStock && (
            <div className="absolute inset-0 bg-base/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="pill-soft bg-ink text-white dark:text-neutral-900">نفدت الكمية</span>
            </div>
          )}
        </div>

        {/* البيانات */}
        <div className="flex flex-col flex-grow px-2 pt-3.5 pb-1.5 gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-faint font-medium truncate">{category?.name || "منتج"}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted shrink-0">
              <Star size={11} className="text-amber-400 fill-amber-400" /> {product.rating}
            </span>
          </div>

          <Link to={`/product/${product.id}`} className="text-[14px] font-bold text-ink-1 hover:text-brand line-clamp-2 leading-relaxed transition min-h-[2.75rem]">
            {product.name}
          </Link>

          {product.colors?.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((c) => (
                <span key={c.name} title={c.name} className="w-3.5 h-3.5 rounded-full border border-ink/15" style={{ backgroundColor: c.code }} />
              ))}
            </div>
          )}

          {lowStock && (
            <div className="space-y-1">
              <div className="h-1 rounded-full bg-ink/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-brand/70" style={{ width: `${Math.max(12, 100 - product.stock * 7)}%` }} />
              </div>
              <span className="text-[10px] font-bold text-brand">باقي {product.stock} قطع بس</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <div className="leading-tight">
              <span className="block text-base font-black text-ink">{formatPrice(product.price)}</span>
              {product.oldPrice > product.price && <span className="text-[11px] text-faint line-through">{formatPrice(product.oldPrice)}</span>}
            </div>
            <button
              onClick={add}
              disabled={outOfStock}
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                added ? "bg-emerald-500 text-white scale-110" : "bg-brand/10 text-brand hover:bg-brand hover:text-white hover:rotate-90"
              }`}
              aria-label="أضف للسلة"
            >
              {added ? <Check size={17} /> : <Plus size={18} />}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
