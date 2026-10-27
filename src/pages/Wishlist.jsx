import { Heart } from "lucide-react";
import { useStore } from "../store/StoreContext";
import ProductCard from "../components/shop/ProductCard";
import { Container, PageHero, EmptyState, PrimaryLink } from "../components/ui";
import usePageTitle from "../lib/usePageTitle";

// المفضلة (/wishlist)
export default function Wishlist() {
  usePageTitle("المفضلة");
  const { products: allProducts, wishlist } = useStore();
  const items = allProducts.filter((p) => p.active && wishlist.includes(p.id));

  return (
    <div dir="rtl" className="pb-24">
      <PageHero eyebrow="المفضلة" title="منتجاتك" highlight="المفضلة" subtitle="كل المنتجات اللي حفظتها علشان ترجعلها بعدين." />
      <Container className="mt-8">
        {items.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-products gap-3 sm:gap-5">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          <EmptyState icon={Heart} title="المفضلة فاضية" text="دوس على القلب في أي منتج علشان تحفظه هنا." action={<PrimaryLink to="/shop">تصفح المنتجات</PrimaryLink>} />
        )}
      </Container>
    </div>
  );
}
