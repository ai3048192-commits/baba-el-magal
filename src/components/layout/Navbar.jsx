import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, ChevronLeft, Truck, Phone, ArrowLeft } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SearchOverlay from "./SearchOverlay";
import { useStore } from "../../store/StoreContext";
import { Icon } from "../../lib/icons";
import { useScrolled } from "../../lib/motion";
import { formatPrice } from "../../lib/format";
import { SocialIcon } from "../ui/SocialIcons";

const LINKS = [
  { to: "/", label: "الرئيسية", end: true },
  { to: "/shop", label: "المتجر" },
  { mega: true, label: "الأقسام" },
  { to: "/offers", label: "عروض اليوم" },
  { to: "/friday-offers", label: "عروض الجمعة" },
  { to: "/discounts", label: "الخصومات" },
  { to: "/about", label: "من نحن" },
];

// اللوجو الكلاسيك: اسم المتجر بحروف متباعدة + سطر تحته
function ClassicLogo({ compact = false }) {
  const { db } = useStore();
  const { logoImage, storeName, storeNameAr } = db.settings;
  if (logoImage) return <img src={logoImage} alt={storeName} className={compact ? "h-8 w-auto" : "h-12 sm:h-14 w-auto"} />;
  return (
    <span className="flex flex-col items-center leading-none">
      <span className={`font-black uppercase text-ink transition-all ${compact ? "text-base tracking-[0.25em]" : "text-2xl sm:text-3xl tracking-[0.3em]"}`}>
        {storeName}
      </span>
      {!compact && (
        <span className="flex items-center gap-2 mt-2 text-[10px] font-bold tracking-[0.35em] text-brand">
          <span className="w-6 h-px bg-brand/50" />
          {storeNameAr}
          <span className="w-6 h-px bg-brand/50" />
        </span>
      )}
    </span>
  );
}

// زرار أيقونة بعنوان صغير تحته
function IconAction({ to, onClick, icon: I, label, count, className = "" }) {
  const body = (
    <>
      <span className="relative">
        <I size={20} strokeWidth={1.6} />
        {count > 0 && (
          <span key={count} className="animate-pop absolute -top-1.5 -left-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-black flex items-center justify-center">
            {count}
          </span>
        )}
      </span>
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </>
  );
  const cls = `flex flex-col items-center gap-1 px-2.5 text-ink-2 hover:text-brand transition-colors cursor-pointer ${className}`;
  return to ? <Link to={to} className={cls}>{body}</Link> : <button onClick={onClick} className={cls}>{body}</button>;
}

// قايمة الأقسام الكلاسيك: أعمدة + صورة مختارات
function CategoriesPanel({ onClose }) {
  const { db, products } = useStore();
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const pick = products.find((p) => p.active && p.sections.includes("featured")) || products[0];
  return (
    <div className="absolute inset-x-0 top-full z-50 bg-card border-t-2 border-brand border-b border-ink/10 shadow-2xl animate-drop">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-[1fr_280px] gap-12">
        <div className="grid grid-cols-3 gap-x-10 gap-y-9">
          {categories.map((c) => (
            <div key={c.id}>
              <Link to={`/category/${c.id}`} onClick={onClose} className="group flex items-center gap-2 pb-3 mb-3 border-b border-ink/10">
                <Icon name={c.icon} size={16} className="text-brand" />
                <span className="text-sm font-black text-ink tracking-wide group-hover:text-brand transition">{c.name}</span>
              </Link>
              <ul className="space-y-2">
                {c.subcategories.slice(0, 5).map((s) => (
                  <li key={s}>
                    <Link to={`/category/${c.id}?sub=${encodeURIComponent(s)}`} onClick={onClose} className="text-[13px] text-muted hover:text-ink hover:pr-1 transition-all">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {pick && (
          <Link to={`/product/${pick.id}`} onClick={onClose} className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-deep">
              <img src={pick.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-[1200ms]" />
            </div>
            <div className="mt-4 text-center space-y-1">
              <div className="text-[10px] font-bold tracking-[0.3em] text-brand">مختارات الموسم</div>
              <div className="text-sm font-bold text-ink line-clamp-1">{pick.name}</div>
              <div className="inline-flex items-center gap-1 text-xs text-muted group-hover:text-brand transition">
                اكتشف المنتج <ArrowLeft size={13} />
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

// معاينة السلة عند المرور
function MiniCart() {
  const { cartItems } = useStore();
  const total = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  return (
    <div className="absolute left-0 top-full pt-4 w-80 z-50">
      <div className="bg-card border border-ink/10 shadow-2xl p-5 animate-drop">
        {cartItems.length === 0 ? (
          <p className="text-center text-sm text-muted py-6">السلة فاضية</p>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.slice(0, 4).map((i) => (
                <div key={i.key} className="flex items-center gap-3">
                  <img src={i.product.image} alt="" className="w-14 h-14 object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-ink line-clamp-1">{i.product.name}</div>
                    <div className="text-[11px] text-muted mt-0.5">{i.qty} × {formatPrice(i.product.price)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/10">
              <span className="text-xs tracking-wide text-muted">المجموع</span>
              <span className="text-base font-black text-ink">{formatPrice(total)}</span>
            </div>
            <Link to="/cart" className="mt-4 block text-center py-3 bg-ink text-white dark:text-neutral-950 text-sm font-bold tracking-wider hover:bg-brand hover:text-white dark:hover:text-white transition">
              عرض السلة
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// روابط الصف (بخط تحت بيتمد)
function NavRow({ megaOpen, setMegaOpen, compact = false }) {
  return (
    <ul className={`flex items-center justify-center ${compact ? "gap-6" : "gap-9"}`}>
      {LINKS.map((l) =>
        l.mega ? (
          <li key="mega">
            <button
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(!megaOpen)}
              className={`link-underline flex items-center gap-1 text-[13px] font-bold tracking-wider transition-colors cursor-pointer ${megaOpen ? "active text-brand" : "text-ink-2 hover:text-ink"}`}
            >
              {l.label} <ChevronDown size={13} className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
            </button>
          </li>
        ) : (
          <li key={l.to} onMouseEnter={() => setMegaOpen(false)}>
            <NavLink to={l.to} end={l.end} className={({ isActive }) => `link-underline text-[13px] font-bold tracking-wider transition-colors ${isActive ? "active text-ink" : "text-ink-2 hover:text-ink"}`}>
              {l.label}
            </NavLink>
          </li>
        ),
      )}
    </ul>
  );
}

export default function Navbar() {
  const { db, cartCount, wishlist } = useStore();
  const { settings } = db;
  const layout = settings.layout || {};
  const location = useLocation();
  const condensed = useScrolled(180);
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const social = Object.entries(settings.social || {}).filter(([, url]) => url);

  const [megaOpen, setMegaOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [openCat, setOpenCat] = useState(null);

  useEffect(() => {
    setMegaOpen(false);
    setCartOpen(false);
    setDrawer(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cartAction = (
    <div className="relative" onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
      <IconAction to="/cart" icon={ShoppingBag} label="السلة" count={cartCount} />
      {cartOpen && <div className="hidden lg:block"><MiniCart /></div>}
    </div>
  );

  return (
    <>
      <header dir="rtl" className="relative z-50 bg-base">
        {/* السطر العلوي الرفيع */}
        {layout.showTopBar !== false && (
          <div className="hidden md:block border-b border-ink/10">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-9 grid grid-cols-3 items-center text-[11px] font-bold text-muted">
              <div className="flex items-center gap-5">
                <Link to="/track" className="inline-flex items-center gap-1.5 hover:text-ink transition"><Truck size={12} /> تتبع شحنتك</Link>
                <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink transition"><Phone size={12} /> {settings.phone}</a>
              </div>
              <div className="text-center tracking-[0.2em] text-ink-3 truncate">{settings.topBarText}</div>
              <div className="flex items-center justify-end gap-3">
                {social.map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition" aria-label={name}>
                    <SocialIcon name={name} size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* اللوجو في النص */}
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-5 sm:py-7">
            <div className="flex items-center">
              <button onClick={() => setDrawer(true)} className="lg:hidden p-2 -mr-2 text-ink-2 cursor-pointer" aria-label="القائمة">
                <Menu size={24} strokeWidth={1.6} />
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-3 w-64 pb-2 border-b border-ink/20 hover:border-ink text-sm text-faint transition cursor-pointer"
              >
                <Search size={17} strokeWidth={1.6} className="text-ink-2" />
                دوّر على منتج...
                <kbd className="mr-auto text-[10px] font-bold text-faint" dir="ltr">Ctrl K</kbd>
              </button>
            </div>
            <Link to="/" aria-label="الرئيسية" className="px-4">
              <ClassicLogo />
            </Link>
            <div className="flex items-center justify-end">
              <IconAction onClick={() => setSearchOpen(true)} icon={Search} label="بحث" className="lg:hidden" />
              <div className="hidden sm:flex flex-col items-center gap-1 px-1">
                <ThemeToggle className="!w-8 !h-8 !rounded-full" />
              </div>
              <IconAction to="/wishlist" icon={Heart} label="المفضلة" count={wishlist.length} className="hidden sm:flex" />
              {cartAction}
            </div>
          </div>
        </div>

        {/* صف الروابط بين خطين رفيعين */}
        <nav className="hidden lg:block border-y border-ink/10" onMouseLeave={() => setMegaOpen(false)}>
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-center">
            <NavRow megaOpen={megaOpen} setMegaOpen={setMegaOpen} />
          </div>
          {megaOpen && !condensed && <CategoriesPanel onClose={() => setMegaOpen(false)} />}
        </nav>
      </header>

      {/* الشريط المختصر اللي بيظهر لما تنزل */}
      {layout.stickyHeader !== false && (
        <div
          dir="rtl"
          className={`fixed top-0 inset-x-0 z-50 bg-base/95 backdrop-blur-md border-b border-ink/10 shadow-sm transition-transform duration-500 ${condensed ? "translate-y-0" : "-translate-y-full"}`}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-14 grid grid-cols-[auto_1fr_auto] items-center gap-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setDrawer(true)} className="lg:hidden p-1.5 text-ink-2 cursor-pointer" aria-label="القائمة"><Menu size={22} strokeWidth={1.6} /></button>
              <Link to="/" aria-label="الرئيسية"><ClassicLogo compact /></Link>
            </div>
            <nav className="hidden lg:block"><NavRow compact megaOpen={megaOpen} setMegaOpen={setMegaOpen} /></nav>
            <div className="flex items-center gap-1 justify-end lg:justify-start">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-ink-2 hover:text-brand cursor-pointer" aria-label="بحث"><Search size={19} strokeWidth={1.6} /></button>
              <Link to="/cart" className="relative p-2 text-ink-2 hover:text-brand" aria-label="السلة">
                <ShoppingBag size={19} strokeWidth={1.6} />
                {cartCount > 0 && <span className="absolute top-0.5 left-0.5 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[9px] font-black flex items-center justify-center">{cartCount}</span>}
              </Link>
            </div>
          </div>
          {megaOpen && condensed && <CategoriesPanel onClose={() => setMegaOpen(false)} />}
        </div>
      )}

      {/* قائمة الموبايل الجانبية */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setDrawer(false)} dir="rtl">
          <aside className="absolute inset-y-0 right-0 w-[86%] max-w-sm bg-base flex flex-col animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
              <ClassicLogo compact />
              <button onClick={() => setDrawer(false)} className="p-1 text-ink-2 cursor-pointer" aria-label="إغلاق"><X size={22} strokeWidth={1.6} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-ink/10">
                {LINKS.filter((l) => !l.mega).map((l, i) => (
                  <li key={l.to} className="animate-page" style={{ animationDelay: `${i * 40}ms` }}>
                    <NavLink to={l.to} end={l.end} className={({ isActive }) => `flex items-center justify-between py-4 text-[15px] font-bold tracking-wide ${isActive ? "text-brand" : "text-ink"}`}>
                      {l.label} <ChevronLeft size={16} className="text-faint" />
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-[10px] font-black tracking-[0.3em] text-brand">الأقسام</div>
              <ul className="mt-2 divide-y divide-ink/10">
                {categories.map((c) => {
                  const open = openCat === c.id;
                  return (
                    <li key={c.id}>
                      <button onClick={() => setOpenCat(open ? null : c.id)} className="w-full flex items-center justify-between py-3.5 text-sm font-bold text-ink-2 cursor-pointer">
                        <span className="flex items-center gap-2.5"><Icon name={c.icon} size={15} className="text-brand" /> {c.name}</span>
                        <ChevronDown size={15} className={`text-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                      </button>
                      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden">
                          <div className="pb-3 pr-7 space-y-2.5">
                            <Link to={`/category/${c.id}`} className="block text-xs font-bold text-brand">عرض الكل</Link>
                            {c.subcategories.map((s) => (
                              <Link key={s} to={`/category/${c.id}?sub=${encodeURIComponent(s)}`} className="block text-xs text-muted">{s}</Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="px-6 py-5 border-t border-ink/10 space-y-4">
              <div className="flex items-center justify-between">
                <Link to="/track" className="inline-flex items-center gap-2 text-sm font-bold text-ink-2"><Truck size={16} className="text-brand" /> تتبع شحنتك</Link>
                <ThemeToggle />
              </div>
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-muted"><Phone size={15} /> {settings.phone}</a>
            </div>
          </aside>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
