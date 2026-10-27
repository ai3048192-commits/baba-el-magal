import { useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { fontUrl, hexToChannels } from "../../lib/theme";

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content || "");
};

const addScriptOnce = (id, src, inline) => {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  if (src) {
    el.async = true;
    el.src = src;
  } else el.textContent = inline;
  document.head.appendChild(el);
};

// بيطبّق إعدادات المظهر و SEO من لوحة التحكم على الصفحة كلها
export default function ThemeManager() {
  const { db } = useStore();
  const { theme = {}, layout = {}, seo = {}, favicon } = db.settings;

  // الألوان + العرض + الأعمدة
  useEffect(() => {
    const root = document.documentElement.style;
    const vars = {
      "--brand": theme.brand,
      "--brand-dark": theme.brandDark,
      "--brand-2": theme.accent,
      "--dark-bg": theme.bg,
      "--dark-surface": theme.surface,
      "--dark-surface-2": theme.surface2,
      "--light-bg": theme.lightBg,
      "--light-surface": theme.lightSurface,
      "--light-surface-2": theme.lightSurface2,
    };
    Object.entries(vars).forEach(([k, hex]) => {
      const ch = hexToChannels(hex);
      if (ch) root.setProperty(k, ch);
    });
    root.setProperty("--container", `${Number(layout.containerWidth) || 80}rem`);
    root.setProperty("--cols", String(Number(layout.productColumns) || 4));
    setMeta("name", "theme-color", theme.brand);
  }, [theme.brand, theme.brandDark, theme.accent, theme.bg, theme.surface, theme.surface2, theme.lightBg, theme.lightSurface, theme.lightSurface2, layout.containerWidth, layout.productColumns]);

  // الخطوط
  useEffect(() => {
    const body = theme.fontBody || "Tajawal";
    const heading = theme.fontHeading || body;
    const link = document.getElementById("font-link");
    if (link) link.href = fontUrl([body, heading]);
    document.documentElement.style.setProperty("--font-body", `"${body}"`);
    document.documentElement.style.setProperty("--font-heading", `"${heading}"`);
  }, [theme.fontBody, theme.fontHeading]);

  // الأيقونة و SEO
  useEffect(() => {
    const icon = document.getElementById("favicon");
    if (icon && favicon) icon.href = favicon;
    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "robots", seo.indexing === false ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:image", seo.ogImage);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
  }, [favicon, seo.title, seo.description, seo.keywords, seo.ogImage, seo.indexing]);

  // أدوات التحليل
  useEffect(() => {
    const ga = seo.googleAnalyticsId?.trim();
    if (ga && /^G-[A-Z0-9]+$/i.test(ga)) {
      addScriptOnce("ga-src", `https://www.googletagmanager.com/gtag/js?id=${ga}`);
      addScriptOnce("ga-init", null, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`);
    }
    const px = seo.facebookPixelId?.trim();
    if (px && /^\d+$/.test(px)) {
      addScriptOnce(
        "fb-pixel",
        null,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${px}');fbq('track','PageView');`,
      );
    }
  }, [seo.googleAnalyticsId, seo.facebookPixelId]);

  return seo.customCss ? <style>{seo.customCss}</style> : null;
}
