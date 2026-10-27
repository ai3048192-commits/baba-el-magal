import { useEffect } from "react";
import { useStore } from "../store/StoreContext";

// عنوان التاب لكل صفحة: "اسم الصفحة | اسم المتجر" (الرئيسية بتاخد عنوان الـ SEO كامل)
export default function usePageTitle(title) {
  const { db } = useStore();
  const { seo = {}, storeNameAr } = db.settings;
  useEffect(() => {
    document.title = title ? `${title} | ${storeNameAr}` : seo.title || storeNameAr;
  }, [title, seo.title, storeNameAr]);
}
