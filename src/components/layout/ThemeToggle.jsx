import { Sun, Moon } from "lucide-react";
import { useStore } from "../../store/StoreContext";

// زرار الوضع الغامق/الفاتح — الأيقونة بتلف وتتبدل
export default function ThemeToggle({ className = "" }) {
  const { isDark, setIsDark } = useStore();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center text-ink-2 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer overflow-hidden ${className}`}
      aria-label={isDark ? "الوضع الفاتح" : "الوضع الغامق"}
      title={isDark ? "الوضع الفاتح" : "الوضع الغامق"}
      type="button"
    >
      <Sun size={19} className={`absolute text-amber-400 transition-all duration-500 ${isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
      <Moon size={19} className={`absolute transition-all duration-500 ${isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
    </button>
  );
}
