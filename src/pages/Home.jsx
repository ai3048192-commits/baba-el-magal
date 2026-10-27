import { useStore } from "../store/StoreContext";
import usePageTitle from "../lib/usePageTitle";
import HeroSlider from "../components/home/HeroSlider";
import CategoriesGrid from "../components/home/CategoriesGrid";
import TodayDeals from "../components/home/TodayDeals";
import DealsSection from "../components/home/DealsSection";
import PromoBanner from "../components/home/PromoBanner";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PartnersMarquee from "../components/home/PartnersMarquee";
import HowItWorks from "../components/home/HowItWorks";

// أقسام الرئيسية — ترتيبها وإظهارها من لوحة التحكم ← الإعدادات ← التخطيط
const HOME_SECTIONS = {
  hero: { label: "السلايدر الرئيسي", Component: HeroSlider },
  categories: { label: "تسوق حسب الأقسام", Component: CategoriesGrid },
  todayDeals: { label: "عروض النهارده", Component: TodayDeals },
  deals: { label: "ركن الخصومات", Component: DealsSection },
  banner: { label: "البانر الترويجي", Component: PromoBanner },
  featured: { label: "منتجات مختارة", Component: FeaturedProducts },
  steps: { label: "خطوات الطلب", Component: HowItWorks },
  partners: { label: "شريط الشركاء", Component: PartnersMarquee },
};

export default function Home() {
  usePageTitle("");
  const { db } = useStore();
  const saved = db.settings.layout?.homeSections || [];
  // أي قسم جديد اتضاف للموقع ومش في إعدادات الأدمن بيظهر في الآخر
  const sections = [...saved, ...Object.keys(HOME_SECTIONS).filter((id) => !saved.some((s) => s.id === id)).map((id) => ({ id, visible: true }))];

  return (
    <>
      {sections
        .filter((s) => s.visible && HOME_SECTIONS[s.id])
        .map(({ id }) => {
          const { Component } = HOME_SECTIONS[id];
          return <Component key={id} />;
        })}
    </>
  );
}
