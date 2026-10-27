import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  X, Truck, CreditCard, Wallet, Receipt, Lock, MapPin, Check, TicketPercent, HandCoins, Copy, ArrowRight, ArrowLeft,
  Phone, User, Home, Clock, ChevronDown, ShieldCheck, Pencil, PartyPopper,
} from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { formatPrice, GOVERNORATES, PAYMENT_METHODS } from "../../lib/format";
import { calcTotals, shippingFor } from "../../lib/pricing";
import CheckoutSteps from "./CheckoutSteps";

const fieldCls =
  "w-full bg-deep border border-ink/[0.07] rounded-xl px-4 py-3.5 text-sm text-ink placeholder-fainter outline-none transition hover:border-ink/15 focus:border-brand focus:ring-4 focus:ring-brand/10";

function Field({ label, icon: I, hint, className = "", children }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="flex items-center gap-1.5 text-[12px] font-bold text-ink-2">
        {I && <I size={13} className="text-brand" />} {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-faint">{hint}</span>}
    </label>
  );
}

const TIMES = ["أي وقت خلال اليوم", "صباحاً (10 ص - 4 م)", "مساءً (4 م - 10 م)"];

// شاشة إتمام الطلب: التوصيل ← الدفع ← المراجعة ← تم
export default function CheckoutModal({ items, onClose, onDone, initialCoupon = null, initialGovernorate = "القاهرة" }) {
  const { db, placeOrder, showToast } = useStore();
  const { settings } = db;
  const methods = Object.keys(PAYMENT_METHODS).filter((m) => settings.paymentMethods?.[m]);

  const [step, setStep] = useState(0); // 0 التوصيل، 1 الدفع، 2 المراجعة
  const [method, setMethod] = useState(methods[0] || "cod");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(initialCoupon);
  const [order, setOrder] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone1: "", phone2: "", governorate: initialGovernorate, city: "", street: "", building: "", apartment: "",
    landmark: "", preferredTime: TIMES[0], notes: "", walletPhone: "", walletRef: "", depositPhone: "", depositRef: "",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const totals = useMemo(() => calcTotals(items, db, { coupon, governorate: form.governorate, paymentMethod: method }), [items, db, coupon, form.governorate, method]);
  const zone = shippingFor(db, form.governorate);
  const pieces = items.reduce((s, i) => s + i.qty, 0);

  const METHODS = {
    cod: { icon: Truck, title: "الدفع عند الاستلام", desc: totals.deposit ? `عربون ${formatPrice(totals.deposit)} دلوقتي والباقي للمندوب` : "ادفع للمندوب بعد ما تعاين المنتج" },
    wallet: { icon: Wallet, title: "محفظة إلكترونية", desc: "فودافون كاش، إنستا باي، أو أي محفظة" },
    fawry: { icon: Receipt, title: "فوري", desc: "كود دفع من أي منفذ فوري خلال 72 ساعة" },
    card: { icon: CreditCard, title: "بطاقة بنكية", desc: "هيوصلك رابط دفع آمن من بوابة الدفع" },
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    const found = db.coupons.find((c) => c.active && c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (!found) return showToast("كود الخصم غير صحيح", "error");
    setCoupon(found);
    setCouponInput("");
    showToast("تم تطبيق كود الخصم 🎉");
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("تم النسخ");
    } catch {
      /* ignore */
    }
  };

  const next = (e) => {
    e.preventDefault();
    setStep((s) => Math.min(2, s + 1));
  };

  const confirm = () => {
    const created = placeOrder({
      customer: {
        name: form.fullName, phone: form.phone1, phone2: form.phone2, governorate: form.governorate, city: form.city,
        address: `${form.street} - عقار ${form.building} - ${form.apartment}`, landmark: form.landmark,
        preferredTime: form.preferredTime, notes: form.notes,
      },
      items: items.map((i) => ({ productId: i.product.id, name: i.product.name, image: i.product.image, price: i.product.price, qty: i.qty, color: i.color || "" })),
      paymentMethod: method,
      payment:
        method === "wallet"
          ? { walletPhone: form.walletPhone, ref: form.walletRef }
          : method === "fawry"
            ? { fawryCode: Math.floor(900000000 + Math.random() * 100000000).toString() }
            : {},
      deposit: { amount: totals.deposit, paid: false, phone: form.depositPhone, ref: form.depositRef },
      coupon: coupon?.code || "",
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
    });
    setOrder(created);
    onDone?.(created);
  };

  const CopyRow = ({ label, value }) => (
    <button type="button" onClick={() => copy(value)} className="w-full flex items-center justify-between gap-3 bg-base rounded-xl px-4 py-3 text-right hover:ring-2 hover:ring-brand/20 transition cursor-pointer">
      <span className="text-[12px] text-muted">{label}</span>
      <span className="flex items-center gap-2 font-mono text-sm font-bold text-ink" dir="ltr">{value} <Copy size={13} className="text-faint" /></span>
    </button>
  );

  // ===== الملخص (جنب الخطوات) =====
  const summary = (
    <div className="space-y-5">
      <div className="space-y-3 max-h-52 overflow-y-auto pl-1">
        {items.map((i) => (
          <div key={i.key || i.product.id} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img src={i.product.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-deep" />
              <span className="absolute -top-1.5 -left-1.5 min-w-5 h-5 px-1 rounded-full bg-ink text-white dark:text-neutral-900 text-[10px] font-black flex items-center justify-center">{i.qty}</span>
            </div>
            <span className="flex-1 min-w-0">
              <span className="block text-[12px] font-bold text-ink-2 line-clamp-2 leading-snug">{i.product.name}</span>
              {i.color && <span className="text-[11px] text-faint">{i.color}</span>}
            </span>
            <span className="text-[13px] font-bold text-ink whitespace-nowrap">{formatPrice(i.product.price * i.qty)}</span>
          </div>
        ))}
      </div>

      {coupon ? (
        <div className="flex items-center justify-between bg-emerald-500/10 rounded-xl px-3.5 py-2.5 text-sm">
          <span className="flex items-center gap-2 font-bold text-emerald-500"><TicketPercent size={15} /> {coupon.code}</span>
          <button onClick={() => setCoupon(null)} className="text-faint hover:text-brand cursor-pointer" aria-label="إلغاء الكوبون"><X size={15} /></button>
        </div>
      ) : (
        <form onSubmit={applyCoupon} className="flex items-center gap-2 bg-card border border-ink/[0.07] rounded-xl p-1.5 focus-within:ring-4 focus-within:ring-brand/10">
          <TicketPercent size={15} className="text-faint mr-2 shrink-0" />
          <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="كود الخصم" className="flex-1 min-w-0 bg-transparent py-1.5 text-sm text-ink placeholder-faint outline-none font-mono" />
          <button type="submit" className="px-3.5 py-2 rounded-lg bg-ink text-white dark:text-neutral-900 text-xs font-bold hover:bg-brand hover:text-white transition cursor-pointer">تطبيق</button>
        </form>
      )}

      <dl className="space-y-2.5 text-[13px]">
        <div className="flex justify-between text-muted"><dt>المجموع ({pieces} قطعة)</dt><dd className="text-ink font-bold">{formatPrice(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="flex justify-between text-muted"><dt>خصم الكوبون</dt><dd className="text-emerald-500 font-bold">− {formatPrice(totals.discount)}</dd></div>}
        <div className="flex justify-between text-muted">
          <dt>الشحن ({form.governorate}{zone.days ? ` • ${zone.days} يوم` : ""})</dt>
          <dd className="font-bold">{totals.shipping ? <span className="text-ink">{formatPrice(totals.shipping)}</span> : <span className="text-emerald-500">مجاناً</span>}</dd>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-ink/15">
          <dt className="font-black text-ink">الإجمالي</dt>
          <dd className="text-xl font-black text-ink">{formatPrice(totals.total)}</dd>
        </div>
        {totals.deposit > 0 && (
          <div className="mt-2 rounded-xl bg-amber-400/10 p-3 space-y-1.5">
            <div className="flex justify-between"><dt className="text-amber-400 font-bold">العربون دلوقتي</dt><dd className="text-amber-400 font-black">{formatPrice(totals.deposit)}</dd></div>
            <div className="flex justify-between text-muted"><dt>الباقي عند الاستلام</dt><dd className="text-ink font-bold">{formatPrice(totals.dueOnDelivery)}</dd></div>
          </div>
        )}
      </dl>
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-faint"><ShieldCheck size={13} /> بياناتك محمية ومش بتتشارك مع أي حد</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[65] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-6 animate-fade-in" dir="rtl">
      <div className="bg-card w-full max-w-5xl h-[96vh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-sheet">
        {/* الهيدر */}
        <div className="px-5 sm:px-7 py-4 border-b border-ink/[0.07] flex items-center gap-4">
          <h3 className="text-base sm:text-lg font-black text-ink shrink-0">{order ? "تم الطلب" : "إتمام الطلب"}</h3>
          <div className="flex-1 hidden md:block"><CheckoutSteps current={order ? 4 : step + 1} /></div>
          <button onClick={onClose} className="mr-auto w-10 h-10 rounded-full bg-ink/[0.05] hover:bg-ink/10 text-muted hover:text-ink flex items-center justify-center transition cursor-pointer" aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>
        <div className="md:hidden px-5 py-3 border-b border-ink/[0.07]"><CheckoutSteps current={order ? 4 : step + 1} /></div>

        {order ? (
          /* ===== تم الطلب ===== */
          <div className="overflow-y-auto">
            <div className="max-w-lg mx-auto text-center py-12 px-6 space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <span className="relative w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-scale-in"><Check size={44} strokeWidth={2.5} /></span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-light text-ink">شكراً يا <strong className="font-black">{order.customer.name}</strong> <PartyPopper size={24} className="inline text-amber-400" /></h3>
                <p className="text-sm text-muted leading-loose">
                  طلبك اتسجل وهيوصلك على {order.customer.governorate} - {order.customer.city}{zone.days && ` خلال ${zone.days} يوم`}. هنكلمك على <span dir="ltr">{order.customer.phone}</span> نأكد معاك.
                </p>
              </div>
              <div className="card-inset p-5 space-y-2">
                <span className="text-[11px] text-faint tracking-wider">رقم الطلب — احتفظ بيه للتتبع</span>
                <button onClick={() => copy(order.number)} className="flex items-center justify-center gap-2 w-full text-2xl font-black text-ink font-mono cursor-pointer" dir="ltr">
                  {order.number} <Copy size={16} className="text-faint" />
                </button>
              </div>
              {order.deposit?.amount > 0 && (
                <div className="rounded-2xl bg-amber-400/10 p-4 text-sm text-muted leading-relaxed">
                  هنأكد الطلب بعد مراجعة تحويل العربون <strong className="text-amber-400">{formatPrice(order.deposit.amount)}</strong>، والباقي <strong className="text-ink">{formatPrice(order.total - order.deposit.amount)}</strong> عند الاستلام.
                </div>
              )}
              {order.payment?.fawryCode && (
                <div className="rounded-2xl bg-amber-400/10 p-4 space-y-1">
                  <span className="text-xs text-amber-400 font-bold">كود فوري للدفع (كود الخدمة 788)</span>
                  <div className="text-3xl font-black font-mono text-amber-400 tracking-wider" dir="ltr">{order.payment.fawryCode}</div>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                <Link to={`/track?order=${order.number}`} onClick={onClose} className="btn-ink !rounded-full">
                  <Truck size={16} /> تتبع شحنتك
                </Link>
                <button onClick={onClose} className="btn-outline !rounded-full">كمّل تسوق</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid lg:grid-cols-[1fr_360px]">
            {/* الخطوات */}
            <div className="flex flex-col min-h-0">
              {/* ملخص الموبايل */}
              <button onClick={() => setShowSummary(!showSummary)} className="lg:hidden flex items-center justify-between px-5 py-3 bg-deep text-sm cursor-pointer">
                <span className="flex items-center gap-2 font-bold text-ink-2">ملخص الطلب ({pieces}) <ChevronDown size={15} className={`transition ${showSummary ? "rotate-180" : ""}`} /></span>
                <span className="font-black text-ink">{formatPrice(totals.total)}</span>
              </button>
              {showSummary && <div className="lg:hidden px-5 py-5 bg-deep border-b border-ink/[0.07] animate-page">{summary}</div>}

              <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-7">
                {/* 1) التوصيل */}
                {step === 0 && (
                  <form id="checkout-step" onSubmit={next} className="space-y-6 animate-page">
                    <div>
                      <h4 className="text-xl font-light text-ink">بيانات <strong className="font-black">التوصيل</strong></h4>
                      <p className="text-[13px] text-muted mt-1">هنستخدمها علشان المندوب يوصلك من غير لف.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="الاسم بالكامل *" icon={User} className="sm:col-span-2">
                        <input required autoFocus value={form.fullName} onChange={set("fullName")} placeholder="مثال: أحمد محمد علي" className={fieldCls} />
                      </Field>
                      <Field label="رقم الموبايل *" icon={Phone} hint="11 رقم — هنكلمك عليه نأكد الطلب">
                        <input required type="tel" inputMode="numeric" pattern="01[0-9]{9}" title="رقم موبايل مصري 11 رقم يبدأ بـ 01" value={form.phone1} onChange={set("phone1")} placeholder="01XXXXXXXXX" className={fieldCls} dir="ltr" />
                      </Field>
                      <Field label="رقم إضافي / واتساب" icon={Phone}>
                        <input type="tel" inputMode="numeric" value={form.phone2} onChange={set("phone2")} placeholder="اختياري" className={fieldCls} dir="ltr" />
                      </Field>
                      <Field label="المحافظة *" icon={MapPin} hint={totals.shipping ? `الشحن ${formatPrice(totals.shipping)}${zone.days ? ` • ${zone.days} يوم` : ""}` : "الشحن مجاني لطلبك 🎉"}>
                        <select value={form.governorate} onChange={set("governorate")} className={`${fieldCls} cursor-pointer`}>
                          {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </Field>
                      <Field label="المدينة / الحي *" icon={Home}>
                        <input required value={form.city} onChange={set("city")} placeholder="مدينة نصر / المعادي" className={fieldCls} />
                      </Field>
                      <Field label="الشارع *" className="sm:col-span-2">
                        <input required value={form.street} onChange={set("street")} placeholder="اسم الشارع" className={fieldCls} />
                      </Field>
                      <Field label="رقم العقار *">
                        <input required value={form.building} onChange={set("building")} placeholder="رقم العمارة" className={fieldCls} />
                      </Field>
                      <Field label="الدور والشقة *">
                        <input required value={form.apartment} onChange={set("apartment")} placeholder="الدور 3 - شقة 5" className={fieldCls} />
                      </Field>
                      <Field label="علامة مميزة" className="sm:col-span-2">
                        <input value={form.landmark} onChange={set("landmark")} placeholder="بجوار مسجد / خلف صيدلية..." className={fieldCls} />
                      </Field>
                    </div>
                    <div className="space-y-2">
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-ink-2"><Clock size={13} className="text-brand" /> الموعد المناسب للاستلام</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {TIMES.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setForm({ ...form, preferredTime: t })}
                            className={`px-3 py-3 rounded-xl border text-[12px] font-bold transition cursor-pointer ${form.preferredTime === t ? "border-brand bg-brand/5 text-ink" : "border-ink/[0.07] bg-deep text-muted hover:border-ink/15"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label="ملاحظات للمندوب">
                      <textarea rows="2" value={form.notes} onChange={set("notes")} placeholder="اختياري" className={fieldCls} />
                    </Field>
                  </form>
                )}

                {/* 2) الدفع */}
                {step === 1 && (
                  <form id="checkout-step" onSubmit={next} className="space-y-6 animate-page">
                    <div>
                      <h4 className="text-xl font-light text-ink">طريقة <strong className="font-black">الدفع</strong></h4>
                      <p className="text-[13px] text-muted mt-1">اختار اللي يريحك — كل الطرق آمنة.</p>
                    </div>
                    <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {methods.map((m) => {
                        const { icon: I, title, desc } = METHODS[m];
                        const on = method === m;
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={on}
                            key={m}
                            onClick={() => setMethod(m)}
                            className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 text-right transition-all duration-300 cursor-pointer ${on ? "border-brand bg-brand/[0.04] shadow-lg shadow-brand/5" : "border-ink/[0.07] bg-deep hover:border-ink/15"}`}
                          >
                            <span className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition ${on ? "bg-brand text-white" : "bg-card text-ink-2"}`}>
                              <I size={20} strokeWidth={1.8} />
                            </span>
                            <span className="flex-1 min-w-0 pt-0.5">
                              <span className="block text-sm font-black text-ink">{title}</span>
                              <span className="block text-[12px] text-muted leading-relaxed mt-0.5">{desc}</span>
                            </span>
                            <span className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition ${on ? "border-brand bg-brand" : "border-ink/20"}`}>
                              {on && <Check size={11} strokeWidth={3} className="text-white" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div key={method} className="animate-page">
                      {method === "cod" && totals.deposit === 0 && (
                        <div className="flex gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-muted leading-relaxed">
                          <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                          <span>مش هتدفع أي حاجة دلوقتي. افتح الشحنة وعاين المنتج قدام المندوب، وبعدين ادفع <strong className="text-ink">{formatPrice(totals.total)}</strong>.</span>
                        </div>
                      )}
                      {method === "cod" && totals.deposit > 0 && (
                        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] p-5 space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="w-10 h-10 shrink-0 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center"><HandCoins size={19} /></span>
                            <div>
                              <div className="text-sm font-black text-ink">عربون {formatPrice(totals.deposit)} لتأكيد الطلب</div>
                              <p className="text-[12px] text-muted leading-relaxed mt-1">{settings.deposit?.note}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {settings.walletNumber && <CopyRow label="فودافون كاش / محفظة" value={settings.walletNumber} />}
                            {settings.instapayAddress && <CopyRow label="إنستا باي" value={settings.instapayAddress} />}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="الرقم اللي حوّلت منه *"><input required type="tel" value={form.depositPhone} onChange={set("depositPhone")} placeholder="01XXXXXXXXX" className={fieldCls} dir="ltr" /></Field>
                            <Field label="رقم العملية (لو موجود)"><input value={form.depositRef} onChange={set("depositRef")} className={`${fieldCls} font-mono`} dir="ltr" /></Field>
                          </div>
                        </div>
                      )}
                      {method === "wallet" && (
                        <div className="rounded-2xl border border-ink/[0.07] bg-deep p-5 space-y-4">
                          <p className="text-sm text-muted">حوّل <strong className="text-ink">{formatPrice(totals.total)}</strong> على واحد من دول، واكتب الرقم اللي حوّلت منه:</p>
                          <div className="space-y-2">
                            {settings.walletNumber && <CopyRow label="فودافون كاش / محفظة" value={settings.walletNumber} />}
                            {settings.instapayAddress && <CopyRow label="إنستا باي" value={settings.instapayAddress} />}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="الرقم اللي حوّلت منه *"><input required type="tel" value={form.walletPhone} onChange={set("walletPhone")} placeholder="01XXXXXXXXX" className={fieldCls} dir="ltr" /></Field>
                            <Field label="رقم العملية (لو موجود)"><input value={form.walletRef} onChange={set("walletRef")} className={`${fieldCls} font-mono`} dir="ltr" /></Field>
                          </div>
                        </div>
                      )}
                      {method === "fawry" && (
                        <div className="flex gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm text-muted leading-relaxed">
                          <Receipt size={18} className="text-amber-400 shrink-0" />
                          <span>بعد التأكيد هيظهرلك كود فوري. ادفع بيه من أي منفذ فوري خلال 72 ساعة (كود الخدمة 788).</span>
                        </div>
                      )}
                      {method === "card" && (
                        <div className="flex gap-3 rounded-2xl bg-ink/[0.04] p-4 text-sm text-muted leading-relaxed">
                          <Lock size={18} className="text-emerald-500 shrink-0" />
                          <span>هنبعتلك رابط دفع آمن من بوابة الدفع على موبايلك. مش بنطلب بيانات البطاقة على الموقع.</span>
                        </div>
                      )}
                    </div>
                  </form>
                )}

                {/* 3) المراجعة */}
                {step === 2 && (
                  <div className="space-y-5 animate-page">
                    <div>
                      <h4 className="text-xl font-light text-ink">راجع <strong className="font-black">طلبك</strong></h4>
                      <p className="text-[13px] text-muted mt-1">اتأكد إن كل حاجة مظبوطة قبل التأكيد.</p>
                    </div>
                    <div className="card-inset p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-sm font-black text-ink"><MapPin size={15} className="text-brand" /> التوصيل</span>
                        <button onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-[12px] font-bold text-brand cursor-pointer"><Pencil size={12} /> تعديل</button>
                      </div>
                      <div className="text-sm text-ink-2 leading-loose">
                        <div className="font-bold text-ink">{form.fullName} — <span dir="ltr">{form.phone1}</span></div>
                        <div>{form.governorate} - {form.city} - {form.street} - عقار {form.building} - {form.apartment}</div>
                        {form.landmark && <div className="text-muted">{form.landmark}</div>}
                        <div className="text-muted">{form.preferredTime}</div>
                      </div>
                    </div>
                    <div className="card-inset p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-sm font-black text-ink"><Wallet size={15} className="text-brand" /> الدفع</span>
                        <button onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-[12px] font-bold text-brand cursor-pointer"><Pencil size={12} /> تعديل</button>
                      </div>
                      <div className="text-sm text-ink-2">
                        <span className="font-bold text-ink">{METHODS[method].title}</span>
                        {totals.deposit > 0 && method === "cod" && <span className="text-muted"> — عربون {formatPrice(totals.deposit)} من <span dir="ltr">{form.depositPhone}</span></span>}
                        {method === "wallet" && <span className="text-muted"> — من <span dir="ltr">{form.walletPhone}</span></span>}
                      </div>
                    </div>
                    <p className="text-[12px] text-faint leading-relaxed">بالضغط على "تأكيد الطلب" إنت موافق على سياسة الاستبدال والاسترجاع خلال 14 يوم.</p>
                  </div>
                )}
              </div>

              {/* الأزرار */}
              <div className="px-5 sm:px-8 py-4 border-t border-ink/[0.07] flex items-center gap-3 bg-card">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="btn-outline !rounded-full !px-5">
                    <ArrowRight size={15} /> رجوع
                  </button>
                )}
                {step < 2 ? (
                  <button type="submit" form="checkout-step" className="btn-ink !rounded-full flex-1">
                    {step === 0 ? "كمّل للدفع" : "راجع الطلب"} <ArrowLeft size={15} />
                  </button>
                ) : (
                  <button onClick={confirm} className="btn-brand !rounded-full flex-1 !py-4">
                    <Lock size={15} /> تأكيد الطلب • {formatPrice(totals.total)}
                  </button>
                )}
              </div>
            </div>

            {/* الملخص — ديسكتوب */}
            <aside className="hidden lg:block bg-deep border-r border-ink/[0.07] p-6 overflow-y-auto">
              <h4 className="text-sm font-black text-ink mb-5">ملخص الطلب</h4>
              {summary}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
