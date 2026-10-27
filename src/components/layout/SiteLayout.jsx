import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingSocialBar from "./FloatingSocialBar";
import { useStore } from "../../store/StoreContext";
import { useScrolled } from "../../lib/motion";
import Maintenance from "../../pages/Maintenance";

// شريط رفيع فوق بيتملى مع التمرير
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 h-[3px] z-[60] pointer-events-none">
      <div className="h-full bg-gradient-to-l from-brand via-brand-2 to-brand origin-right transition-transform duration-150" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

function BackToTop() {
  const show = useScrolled(700);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="الرجوع لأعلى"
      className={`fixed bottom-24 lg:bottom-6 right-5 z-40 w-12 h-12 rounded-none glass border border-ink/10 text-ink shadow-xl flex items-center justify-center transition-all duration-500 hover:bg-brand hover:text-white hover:border-brand cursor-pointer ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}

// هيكل صفحات الموقع (العميل): هيدر + محتوى بحركة دخول + فوتر + أزرار التواصل + وضع الصيانة
export default function SiteLayout() {
  const { pathname } = useLocation();
  const { db, isAdmin } = useStore();
  const layout = db.settings.layout || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // وضع الصيانة: الزوار يشوفوا رسالة، والأدمن المسجل يشوف الموقع عادي
  if (layout.maintenanceMode && !isAdmin) return <Maintenance />;

  return (
    <div className="flex flex-col w-full min-h-screen bg-base text-ink-1 selection:bg-brand selection:text-white">
      <ScrollProgress />
      <Navbar />
      <main key={pathname} className="flex-grow w-full animate-page">
        <Outlet />
      </main>
      {layout.showFloatingSocial !== false && <FloatingSocialBar />}
      <BackToTop />
      <Footer />
    </div>
  );
}
