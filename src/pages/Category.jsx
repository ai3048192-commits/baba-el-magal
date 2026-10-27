import { useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import CatalogView from "../components/shop/CatalogView";
import { Container, PageHero, EmptyState, PrimaryLink } from "../components/ui";
import { Icon } from "../lib/icons";
import usePageTitle from "../lib/usePageTitle";

// صفحة قسم (/category/:categoryId) — الفلترة بالأقسام الفرعية
export default function Category() {
  const { categoryId } = useParams();
  const [params] = useSearchParams();
  const { db, products: allProducts } = useStore();
  const category = db.categories.find((c) => c.id === categoryId);
  const getValue = useCallback((p) => p.subcategory, []);
  usePageTitle(category?.name || "القسم غير موجود");

  if (!category) {
    return (
      <Container className="py-20">
        <EmptyState title="القسم غير موجود" action={<PrimaryLink to="/shop">العودة للمتجر</PrimaryLink>} />
      </Container>
    );
  }

  const list = allProducts.filter((p) => p.active && p.categoryId === category.id && p.sections.includes("catalog"));
  const options = category.subcategories.map((s) => ({ value: s, label: s }));
  const sub = params.get("sub");
  const others = db.categories.filter((c) => c.id !== category.id).sort((a, b) => a.order - b.order);

  return (
    <div dir="rtl" className="pb-24">
      <PageHero
        eyebrow={`قسم ${category.name}`}
        title="أرقى"
        highlight={category.name}
        subtitle={`تسوّق تشكيلة مميزة من ${category.subcategories.slice(0, 3).join("، ")} وأكثر بأعلى جودة.`}
      >
        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
          {others.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 card-soft hover:border-brand/40 text-[11px] font-bold text-ink-3 hover:text-ink transition"
            >
              <Icon name={c.icon} size={13} className="text-brand" />
              {c.name}
            </Link>
          ))}
        </div>
      </PageHero>
      <Container className="mt-8">
        <CatalogView
          key={`${category.id}-${sub}`}
          products={list}
          options={options}
          getValue={getValue}
          filterTitle="الأقسام الفرعية"
          initialFilter={sub && category.subcategories.includes(sub) ? sub : "all"}
          searchPlaceholder={`ابحث في ${category.name}...`}
        />
      </Container>
    </div>
  );
}
