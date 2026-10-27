import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./store/StoreContext";
import { Toast } from "./components/ui";
import SiteLayout from "./components/layout/SiteLayout";
import ThemeManager from "./components/layout/ThemeManager";

// صفحات الموقع
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Discounts from "./pages/Discounts";
import FridayOffers from "./pages/FridayOffers";
import About from "./pages/About";
import Offers from "./pages/Offers";
import Track from "./pages/Track";
import NotFound from "./pages/NotFound";

// لوحة التحكم (بتتحمل لوحدها لما الأدمن يفتحها — عشان الموقع يفضل خفيف للعملاء)
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const OrdersAdmin = lazy(() => import("./admin/OrdersAdmin"));
const ProductsAdmin = lazy(() => import("./admin/ProductsAdmin"));
const CategoriesAdmin = lazy(() => import("./admin/CategoriesAdmin"));
const ReviewsAdmin = lazy(() => import("./admin/ReviewsAdmin"));
const ContentAdmin = lazy(() => import("./admin/ContentAdmin"));
const OffersAdmin = lazy(() => import("./admin/OffersAdmin"));
const CustomersAdmin = lazy(() => import("./admin/CustomersAdmin"));
const SettingsAdmin = lazy(() => import("./admin/SettingsAdmin"));
const ShippingAdmin = lazy(() => import("./admin/ShippingAdmin"));

export default function App() {
  return (
    <StoreProvider>
      <ThemeManager />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-base" />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/friday-offers" element={<FridayOffers />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/track" element={<Track />} />
            <Route path="/about" element={<About />} />

            {/* روابط قديمة كانت في الموقع */}
            <Route path="/linens" element={<Navigate to="/category/linens" replace />} />
            <Route path="/products" element={<Navigate to="/shop" replace />} />
            <Route path="/categories" element={<Navigate to="/shop" replace />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="content" element={<ContentAdmin />} />
            <Route path="offers" element={<OffersAdmin />} />
            <Route path="customers" element={<CustomersAdmin />} />
            <Route path="shipping" element={<ShippingAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
        </Routes>
        </Suspense>
        <Toast />
      </BrowserRouter>
    </StoreProvider>
  );
}
