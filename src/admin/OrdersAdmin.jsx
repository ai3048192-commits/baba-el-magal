import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Eye, Trash2, Phone, MapPin, Printer, MessageCircle, Truck, HandCoins, CloudDownload, Send, Clock, Plug } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatDateTime, formatPrice, ORDER_STATUSES, PAYMENT_METHODS } from "../lib/format";
import { callFunction, getConfig, getSession, remoteListOrders } from "../lib/supabase";
import { Button, Card, Field, Modal, PageTitle, StatusBadge, Toggle, inputCls } from "./ui";

const SHORT = ORDER_STATUSES.map((s) => ({ ...s, label: s.short }));

function OrderDetails({ order, onClose }) {
  const { db, updateOrder, showToast } = useStore();
  const c = order.customer;
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const company = db.shippingCompanies.find((x) => x.id === order.shippingCompanyId);
  const trackLink = `${window.location.origin}/track?order=${order.number}`;
  const waText = `أهلاً ${c.name} 👋\nطلبك رقم ${order.number} حالته: ${ORDER_STATUSES.find((s) => s.id === order.status)?.label}.\nتابع شحنتك من هنا: ${trackLink}`;
  const deposit = order.deposit || {};

  const saveUpdate = () => {
    updateOrder(order, { status, trackingNumber: tracking.trim() }, note.trim());
    setNote("");
    showToast("تم تحديث الطلب وتسجيله في سجل التتبع");
  };

  const createShipment = async () => {
    const cfg = getConfig(db.settings);
    const session = getSession();
    if (!company?.api?.enabled) return showToast("فعّل الـ API لشركة الشحن دي الأول (صفحة الشحن)", "error");
    if (!cfg || !session) return showToast("محتاج تربط Supabase وتسجل دخول (الإعدادات ← الربط)", "error");
    try {
      const r = await callFunction(cfg, "create-shipment", { orderNumber: order.number, companyId: company.id }, session.token);
      updateOrder(order, { status: "shipped", trackingNumber: r.trackingNumber || tracking }, `تم إنشاء بوليصة ${company.name}`);
      setTracking(r.trackingNumber || tracking);
      showToast(`تم إنشاء الشحنة: ${r.trackingNumber}`);
    } catch (e) {
      showToast(`فشل إنشاء الشحنة: ${e.message}`, "error");
    }
  };

  return (
    <Modal wide title={`الطلب ${order.number}`} onClose={onClose} footer={<Button variant="ghost" onClick={() => window.print()}><Printer size={14} /> طباعة</Button>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-deep border border-ink/10">
                {i.image && <img src={i.image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink-1 line-clamp-1">{i.name}</div>
                  <div className="text-faint">{formatPrice(i.price)} × {i.qty}{i.color && ` • ${i.color}`}</div>
                </div>
                <span className="font-bold text-ink">{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-deep border border-ink/10 space-y-1.5 text-muted">
            <div className="flex justify-between"><span>المجموع</span><span className="text-ink">{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span>خصم ({order.coupon})</span><span className="text-emerald-400">- {formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span>الشحن</span><span className="text-ink">{order.shipping ? formatPrice(order.shipping) : "مجاني"}</span></div>
            <div className="flex justify-between pt-2 border-t border-ink/10 text-sm"><span className="font-black text-ink">الإجمالي</span><span className="font-black text-brand">{formatPrice(order.total)}</span></div>
            {deposit.amount > 0 && <div className="flex justify-between"><span>المطلوب تحصيله عند الاستلام</span><span className="text-ink font-bold">{formatPrice(order.total - (deposit.paid ? deposit.amount : 0))}</span></div>}
          </div>

          <div className="p-4 rounded-xl border border-brand/30 bg-brand/5 space-y-3">
            <h4 className="font-black text-ink flex items-center gap-2"><Truck size={15} className="text-brand" /> تحديث الشحنة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="الحالة">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                  {ORDER_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="شركة الشحن">
                <select value={order.shippingCompanyId || ""} onChange={(e) => updateOrder(order, { shippingCompanyId: Number(e.target.value) || null })} className={inputCls}>
                  <option value="">— اختار —</option>
                  {db.shippingCompanies.filter((x) => x.active || x.id === order.shippingCompanyId).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </Field>
              <Field label="رقم البوليصة"><input value={tracking} onChange={(e) => setTracking(e.target.value)} className={inputCls} dir="ltr" /></Field>
            </div>
            <Field label="ملاحظة تظهر للعميل في صفحة التتبع (اختياري)">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: الشحنة وصلت مخزن طنطا" className={inputCls} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveUpdate}><Send size={14} /> حفظ التحديث</Button>
              {company?.api?.enabled && <Button variant="ghost" onClick={createShipment}><Plug size={14} /> إنشاء شحنة API ({company.name})</Button>}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-deep border border-ink/10">
            <h4 className="font-black text-ink mb-3 flex items-center gap-2"><Clock size={15} className="text-brand" /> سجل التتبع</h4>
            <ol className="space-y-2.5">
              {[...(order.history || [])].reverse().map((h, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${i === 0 ? "bg-brand" : "bg-slate-600"}`} />
                  <div>
                    <div className="text-ink-2 font-bold">{ORDER_STATUSES.find((s) => s.id === h.status)?.label}{h.note && <span className="font-normal text-muted"> — {h.note}</span>}</div>
                    <div className="text-[10px] text-faint">{formatDateTime(h.at)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-deep border border-ink/10 space-y-2.5">
            <div className="font-black text-ink text-sm">{c.name}</div>
            <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-ink-3 hover:text-ink"><Phone size={13} className="text-brand" /> {c.phone}{c.phone2 && ` / ${c.phone2}`}</a>
            <a href={`https://wa.me/2${c.phone}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 font-bold">
              <MessageCircle size={13} /> ابعت له رابط التتبع واتساب
            </a>
            <div className="flex items-start gap-2 text-ink-3"><MapPin size={13} className="text-brand mt-0.5 shrink-0" /> {c.governorate} - {c.city} - {c.address}{c.landmark && ` (${c.landmark})`}</div>
            <div className="text-faint">الموعد المفضل: {c.preferredTime}</div>
            {c.notes && <div className="text-amber-400">ملاحظات: {c.notes}</div>}
          </div>

          <div className="p-4 rounded-xl bg-deep border border-ink/10 space-y-1.5 text-muted">
            <div>الدفع: <span className="text-ink font-bold">{PAYMENT_METHODS[order.paymentMethod]}</span></div>
            {order.payment?.walletPhone && <div>محفظة: <span className="text-ink font-mono">{order.payment.walletPhone}</span>{order.payment.ref && ` • عملية ${order.payment.ref}`}</div>}
            {order.payment?.fawryCode && <div>كود فوري: <span className="text-amber-400 font-mono">{order.payment.fawryCode}</span></div>}
            <div>التاريخ: {formatDateTime(order.createdAt)}</div>
            {order.remote && <div className="text-emerald-400">✓ محفوظ في Supabase</div>}
          </div>

          {deposit.amount > 0 && (
            <div className={`p-4 rounded-xl border space-y-3 ${deposit.paid ? "bg-emerald-400/5 border-emerald-400/30" : "bg-amber-400/5 border-amber-400/30"}`}>
              <div className="flex items-center gap-2 font-black text-ink"><HandCoins size={15} className="text-amber-400" /> العربون: {formatPrice(deposit.amount)}</div>
              {deposit.phone && <div className="text-muted">محوّل من: <span className="font-mono text-ink">{deposit.phone}</span>{deposit.ref && ` • ${deposit.ref}`}</div>}
              <Toggle
                checked={!!deposit.paid}
                onChange={(v) => {
                  updateOrder(order, { deposit: { ...deposit, paid: v }, ...(v && order.status === "new" ? { status: "confirmed" } : {}) }, v ? "تم استلام العربون وتأكيد الطلب" : "");
                  showToast(v ? "تم تأكيد استلام العربون" : "تم إلغاء تأكيد العربون");
                }}
                label={deposit.paid ? "تم استلام العربون ✓" : "لسه ما وصلش"}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function OrdersAdmin() {
  const { db, updateOrder, removeItem, mergeRemoteOrders, showToast } = useStore();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [syncing, setSyncing] = useState(false);
  const viewId = params.get("open");
  const viewing = db.orders.find((o) => String(o.id) === viewId);
  const cfg = getConfig(db.settings);

  const list = useMemo(
    () =>
      db.orders.filter(
        (o) =>
          (status === "all" || o.status === status) &&
          (!q || o.number.includes(q.toUpperCase()) || o.customer.name.includes(q) || o.customer.phone.includes(q) || (o.trackingNumber || "").includes(q)),
      ),
    [db.orders, status, q],
  );

  const sync = async () => {
    const session = getSession();
    if (!session) return showToast("سجل دخول Supabase من الإعدادات ← الربط", "error");
    setSyncing(true);
    try {
      const remote = await remoteListOrders(cfg, session.token);
      mergeRemoteOrders(remote);
      showToast(`تم تحميل ${remote.length} طلب من Supabase`);
    } catch (e) {
      showToast(`فشل التحميل: ${e.message}`, "error");
    }
    setSyncing(false);
  };

  const remove = (o) => {
    if (!window.confirm(`حذف الطلب ${o.number} من الجهاز ده؟`)) return;
    removeItem("orders", o.id);
    showToast("تم حذف الطلب");
  };

  const open = (id) => setParams(id ? { open: String(id) } : {});

  return (
    <div>
      <PageTitle
        title="الطلبات"
        subtitle="غيّر الحالة، حدد شركة الشحن ورقم البوليصة، وأكد العربون — كل تحديث بيظهر للعميل في صفحة التتبع."
        action={cfg && <Button variant="ghost" onClick={sync} disabled={syncing}><CloudDownload size={15} className={syncing ? "animate-pulse" : ""} /> تحميل من Supabase</Button>}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {[{ id: "all", short: "الكل" }, ...ORDER_STATUSES].map((s) => {
          const n = s.id === "all" ? db.orders.length : db.orders.filter((o) => o.status === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${status === s.id ? "bg-brand border-brand text-white" : "bg-card border-ink/10 text-muted hover:text-ink"}`}
            >
              {s.short} <span className="opacity-70">({n})</span>
            </button>
          );
        })}
      </div>

      <Card>
        <div className="relative mb-5">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث برقم الطلب، اسم العميل، الموبايل، أو رقم البوليصة" className={`${inputCls} pr-9`} />
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-xs min-w-[860px]">
            <thead className="text-faint">
              <tr className="border-b border-ink/10">
                <th className="text-right px-5 pb-3 font-bold">الطلب</th>
                <th className="text-right pb-3 font-bold">العميل</th>
                <th className="text-right pb-3 font-bold">الشحن</th>
                <th className="text-right pb-3 font-bold">الدفع</th>
                <th className="text-right pb-3 font-bold">الحالة</th>
                <th className="text-right pb-3 font-bold">الإجمالي</th>
                <th className="px-5 pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-ink/[0.02]">
                  <td className="px-5 py-3">
                    <button onClick={() => open(o.id)} className="font-mono font-bold text-ink hover:text-brand cursor-pointer">{o.number}</button>
                    <div className="text-[10px] text-faint">{formatDateTime(o.createdAt)}</div>
                  </td>
                  <td>
                    <div className="text-ink-2 font-bold">{o.customer.name}</div>
                    <div className="text-[10px] text-faint">{o.customer.phone} • {o.customer.governorate}</div>
                  </td>
                  <td>
                    <div className="text-ink-3">{db.shippingCompanies.find((c) => c.id === o.shippingCompanyId)?.name || "—"}</div>
                    {o.trackingNumber && <div className="text-[10px] text-faint font-mono">{o.trackingNumber}</div>}
                  </td>
                  <td>
                    <div className="text-muted">{PAYMENT_METHODS[o.paymentMethod]}</div>
                    {o.deposit?.amount > 0 && (
                      <div className={`text-[10px] font-bold ${o.deposit.paid ? "text-emerald-400" : "text-amber-400"}`}>عربون {formatPrice(o.deposit.amount)} {o.deposit.paid ? "✓" : "⏳"}</div>
                    )}
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrder(o, { status: e.target.value })}
                      className="bg-deep border border-ink/10 rounded-lg px-2 py-1.5 text-[11px] font-bold text-ink outline-none focus:border-brand cursor-pointer"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.short}</option>)}
                    </select>
                  </td>
                  <td className="font-bold text-ink">{formatPrice(o.total)}</td>
                  <td className="px-5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => open(o.id)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" title="التفاصيل"><Eye size={15} /></button>
                      <button onClick={() => remove(o)} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 cursor-pointer" title="حذف"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <p className="text-center text-xs text-faint py-10">لا توجد طلبات {status !== "all" && <>بحالة <StatusBadge status={status} list={SHORT} /></>}</p>}
        </div>
      </Card>

      {viewing && <OrderDetails key={`${viewing.id}-${viewing.status}`} order={viewing} onClose={() => open(null)} />}
    </div>
  );
}
