import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, MessageSquare, Image, Gift, Users, Settings,
  LogOut, ExternalLink, Menu, X, Truck, Bell,
} from "lucide-react";
import { Logo } from "../components/ui";
import ThemeToggle from "../components/layout/ThemeToggle";
import { useStore } from "../store/StoreContext";
import { getConfig } from "../lib/supabase";

// القائمة متقسمة مجموعات عشان تبقى أوضح
const GROUPS = [
  {
    title: "المتجر",
    items: [
      { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true },
      { to: "/admin/orders", label: "الطلبات", icon: ShoppingCart, badge: "orders" },
      { to: "/admin/shipping", label: "الشحن والتتبع", icon: Truck, badge: "deposits" },
      { to: "/admin/customers", label: "العملاء", icon: Users },
    ],
  },
  {
    title: "الكتالوج",
    items: [
      { to: "/admin/products", label: "المنتجات", icon: Package },
      { to: "/admin/categories", label: "الأقسام", icon: FolderTree },
      { to: "/admin/offers", label: "العروض والكوبونات", icon: Gift },
      { to: "/admin/reviews", label: "التقييمات", icon: MessageSquare },
    ],
  },
  {
    title: "الموقع",
    items: [
      { to: "/admin/content", label: "محتوى الصفحات", icon: Image },
      { to: "/admin/settings", label: "الإعدادات", icon: Settings },
    ],
  },
];

const TITLES = Object.fromEntries(GROUPS.flatMap((g) => g.items.map((i) => [i.to, i.label])));

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "صباح الخير" : h < 18 ? "مساء الخير" : "مساء النور";
};

// هيكل لوحة التحكم + حماية الدخول
export default function AdminLayout() {
  const { isAdmin, logout, db, pendingPush } = useStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (!isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const counts = {
    orders: db.orders.filter((o) => o.status === "new").length,
    deposits: db.orders.filter((o) => o.deposit?.amount > 0 && !o.deposit.paid && !["cancelled", "returned"].includes(o.status)).length,
  };
  const alerts = counts.orders + counts.deposits;
  const title = TITLES[location.pathname] || "لوحة التحكم";

  const sidebar = (
    <div className="flex flex-col h-full">
      <Link to="/admin" className="flex items-center gap-2.5 px-5 h-20 shrink-0">
        <Logo size="sm" />
      </Link>
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-6">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="px-3 mb-2 text-[10px] font-black tracking-widest text-faint">{g.title}</div>
            <div className="space-y-1">
              {g.items.map(({ to, label, icon: I, end, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                      isActive ? "bg-gradient-to-l from-brand to-brand-dark text-white shadow-lg shadow-brand/25" : "text-muted hover:bg-ink/5 hover:text-ink hover:pr-4"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${isActive ? "bg-white/20" : "bg-ink/5 group-hover:bg-brand/10 group-hover:text-brand"}`}>
                        <I size={16} />
                      </span>
                      <span className="flex-1">{label}</span>
                      {badge && counts[badge] > 0 && (
                        <span className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${isActive ? "bg-white text-brand" : "bg-brand text-white"}`}>
                          {counts[badge]}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-3 m-3 rounded-3xl bg-card border border-ink/10 space-y-1">
        <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-muted hover:bg-ink/5 hover:text-ink">
          <ExternalLink size={16} /> عرض الموقع
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-muted hover:bg-brand/10 hover:text-brand cursor-pointer">
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-base text-ink-1 selection:bg-brand selection:text-white">
      <aside className="hidden lg:block fixed inset-y-0 right-0 w-72 bg-deep border-l border-ink/10 z-40">{sidebar}</aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
          <aside className="absolute inset-y-0 right-0 w-72 bg-deep border-l border-ink/10 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pr-72">
        {/* الهيدر */}
        <header className="sticky top-0 z-30 glass border-b border-ink/10">
          <div className="h-16 sm:h-20 flex items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-ink-2 hover:bg-ink/5 cursor-pointer" aria-label="القائمة">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="min-w-0">
              <div className="text-[11px] text-faint font-bold hidden sm:block">{greeting()} 👋</div>
              <div className="text-base sm:text-lg font-black text-ink truncate">{title}</div>
            </div>
            <div className="mr-auto flex items-center gap-1">
              <Link to="/admin/orders" className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-ink-2 hover:bg-brand/10 hover:text-brand transition" aria-label="التنبيهات">
                <Bell size={19} />
                {alerts > 0 && <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[9px] font-black flex items-center justify-center animate-ring">{alerts}</span>}
              </Link>
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2.5 mr-2 pr-3 border-r border-ink/10">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center font-black text-sm">
                  {db.settings.storeNameAr?.[0] || "أ"}
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-black text-ink">الأدمن</div>
                  <div className="text-[10px] text-faint">{db.settings.storeNameAr}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main key={location.pathname} className="p-4 sm:p-6 lg:p-8 max-w-7xl animate-page">
          {pendingPush && getConfig(db.settings) && (
            <Link to="/admin/settings" className="flex items-center gap-2 mb-5 p-3.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 text-xs font-bold text-amber-300">
              ⚠️ عندك تعديلات لسه ما اترفعتش لـ Supabase — الزوار مش هيشوفوها. ارفعها من الإعدادات ← الربط و API.
            </Link>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
