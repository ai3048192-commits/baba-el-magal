// أدوات الثيم: تحويل الألوان لصيغة متغيرات CSS + قائمة الخطوط المتاحة

export const FONTS = [
  "Tajawal",
  "Cairo",
  "Almarai",
  "IBM Plex Sans Arabic",
  "Noto Kufi Arabic",
  "Readex Pro",
  "Changa",
  "El Messiri",
  "Lalezar",
  "Rubik",
];

// "#E50914" → "229 9 20"
export function hexToChannels(hex) {
  let h = String(hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export const fontUrl = (fonts) => {
  const families = [...new Set(fonts.filter(Boolean))]
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;700;800;900`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

// ثيمات جاهزة يختار منها الأدمن بضغطة (فيها ألوان الوضع الغامق والفاتح)
export const PRESETS = [
  { name: "الأحمر (الأصلي)", brand: "#E50914", brandDark: "#BE123C", accent: "#F43F5E", bg: "#070709", surface: "#121216", surface2: "#0A0A0C", lightBg: "#F5F5F7", lightSurface: "#FFFFFF", lightSurface2: "#EEEEF2" },
  { name: "ذهبي فاخر", brand: "#D4A017", brandDark: "#A87C0F", accent: "#F5C542", bg: "#0B0A07", surface: "#17150F", surface2: "#100E0A", lightBg: "#FAF7EF", lightSurface: "#FFFFFF", lightSurface2: "#F1ECDD" },
  { name: "أزرق ملكي", brand: "#2563EB", brandDark: "#1D4ED8", accent: "#38BDF8", bg: "#06080D", surface: "#111521", surface2: "#0A0D15", lightBg: "#F3F6FB", lightSurface: "#FFFFFF", lightSurface2: "#E7EDF7" },
  { name: "أخضر زمردي", brand: "#059669", brandDark: "#047857", accent: "#34D399", bg: "#050907", surface: "#101814", surface2: "#0A100D", lightBg: "#F2F8F5", lightSurface: "#FFFFFF", lightSurface2: "#E4F0EA" },
  { name: "بنفسجي", brand: "#7C3AED", brandDark: "#6D28D9", accent: "#C084FC", bg: "#08060D", surface: "#141020", surface2: "#0D0A15", lightBg: "#F6F3FB", lightSurface: "#FFFFFF", lightSurface2: "#ECE6F7" },
];
