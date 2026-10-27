import { useState } from "react";
import { Plus, Pencil, Trash2, Copy, CalendarDays, TicketPercent, Sparkles, Timer, Search, Check } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { isOfferActive } from "../lib/offers";
import { formatPrice, WEEKDAYS } from "../lib/format";
import { Button, Card, Field, FieldInput, FieldsGrid, ListEditor, Modal, PageTitle, Tabs, Toggle, inputCls } from "./ui";

const KINDS = [
  { value: "daily", label: "كل يوم" },
  { value: "weekly", label: "أيام محددة كل أسبوع" },
  { value: "range", label: "من تاريخ لتاريخ" },
];

const EMPTY = {
  title: "", subtitle: "", kind: "weekly", weekdays: [5], startDate: "", endDate: "", productIds: [],
  discountPercent: 10, badge: "عرض اليوم", showOnHome: true, active: true,
};

const whenText = (o) =>
  o.kind === "daily" ? "كل يوم" : o.kind === "weekly" ? `كل ${o.weekdays.map((d) => WEEKDAYS[d]).join(" و ") || "—"}` : `${o.startDate || "…"} ← ${o.endDate || "…"}`;

function OfferForm({ initial, onClose }) {
  const { db, saveItem, showToast } = useStore();
  const [o, setO] = useState({ ...EMPTY, ...initial });
  const [q, setQ] = useState("");
  const set = (k, v) => setO((prev) => ({ ...prev, [k]: v }));
  const toggleDay = (d) => set("weekdays", o.weekdays.includes(d) ? o.weekdays.filter((x) => x !== d) : [...o.weekdays, d].sort());
  const toggleProduct = (id) => set("productIds", o.productIds.includes(id) ? o.productIds.filter((x) => x !== id) : [...o.productIds, id]);
  const list = db.products.filter((p) => !q || p.name.includes(q) || String(p.id) === q);

  const save = () => {
    if (!o.title.trim()) return showToast("اسم العرض مطلوب", "error");
    if (!o.productIds.length) return showToast("اختار منتج واحد على الأقل", "error");
    if (o.kind === "weekly" && !o.weekdays.length) return showToast("اختار يوم واحد على الأقل", "error");
    saveItem("offers", { ...o, discountPercent: Number(o.discountPercent) || 0 });
    showToast("تم حفظ العرض");
    onClose();
  };

  return (
    <Modal wide title={initial.id ? `تعديل: ${initial.title}` : "عرض جديد"} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>إلغاء</Button><Button onClick={save}>حفظ العرض</Button></>}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FieldsGrid
            value={o}
            onChange={setO}
            fields={[
              { key: "title", label: "اسم العرض *", placeholder: "مثال: سبت المطبخ" },
              { key: "badge", label: "الشارة على المنتج", placeholder: "عرض اليوم" },
              { key: "subtitle", label: "وصف قصير", full: true },
              { key: "discountPercent", label: "خصم إضافي % (0 = السعر زي ما هو)", type: "number" },
              { key: "kind", label: "مواعيد العرض", type: "select", options: KINDS },
            ]}
          />
          {o.kind === "weekly" && (
            <Field label="الأيام">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {WEEKDAYS.map((name, d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`py-2 rounded-lg border text-[11px] font-bold cursor-pointer ${o.weekdays.includes(d) ? "bg-brand border-brand text-white" : "bg-deep border-ink/10 text-muted"}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </Field>
          )}
          {o.kind === "range" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="من"><input type="date" value={o.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputCls} dir="ltr" /></Field>
              <Field label="إلى"><input type="date" value={o.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputCls} dir="ltr" /></Field>
            </div>
          )}
          <div className="flex flex-wrap gap-5">
            <Toggle checked={o.showOnHome} onChange={(v) => set("showOnHome", v)} label="يظهر في الرئيسية" />
            <Toggle checked={o.active} onChange={(v) => set("active", v)} label={o.active ? "مفعّل" : "متوقف"} />
          </div>
          <p className="text-[11px] text-faint leading-relaxed">العرض بيبدأ الساعة 12 بالليل وبيخلص آخر اليوم. لو المنتج في أكتر من عرض في نفس اليوم بياخد أكبر خصم. عشان يظهر في صفحة "عروض الجمعة" اختار يوم الجمعة.</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted">المنتجات ({o.productIds.length})</span>
            {o.productIds.length > 0 && <button onClick={() => set("productIds", [])} className="text-[11px] text-brand font-bold cursor-pointer">إلغاء الكل</button>}
          </div>
          <div className="relative">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن منتج" className={`${inputCls} pr-9`} />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1 border border-ink/10 rounded-xl p-1.5">
            {list.map((p) => {
              const on = o.productIds.includes(p.id);
              const pct = Number(o.discountPercent) || 0;
              return (
                <button key={p.id} type="button" onClick={() => toggleProduct(p.id)} className={`w-full flex items-center gap-3 p-2 rounded-lg text-right cursor-pointer ${on ? "bg-brand/10" : "hover:bg-ink/5"}`}>
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? "bg-brand border-brand text-white" : "border-ink/20"}`}>{on && <Check size={12} />}</span>
                  <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <span className="flex-1 text-xs text-ink-2 line-clamp-1">{p.name}</span>
                  <span className="text-[10px] text-muted whitespace-nowrap">
                    {pct ? <><span className="line-through">{formatPrice(p.price)}</span> <span className="text-brand font-bold">{formatPrice(Math.round(p.price * (1 - pct / 100)))}</span></> : formatPrice(p.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Schedule() {
  const { db, saveItem, removeItem, showToast } = useStore();
  const [editing, setEditing] = useState(null);
  const today = new Date().getDay();

  const week = WEEKDAYS.map((name, d) => {
    const date = new Date();
    date.setDate(date.getDate() + ((d - today + 7) % 7));
    return { name, d, offers: db.offers.filter((o) => isOfferActive(o, date)) };
  });

  return (
    <div className="space-y-4">
      <Card title="شكل الأسبوع" action={<Button onClick={() => setEditing({})}><Plus size={15} /> عرض جديد</Button>}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {week.map((w) => (
            <div key={w.d} className={`rounded-xl border p-3 min-h-28 ${w.d === today ? "border-brand bg-brand/5" : "border-ink/10 bg-deep/60"}`}>
              <div className={`text-xs font-black mb-2 ${w.d === today ? "text-brand" : "text-ink"}`}>{w.name}{w.d === today && " (النهارده)"}</div>
              <div className="space-y-1">
                {w.offers.map((o) => (
                  <button key={o.id} onClick={() => setEditing(o)} className="block w-full text-right text-[10px] font-bold px-2 py-1 rounded-md bg-ink/5 hover:bg-ink/10 text-ink-3 truncate cursor-pointer">
                    {o.title}{o.discountPercent > 0 && ` -${o.discountPercent}%`}
                  </button>
                ))}
                {!w.offers.length && <span className="text-[10px] text-fainter">مفيش عروض</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {db.offers.map((o) => {
          const live = isOfferActive(o);
          return (
            <Card key={o.id} className={o.active ? "" : "opacity-60"}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-ink">{o.title}</h3>
                    {live && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">شغال دلوقتي</span>}
                    {o.discountPercent > 0 && <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/30">-{o.discountPercent}%</span>}
                  </div>
                  <p className="text-[11px] text-muted">{whenText(o)} • {o.productIds.length} منتج{o.showOnHome && " • في الرئيسية"}</p>
                  {o.subtitle && <p className="text-[11px] text-faint line-clamp-1">{o.subtitle}</p>}
                </div>
                <Toggle checked={o.active} onChange={(v) => saveItem("offers", { ...o, active: v })} />
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-ink/10">
                <div className="flex -space-x-2 space-x-reverse flex-1">
                  {db.products.filter((p) => o.productIds.includes(p.id)).slice(0, 6).map((p) => <img key={p.id} src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover border-2 border-card" />)}
                </div>
                <button onClick={() => setEditing(o)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" title="تعديل"><Pencil size={15} /></button>
                <button
                  onClick={() => {
                    // eslint-disable-next-line no-unused-vars
                    const { id, ...rest } = o;
                    saveItem("offers", { ...rest, title: `${o.title} (نسخة)`, active: false });
                    showToast("تم نسخ العرض (متوقف)");
                  }}
                  className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer"
                  title="نسخ"
                >
                  <Copy size={15} />
                </button>
                <button onClick={() => window.confirm(`حذف "${o.title}"؟`) && removeItem("offers", o.id)} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 cursor-pointer" title="حذف"><Trash2 size={15} /></button>
              </div>
            </Card>
          );
        })}
      </div>
      {editing && <OfferForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default function OffersAdmin() {
  const { db, setCollection, updateSettings } = useStore();
  const s = db.settings;
  const [tab, setTab] = useState("schedule");

  return (
    <div>
      <PageTitle title="العروض" subtitle="عروض كل يوم، عروض الجمعة، الكوبونات، وعجلة الحظ" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "schedule", label: "جدول العروض", icon: CalendarDays },
          { id: "coupons", label: "كوبونات الخصم", icon: TicketPercent },
          { id: "wheel", label: "عجلة الحظ", icon: Sparkles },
          { id: "timer", label: "عداد الخصومات", icon: Timer },
        ]}
      />

      {tab === "schedule" && <Schedule />}

      {tab === "coupons" && (
        <Card title="كوبونات الخصم" action={<span className="text-[11px] text-faint">العميل بيكتب الكود في خطوة إتمام الطلب</span>}>
          <ListEditor
            items={db.coupons}
            onChange={(v) => setCollection("coupons", v)}
            itemTitle={(c) => `${c.code} — ${c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? `${c.value} ج.م` : "شحن مجاني"}${c.active ? "" : " (متوقف)"}`}
            newItem={{ code: "NEWCODE", type: "percent", value: 10, active: true }}
            fields={[
              { key: "code", label: "الكود", ltr: true },
              { key: "type", label: "النوع", type: "select", options: [{ value: "percent", label: "نسبة مئوية %" }, { value: "fixed", label: "مبلغ ثابت ج.م" }, { value: "shipping", label: "شحن مجاني" }] },
              { key: "value", label: "القيمة", type: "number" },
              { key: "active", label: "الحالة", type: "toggle" },
            ]}
          />
        </Card>
      )}

      {tab === "wheel" && (
        <Card title="جوائز عجلة الحظ (صفحة عروض الجمعة)" action={<Toggle checked={s.luckyWheelEnabled} onChange={(v) => updateSettings({ luckyWheelEnabled: v })} label={s.luckyWheelEnabled ? "العجلة ظاهرة" : "العجلة مخفية"} />}>
          <p className="text-[11px] text-faint mb-3">سيب الكود فاضي للجائزة اللي معناها "حظ أوفر". لو الكود خصم، ضيفه في الكوبونات كمان علشان يشتغل في السلة.</p>
          <ListEditor
            items={db.wheelPrizes}
            onChange={(v) => setCollection("wheelPrizes", v)}
            newItem={{ label: "جائزة جديدة", code: "", color: "#E50914" }}
            fields={[
              { key: "label", label: "اسم الجائزة" },
              { key: "code", label: "الكود", ltr: true },
              { key: "color", label: "لون الشريحة", type: "color" },
            ]}
          />
        </Card>
      )}

      {tab === "timer" && (
        <Card title="عداد ركن الخصومات">
          <Field label="تاريخ ووقت الانتهاء" hint="فاضي = العداد بيخلص آخر اليوم ويتجدد يومياً">
            <FieldInput field={{ type: "datetime" }} value={s.discountsEndAt} onChange={(v) => updateSettings({ discountsEndAt: v })} />
          </Field>
        </Card>
      )}
    </div>
  );
}
