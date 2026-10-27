import { Wrench, MessageCircle } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { Logo } from "../components/ui";

// صفحة وضع الصيانة (بتتفعل من الإعدادات ← التخطيط)
export default function Maintenance() {
  const { db } = useStore();
  const s = db.settings;
  return (
    <div dir="rtl" className="min-h-screen bg-base flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="relative max-w-lg text-center space-y-6">
        <div className="flex justify-center"><Logo /></div>
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
          <Wrench size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">{s.layout?.maintenanceMessage}</h1>
        <a
          href={`https://wa.me/${s.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] text-white text-sm font-bold"
        >
          <MessageCircle size={18} /> كلمنا واتساب
        </a>
      </div>
    </div>
  );
}
