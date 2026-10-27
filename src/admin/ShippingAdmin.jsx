import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Truck, MapPinned, PackageSearch, Plug, HandCoins, ExternalLink } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatDateTime, formatPrice, GOVERNORATES, ORDER_STATUSES } from "../lib/format";
import { Button, Card, Field, FieldsGrid, FieldInput, ListEditor, Modal, PageTitle, StatusBadge, Tabs, Toggle } from "./ui";

const PROVIDERS = [
  { value: "manual", label: "يدوي (مندوب / شركة من غير API)" },
  { value: "bosta", label: "Bosta" },
  { value: "aramex", label: "Aramex" },
  { value: "mylerz", label: "Mylerz" },
  { value: "jt", label: "J&T Express" },
  { value: "r2s", label: "R2S" },
  { value: "custom", label: "API خاص" },
];

const EMPTY = {
  name: "", provider: "manual", logo: "", phone: "", trackingUrl: "", estimatedDays: "2-4", codSupported: true, active: true,
  api: { enabled: false, baseUrl: "", apiKey: "", apiSecret: "", accountId: "", pickupLocationId: "" },
};

function CompanyForm({ initial, onClose }) {
  const { saveItem, showToast } = useStore();
  const [c, setC] = useState({ ...EMPTY, ...initial, api: { ...EMPTY.api, ...initial.api } });

  const save = () => {
    if (!c.name.trim()) return showToast("اسم الشركة مطلوب", "error");
    saveItem("shippingCompanies", c);
    showToast("تم حفظ شركة الشحن");
    onClose();
  };

  return (
    <Modal wide title={initial.id ? `تعديل: ${initial.name}` : "شركة شحن جديدة"} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>إلغاء</Button><Button onClick={save}>حفظ</Button></>}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-ink flex items-center gap-2"><Truck size={15} className="text-brand" /> بيانات الشركة</h4>
          <FieldsGrid
            value={c}
            onChange={setC}
            fields={[
              { key: "name", label: "اسم الشركة *" },
              { key: "provider", label: "نوع الربط", type: "select", options: PROVIDERS },
              { key: "phone", label: "رقم التواصل", ltr: true },
              { key: "estimatedDays", label: "مدة التوصيل (أيام)", placeholder: "2-4" },
              { key: "trackingUrl", label: "رابط التتبع عند الشركة", hint: "استخدم {tracking} مكان رقم البوليصة", ltr: true, full: true },
              { key: "logo", label: "لوجو الشركة", type: "image" },
            ]}
          />
          <div className="flex flex-wrap gap-5">
            <Toggle checked={c.codSupported} onChange={(v) => setC({ ...c, codSupported: v })} label="بتدعم التحصيل عند الاستلام" />
            <Toggle checked={c.active} onChange={(v) => setC({ ...c, active: v })} label={c.active ? "مفعّلة" : "متوقفة"} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-ink flex items-center gap-2"><Plug size={15} className="text-brand" /> ربط الـ API</h4>
            <Toggle checked={c.api.enabled} onChange={(v) => setC({ ...c, api: { ...c.api, enabled: v } })} label={c.api.enabled ? "مفعّل" : "متوقف"} />
          </div>
          <FieldsGrid
            value={c.api}
            onChange={(v) => setC({ ...c, api: v })}
            fields={[
              { key: "baseUrl", label: "API Base URL", ltr: true, full: true },
              { key: "apiKey", label: "API Key", type: "password", full: true },
              { key: "apiSecret", label: "API Secret (لو موجود)", type: "password", full: true },
              { key: "accountId", label: "رقم الحساب / Account ID", ltr: true },
              { key: "pickupLocationId", label: "رقم مكان الاستلام (Pickup)", ltr: true },
            ]}
          />
          <div className="text-[11px] text-muted leading-relaxed bg-deep border border-ink/10 rounded-xl p-3 space-y-1">
            <p>• إنشاء البوليصة بيتم من صفحة الطلب ← "إنشاء شحنة API"، عن طريق Edge Function اسمها <span className="font-mono text-ink-2">create-shipment</span>.</p>
            <p>• رابط الـ Webhook اللي تديه للشركة عشان تحدّث الحالة تلقائي:</p>
            <p className="font-mono text-ink-2 break-all" dir="ltr">https://YOUR-PROJECT.supabase.co/functions/v1/shipping-webhook?company={c.id || "ID"}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Companies() {
  const { db, removeItem, updateSettings, showToast } = useStore();
  const [editing, setEditing] = useState(null);
  const usage = (id) => db.orders.filter((o) => o.shippingCompanyId === id).length;

  return (
    <>
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({})}><Plus size={15} /> شركة جديدة</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {db.shippingCompanies.map((c) => (
          <Card key={c.id} className={c.active ? "" : "opacity-60"}>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-12 h-12 rounded-xl bg-ink/5 border border-ink/10 flex items-center justify-center overflow-hidden shrink-0">
                {c.logo ? <img src={c.logo} alt="" className="w-full h-full object-contain" /> : <Truck size={20} className="text-brand" />}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-ink">{c.name}</h3>
                <p className="text-[11px] text-faint">{PROVIDERS.find((p) => p.value === c.provider)?.label}</p>
              </div>
              <button onClick={() => setEditing(c)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" aria-label="تعديل"><Pencil size={15} /></button>
              <button
                onClick={() => {
                  if (usage(c.id)) return showToast("الشركة مربوطة بطلبات — وقفها بدل ما تحذفها", "error");
                  if (window.confirm(`حذف ${c.name}؟`)) removeItem("shippingCompanies", c.id);
                }}
                className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 cursor-pointer"
                aria-label="حذف"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold mb-4">
              <span className="px-2 py-1 rounded-lg bg-ink/5 border border-ink/10 text-ink-3">{c.estimatedDays} يوم</span>
              {c.codSupported && <span className="px-2 py-1 rounded-lg bg-ink/5 border border-ink/10 text-ink-3">تحصيل عند الاستلام</span>}
              <span className={`px-2 py-1 rounded-lg border ${c.api?.enabled ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-ink/5 border-ink/10 text-faint"}`}>
                API {c.api?.enabled ? "متصل" : "غير مفعّل"}
              </span>
              <span className="px-2 py-1 rounded-lg bg-ink/5 border border-ink/10 text-ink-3">{usage(c.id)} شحنة</span>
            </div>
            <label className="flex items-center gap-2 text-xs text-ink-3 cursor-pointer">
              <input type="radio" name="defaultCompany" checked={db.settings.defaultShippingCompanyId === c.id} onChange={() => updateSettings({ defaultShippingCompanyId: c.id })} className="accent-brand" />
              الشركة الافتراضية للطلبات الجديدة
            </label>
          </Card>
        ))}
      </div>
      {editing && <CompanyForm initial={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function Zones() {
  const { db, setCollection, updateSettings } = useStore();
  const s = db.settings;
  const missing = GOVERNORATES.filter((g) => !db.shippingZones.some((z) => z.governorate === g));
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card title="الإعدادات العامة للشحن">
        <div className="space-y-4">
          <Field label="سعر الشحن الافتراضي (للمحافظات اللي مش في الجدول)">
            <FieldInput field={{ type: "number" }} value={s.shippingFee} onChange={(v) => updateSettings({ shippingFee: v })} />
          </Field>
          <Field label="شحن مجاني للطلبات فوق (ج.م)" hint="0 = مفيش شحن مجاني">
            <FieldInput field={{ type: "number" }} value={s.freeShippingOver} onChange={(v) => updateSettings({ freeShippingOver: v })} />
          </Field>
        </div>
      </Card>
      <Card title={`أسعار الشحن حسب المحافظة (${db.shippingZones.length})`} className="xl:col-span-2">
        <ListEditor
          items={db.shippingZones}
          onChange={(v) => setCollection("shippingZones", v)}
          itemTitle={(z) => `${z.governorate} — ${formatPrice(z.fee)} • ${z.days || "?"} يوم`}
          newItem={{ governorate: missing[0] || "القاهرة", fee: s.shippingFee, days: "2-3" }}
          fields={[
            { key: "governorate", label: "المحافظة", type: "select", options: GOVERNORATES.map((g) => ({ value: g, label: g })) },
            { key: "fee", label: "سعر الشحن (ج.م)", type: "number" },
            { key: "days", label: "مدة التوصيل (أيام)" },
          ]}
        />
      </Card>
    </div>
  );
}

function Board() {
  const { db } = useStore();
  const active = db.orders.filter((o) => ["confirmed", "processing", "shipped", "out_for_delivery"].includes(o.status));
  const deposits = db.orders.filter((o) => o.deposit?.amount > 0 && !o.deposit.paid && !["cancelled", "returned"].includes(o.status));
  const company = (id) => db.shippingCompanies.find((c) => c.id === id)?.name || "—";

  const Row = ({ o, extra }) => (
    <Link to={`/admin/orders?open=${o.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-deep/60 border border-ink/10 hover:border-brand/40 transition text-xs">
      <div className="flex-1 min-w-0">
        <div className="font-mono font-bold text-ink">{o.number}</div>
        <div className="text-[10px] text-faint">{o.customer.name} • {o.customer.governorate} • {formatDateTime(o.createdAt)}</div>
      </div>
      {extra}
      <ExternalLink size={13} className="text-faint" />
    </Link>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title={`شحنات في الطريق (${active.length})`}>
        <div className="space-y-2">
          {active.map((o) => (
            <Row key={o.id} o={o} extra={<><span className="text-muted">{company(o.shippingCompanyId)}</span><StatusBadge status={o.status} list={ORDER_STATUSES.map((s) => ({ ...s, label: s.short }))} /></>} />
          ))}
          {!active.length && <p className="text-center text-xs text-faint py-8">مفيش شحنات في الطريق.</p>}
        </div>
      </Card>
      <Card title={`عربون في انتظار التأكيد (${deposits.length})`}>
        <div className="space-y-2">
          {deposits.map((o) => (
            <Row key={o.id} o={o} extra={<span className="flex items-center gap-1 text-amber-400 font-bold"><HandCoins size={13} /> {formatPrice(o.deposit.amount)}</span>} />
          ))}
          {!deposits.length && <p className="text-center text-xs text-faint py-8">كل العرابين متأكدة 👌</p>}
        </div>
      </Card>
    </div>
  );
}

export default function ShippingAdmin() {
  const [tab, setTab] = useState("board");
  return (
    <div>
      <PageTitle title="الشحن" subtitle="شركات الشحن وربطها بالـ API، أسعار المحافظات، ومتابعة الشحنات والعرابين" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "board", label: "متابعة الشحنات", icon: PackageSearch },
          { id: "companies", label: "شركات الشحن", icon: Truck },
          { id: "zones", label: "المحافظات والأسعار", icon: MapPinned },
        ]}
      />
      {tab === "board" && <Board />}
      {tab === "companies" && <Companies />}
      {tab === "zones" && <Zones />}
    </div>
  );
}
