import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Truck, PackageCheck, CheckCircle2, Circle, XCircle, ExternalLink, Phone, MapPin, Wallet, Clock } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatDateTime, formatPrice, ORDER_STATUSES, PAYMENT_METHODS, TRACK_STEPS } from "../lib/format";
import { getConfig, remoteTrackOrder } from "../lib/supabase";
import usePageTitle from "../lib/usePageTitle";
import { Container, PageHero } from "../components/ui";

const inputCls =
  "w-full card-inset py-3.5 text-sm text-ink placeholder-fainter focus:border-brand outline-none transition";

const normalizePhone = (p) => String(p || "").replace(/\D/g, "").replace(/^20/, "0");

// تتبع الشحنة (/track) — العميل بيدخل رقم الطلب + رقم الموبايل
export default function Track() {
  usePageTitle("تتبع شحنتك");
  const { db } = useStore();
  const [params] = useSearchParams();
  const [number, setNumber] = useState(params.get("order") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setError(""), [number, phone]);

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    const num = number.trim().toUpperCase();
    let found = db.orders.find((o) => o.number.toUpperCase() === num && normalizePhone(o.customer.phone) === normalizePhone(phone));
    // لو مش موجود على الجهاز ده والموقع مربوط بـ Supabase ندور هناك
    const cfg = getConfig(db.settings);
    if (!found && cfg) {
      try {
        found = await remoteTrackOrder(cfg, num, normalizePhone(phone));
      } catch {
        /* هنعرض رسالة "مش لاقيين" */
      }
    }
    setLoading(false);
    if (found) setOrder(found);
    else setError("مش لاقيين طلب بالرقم ده — اتأكد من رقم الطلب ورقم الموبايل اللي سجلت بيه.");
  };

  return (
    <div dir="rtl" className="pb-24">
      <PageHero eyebrow="تتبع الشحنة" title="تتبع" highlight="شحنتك" subtitle="اكتب رقم الطلب اللي وصلك بعد الشراء ورقم الموبايل، وتابع طلبك خطوة بخطوة لحد باب بيتك." />

      <Container className="mt-8">
        <div className="max-w-3xl mx-auto space-y-6">
        <form onSubmit={search} className="card-soft p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
          <div className="relative">
            <PackageCheck size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-faint" />
            <input required value={number} onChange={(e) => setNumber(e.target.value)} placeholder="رقم الطلب (مثال: BEM-1234)" className={`${inputCls} pr-10 pl-3 font-mono`} dir="ltr" />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-faint" />
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الموبايل" className={`${inputCls} pr-10 pl-3`} dir="ltr" />
          </div>
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand hover:bg-brand-dark text-white rounded-2xl text-sm font-bold transition cursor-pointer disabled:opacity-60">
            <Search size={16} /> {loading ? "جاري البحث..." : "تتبع"}
          </button>
          {error && <p className="sm:col-span-3 text-xs text-brand font-bold">{error}</p>}
        </form>

        {order && <TrackResult order={order} />}

        {!order && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {[
              [PackageCheck, "رقم الطلب", "موجود في رسالة تأكيد الطلب"],
              [Truck, "تتبع مباشر", "كل تحديث بيظهر هنا فوراً"],
              [Phone, "محتاج مساعدة؟", db.settings.phone],
            ].map(([I, t, d]) => (
              <div key={t} className="card-soft p-5 space-y-2">
                <I size={22} className="mx-auto text-brand" />
                <div className="text-sm font-bold text-ink">{t}</div>
                <div className="text-[11px] text-muted">{d}</div>
              </div>
            ))}
          </div>
        )}
        </div>
      </Container>
    </div>
  );
}

function TrackResult({ order }) {
  const { db } = useStore();
  const company = db.shippingCompanies.find((c) => c.id === order.shippingCompanyId) || (order.companyName ? { name: order.companyName, trackingUrl: order.trackingUrl } : null);
  const stopped = ["cancelled", "returned"].includes(order.status);
  const currentIdx = TRACK_STEPS.findIndex((s) => s.id === order.status);
  const history = [...(order.history || [])].reverse();
  const carrierLink = company?.trackingUrl && order.trackingNumber ? company.trackingUrl.replace("{tracking}", encodeURIComponent(order.trackingNumber)) : "";
  const statusInfo = ORDER_STATUSES.find((s) => s.id === order.status);
  const deposit = order.deposit || {};

  return (
    <div className="space-y-4 animate-scale-in">
      <div className="card-soft p-5 sm:p-7 space-y-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-[11px] text-faint">رقم الطلب</span>
            <div className="text-lg font-black text-ink font-mono" dir="ltr">{order.number}</div>
            <span className="text-[11px] text-faint">{formatDateTime(order.createdAt)}</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-2xl border ${statusInfo?.className}`}>
            {stopped ? <XCircle size={14} /> : <Truck size={14} />} {statusInfo?.label}
          </span>
        </div>

        {/* شريط الخطوات */}
        {!stopped && (
          <ol className="grid grid-cols-6 gap-1">
            {TRACK_STEPS.map((step, i) => {
              const done = i <= currentIdx;
              return (
                <li key={step.id} className="flex flex-col items-center text-center gap-2">
                  <div className="relative w-full flex items-center justify-center">
                    {i > 0 && <span className={`absolute left-1/2 -right-1/2 top-1/2 -translate-y-1/2 h-1 rounded-full ${i <= currentIdx ? "bg-brand" : "bg-ink/10"}`} />}
                    <span className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 ${done ? "bg-brand border-brand text-white" : "bg-deep border-ink/15 text-fainter"} ${i === currentIdx ? "ring-4 ring-brand/25" : ""}`}>
                      {done ? <CheckCircle2 size={16} /> : <Circle size={12} />}
                    </span>
                  </div>
                  <span className={`text-[9px] sm:text-[11px] font-bold leading-tight ${done ? "text-ink" : "text-faint"}`}>{step.short}</span>
                </li>
              );
            })}
          </ol>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 card-inset space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink"><Truck size={15} className="text-brand" /> شركة الشحن</div>
            <div className="text-ink-3">{company?.name || "لم يتم التحديد بعد"}</div>
            {order.trackingNumber && <div className="text-muted">رقم البوليصة: <span className="font-mono text-ink" dir="ltr">{order.trackingNumber}</span></div>}
            {carrierLink && (
              <a href={carrierLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand font-bold">
                التتبع على موقع الشركة <ExternalLink size={12} />
              </a>
            )}
          </div>
          <div className="p-4 card-inset space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink"><MapPin size={15} className="text-brand" /> التوصيل إلى</div>
            <div className="text-ink-3">{order.customer?.name}</div>
            <div className="text-muted">{order.customer?.governorate} - {order.customer?.city}</div>
          </div>
          <div className="p-4 card-inset space-y-2 sm:col-span-2">
            <div className="flex items-center gap-2 font-bold text-ink"><Wallet size={15} className="text-brand" /> الدفع</div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted">
              <span>الطريقة: <span className="text-ink">{PAYMENT_METHODS[order.paymentMethod]}</span></span>
              <span>الإجمالي: <span className="text-ink font-bold">{formatPrice(order.total)}</span></span>
              {deposit.amount > 0 && (
                <>
                  <span>العربون: <span className={deposit.paid ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{formatPrice(deposit.amount)} {deposit.paid ? "(تم الاستلام ✓)" : "(في انتظار التأكيد)"}</span></span>
                  <span>المطلوب عند الاستلام: <span className="text-ink font-bold">{formatPrice(order.total - deposit.amount)}</span></span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* سجل التحديثات */}
      {history.length > 0 && (
        <div className="card-soft p-5 sm:p-7">
          <h3 className="text-sm font-black text-ink mb-5 flex items-center gap-2"><Clock size={16} className="text-brand" /> سجل التحديثات</h3>
          <ol className="relative border-r-2 border-ink/10 mr-2 space-y-5">
            {history.map((h, i) => (
              <li key={i} className="pr-6 relative">
                <span className={`absolute -right-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-card ${i === 0 ? "bg-brand" : "bg-slate-600"}`} />
                <div className="text-xs font-bold text-ink">{ORDER_STATUSES.find((s) => s.id === h.status)?.label}</div>
                {h.note && <div className="text-xs text-ink-3 mt-0.5">{h.note}</div>}
                <div className="text-[10px] text-faint mt-0.5">{formatDateTime(h.at)}</div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="text-center text-xs text-faint">
        عندك استفسار؟ <Link to="/about" className="text-brand font-bold">كلمنا</Link> أو اتصل على {db.settings.phone}
      </p>
    </div>
  );
}
