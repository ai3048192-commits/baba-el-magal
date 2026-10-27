import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import CatalogView from "../components/shop/CatalogView";
import { Container, PageHero } from "../components/ui";
import usePageTitle from "../lib/usePageTitle";

// كل المنتجات (/shop) — الفلترة بالأقسام الرئيسية
export default function Shop() {
  usePageTitle("المتجر");
  const { db, products: allProducts } = useStore();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const list = allProducts.filter((p) => p.active && p.sections.includes("catalog"));
  const options = [...db.categories].sort((a, b) => a.order - b.order).map((c) => ({ value: c.id, label: c.name }));
  const getValue = useCallback((p) => p.categoryId, []);

  return (
    <div dir="rtl" className="pb-24">
      <PageHero
        eyebrow="التسوق الذكي"
        title="كل"
        highlight="الأجهزة والأدوات المنزلية"
        subtitle="اكتشف تشكيلة واسعة من الأدوات المنزلية والأجهزة المتاحة لتلبية كافة احتياجاتك بكل سهولة."
      />
      <Container className="mt-8">
        <CatalogView key={q} products={list} options={options} getValue={getValue} filterTitle="الأقسام" initialSearch={q} />
      </Container>
    </div>
  );
}
