import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Copy, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatPrice, SECTIONS, discountPercent } from "../lib/format";
import { Button, Card, Field, ImageInput, Modal, PageTitle, Toggle, inputCls } from "./ui";

const EMPTY = {
  name: "",
  description: "",
  price: 0,
  oldPrice: 0,
  rating: 4.5,
  reviewsCount: 0,
  categoryId: "",
  subcategory: "",
  image: "",
  images: [],
  badge: "",
  tag: "",
  stock: 10,
  totalStock: 0,
  features: [],
  specs: [],
  colors: [],
  sections: ["catalog"],
  active: true,
};

// تحويل القوائم لنص سطر بسطر للتعديل، والعكس
const toLines = (arr) => arr.join("\n");
const fromLines = (txt) => txt.split("\n").map((s) => s.trim()).filter(Boolean);
const specsToText = (specs) => specs.map((s) => `${s.label}: ${s.value}`).join("\n");
const textToSpecs = (txt) =>
  fromLines(txt).map((l) => {
    const i = l.indexOf(":");
    return i === -1 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
  });
const colorsToText = (colors) => colors.map((c) => `${c.name} | ${c.code}`).join("\n");
const textToColors = (txt) =>
  fromLines(txt).map((l) => {
    const [name, code] = l.split("|").map((s) => s.trim());
    return { name, code: code || "#111111" };
  });

function ProductForm({ initial, onClose }) {
  const { db, saveItem, showToast } = useStore();
  const [p, setP] = useState({ ...EMPTY, categoryId: db.categories[0]?.id || "", ...initial });
  const [text, setText] = useState({
    images: toLines(p.images || []),
    features: toLines(p.features || []),
    specs: specsToText(p.specs || []),
    colors: colorsToText(p.colors || []),
  });
  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }));
  const category = db.categories.find((c) => c.id === p.categoryId);

  const toggleSection = (id) =>
    set("sections", p.sections.includes(id) ? p.sections.filter((s) => s !== id) : [...p.sections, id]);

  const save = () => {
    if (!p.name.trim() || !p.image || !p.price) {
      showToast("الاسم والصورة والسعر مطلوبين", "error");
      return;
    }
    saveItem("products", {
      ...p,
      price: Number(p.price),
      oldPrice: Number(p.oldPrice) || 0,
      stock: Number(p.stock) || 0,
      images: fromLines(text.images),
      features: fromLines(text.features),
      specs: textToSpecs(text.specs),
      colors: textToColors(text.colors),
    });
    showToast(initial?.id ? "تم حفظ التعديلات" : "تمت إضافة المنتج");
    onClose();
  };

  return (
    <Modal
      wide
      title={initial?.id ? `تعديل: ${initial.name}` : "منتج جديد"}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button onClick={save}>حفظ المنتج</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Field label="اسم المنتج *"><input value={p.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
          <Field label="الوصف"><textarea rows="3" value={p.description} onChange={(e) => set("description", e.target.value)} className={inputCls} /></Field>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="السعر الحالي *"><input type="number" value={p.price} onChange={(e) => set("price", e.target.value)} className={inputCls} dir="ltr" /></Field>
            <Field label="السعر قبل الخصم"><input type="number" value={p.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} className={inputCls} dir="ltr" /></Field>
            <Field label="المخزون"><input type="number" value={p.stock} onChange={(e) => set("stock", e.target.value)} className={inputCls} dir="ltr" /></Field>
            <Field label="إجمالي الكمية" hint="لشريط (تم بيع)"><input type="number" value={p.totalStock} onChange={(e) => set("totalStock", Number(e.target.value))} className={inputCls} dir="ltr" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="القسم الرئيسي">
              <select value={p.categoryId} onChange={(e) => setP({ ...p, categoryId: e.target.value, subcategory: "" })} className={inputCls}>
                {db.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="القسم الفرعي">
              <select value={p.subcategory} onChange={(e) => set("subcategory", e.target.value)} className={inputCls}>
                <option value="">— بدون —</option>
                {category?.subcategories.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="الشارة (مثال: الأكثر طلباً)"><input value={p.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls} /></Field>
            <Field label="وسم صغير (مثال: VIP)"><input value={p.tag} onChange={(e) => set("tag", e.target.value)} className={inputCls} /></Field>
            <Field label="التقييم (من 5)"><input type="number" step="0.1" min="0" max="5" value={p.rating} onChange={(e) => set("rating", Number(e.target.value))} className={inputCls} dir="ltr" /></Field>
            <Field label="عدد التقييمات"><input type="number" value={p.reviewsCount} onChange={(e) => set("reviewsCount", Number(e.target.value))} className={inputCls} dir="ltr" /></Field>
          </div>
          <Field label="المميزات" hint="كل ميزة في سطر"><textarea rows="3" value={text.features} onChange={(e) => setText({ ...text, features: e.target.value })} className={inputCls} /></Field>
          <Field label="المواصفات الفنية" hint="كل سطر بالشكل: الاسم: القيمة"><textarea rows="3" value={text.specs} onChange={(e) => setText({ ...text, specs: e.target.value })} className={inputCls} /></Field>
          <Field label="الألوان المتاحة" hint="كل سطر بالشكل: اسم اللون | #كود"><textarea rows="2" value={text.colors} onChange={(e) => setText({ ...text, colors: e.target.value })} className={inputCls} /></Field>
        </div>

        <div className="space-y-4">
          <Field label="الصورة الرئيسية *"><ImageInput value={p.image} onChange={(v) => set("image", v)} /></Field>
          <Field label="صور إضافية" hint="رابط في كل سطر"><textarea rows="3" value={text.images} onChange={(e) => setText({ ...text, images: e.target.value })} className={inputCls} dir="ltr" /></Field>
          <div className="space-y-2 bg-deep border border-ink/10 rounded-xl p-4">
            <span className="text-[11px] font-bold text-muted block">يظهر في</span>
            {SECTIONS.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-xs text-ink-3 cursor-pointer">
                <input type="checkbox" checked={p.sections.includes(s.id)} onChange={() => toggleSection(s.id)} className="accent-brand" />
                {s.label}
              </label>
            ))}
          </div>
          <Toggle checked={p.active} onChange={(v) => set("active", v)} label={p.active ? "ظاهر في الموقع" : "مخفي من الموقع"} />
        </div>
      </div>
    </Modal>
  );
}

export default function ProductsAdmin() {
  const { db, saveItem, removeItem, showToast } = useStore();
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [section, setSection] = useState("all");

  const list = useMemo(
    () =>
      db.products.filter(
        (p) =>
          (cat === "all" || p.categoryId === cat) &&
          (section === "all" || p.sections.includes(section)) &&
          (!q || p.name.includes(q) || String(p.id) === q),
      ),
    [db.products, q, cat, section],
  );

  const catName = (id) => db.categories.find((c) => c.id === id)?.name || "—";

  const remove = (p) => {
    if (!window.confirm(`حذف "${p.name}" نهائياً؟`)) return;
    removeItem("products", p.id);
    showToast("تم حذف المنتج");
  };

  const duplicate = (p) => {
    // eslint-disable-next-line no-unused-vars
    const { id, ...rest } = p;
    saveItem("products", { ...rest, name: `${p.name} (نسخة)`, active: false });
    showToast("تم إنشاء نسخة مخفية من المنتج");
  };

  return (
    <div>
      <PageTitle
        title="المنتجات"
        subtitle={`${db.products.length} منتج — تحكم في الأسعار، المخزون، والأماكن اللي يظهر فيها كل منتج`}
        action={<Button onClick={() => setEditing({})}><Plus size={15} /> منتج جديد</Button>}
      />

      <Card>
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم أو رقم المنتج" className={`${inputCls} pr-9`} />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${inputCls} md:w-48`}>
            <option value="all">كل الأقسام</option>
            {db.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)} className={`${inputCls} md:w-52`}>
            <option value="all">كل أماكن الظهور</option>
            {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-xs min-w-[760px]">
            <thead className="text-faint">
              <tr className="border-b border-ink/10">
                <th className="text-right px-5 pb-3 font-bold">المنتج</th>
                <th className="text-right pb-3 font-bold">القسم</th>
                <th className="text-right pb-3 font-bold">السعر</th>
                <th className="text-right pb-3 font-bold">المخزون</th>
                <th className="text-right pb-3 font-bold">يظهر في</th>
                <th className="text-left px-5 pb-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {list.map((p) => (
                <tr key={p.id} className={p.active ? "" : "opacity-50"}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-ink-1 line-clamp-1 max-w-[260px]">{p.name}</div>
                        <div className="text-[10px] text-faint">#{p.id}{p.badge && ` • ${p.badge}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{catName(p.categoryId)}</td>
                  <td>
                    <div className="font-bold text-ink">{formatPrice(p.price)}</div>
                    {discountPercent(p) > 0 && <div className="text-[10px] text-emerald-400">خصم {discountPercent(p)}%</div>}
                  </td>
                  <td>
                    <span className={`font-bold ${p.stock === 0 ? "text-brand" : p.stock <= 5 ? "text-amber-400" : "text-ink-3"}`}>{p.stock}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {p.sections.map((s) => (
                        <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink/5 border border-ink/10 text-muted">
                          {SECTIONS.find((x) => x.id === s)?.label.split(" (")[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => saveItem("products", { ...p, active: !p.active })} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" title={p.active ? "إخفاء" : "إظهار"}>
                        {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <Link to={`/product/${p.id}`} target="_blank" className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5" title="عرض في الموقع"><ExternalLink size={15} /></Link>
                      <button onClick={() => duplicate(p)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" title="نسخ"><Copy size={15} /></button>
                      <button onClick={() => setEditing(p)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" title="تعديل"><Pencil size={15} /></button>
                      <button onClick={() => remove(p)} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 cursor-pointer" title="حذف"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <p className="text-center text-xs text-faint py-10">لا توجد منتجات مطابقة.</p>}
        </div>
      </Card>

      {editing && <ProductForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
