// الأيقونات المسموح اختيارها من لوحة التحكم (البيانات بتخزن اسم الأيقونة فقط)
import {
  Box,
  Utensils,
  Sparkles,
  Zap,
  Wrench,
  Palette,
  Flame,
  Tag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Users,
  Gem,
  MapPin,
  PackageCheck,
  BadgePercent,
  Home,
  Gift,
  Star,
  Heart,
  Lamp,
  Sofa,
  Bed,
  CookingPot,
  ShoppingBag,
} from "lucide-react";

export const ICONS = {
  Box,
  Utensils,
  Sparkles,
  Zap,
  Wrench,
  Palette,
  Flame,
  Tag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Users,
  Gem,
  MapPin,
  PackageCheck,
  BadgePercent,
  Home,
  Gift,
  Star,
  Heart,
  Lamp,
  Sofa,
  Bed,
  CookingPot,
  ShoppingBag,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Box;
  return <Cmp {...props} />;
}
