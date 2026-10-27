import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { Icon } from "../lib/icons";
import { Button, Card, Field, IconSelect, Modal, PageTitle, inputCls } from "./ui";

function CategoryForm({ initial, onClose }) {
  const { db, setCollection, showToast } = useStore();
  const isNew = !initial.id;
  const [c, setC] = useState({ id: "", name: "", icon: "Box", order: db.categories.length + 1, subcategories: [], ...initial });
  const [subs, setSubs] = useState((initial.subcategories || []).join("\n"));

  const save = () => {
    const id = (c.id || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!c.name.trim() || !id) return showToast("الاسم والمعرّف مطلوبين", "error");
    if (isNew && db.categories.some((x) => x.id === id)) return showToast("المعرّف مستخدم في قسم تاني", "error");
    const saved = { ...c, id, order: Number(c.order) || 0, subcategories: subs.split("\n").map((s) => s.trim()).filter(Boolean) };
    setCollection("categories", isNew ? [...db.categories, saved] : db.categories.map((x) => (x.id === initial.id ? saved : x)));
    showToast("تم حفظ القسم");
    onClose();
  };

  return (
    <Modal
      title={isNew ? "قسم جديد" : `تعديل: ${initial.name}`}
      onClose={onClose}
      footer={<><Button variant="ghost" onClick={onClose}>إلغاء</Button><Button onClick={save}>حفظ</Button></>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="اسم القسم *"><input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className={inputCls} /></Field>
          <Field label="المعرّف في الرابط *" hint="حروف إنجليزي صغيرة، مثال: kitchen">
            <input value={c.id} disabled={!isNew} onChange={(e) => setC({ ...c, id: e.target.value })} className={`${inputCls} disabled:opacity-50`} dir="ltr" />
          </Field>
          <Field label="الأيقونة"><IconSelect value={c.icon} onChange={(v) => setC({ ...c, icon: v })} /></Field>
          <Field label="الترتيب"><input type="number" value={c.order} onChange={(e) => setC({ ...c, order: e.target.value })} className={inputCls} dir="ltr" /></Field>
        </div>
        <Field label="الأقسام الفرعية" hint="كل قسم فرعي في سطر — بتظهر في قائمة الهيدر وفلاتر صفحة القسم">
          <textarea rows="7" value={subs} onChange={(e) => setSubs(e.target.value)} className={inputCls} />
        </Field>
      </div>
    </Modal>
  );
}

export default function CategoriesAdmin() {
  const { db, setCollection, showToast } = useStore();
  const [editing, setEditing] = useState(null);
  const cats = [...db.categories].sort((a, b) => a.order - b.order);
  const countOf = (id) => db.products.filter((p) => p.categoryId === id).length;

  const remove = (c) => {
    const n = countOf(c.id);
    if (n) return showToast(`القسم فيه ${n} منتج — انقلهم لقسم تاني الأول`, "error");
    if (!window.confirm(`حذف قسم "${c.name}"؟`)) return;
    setCollection("categories", db.categories.filter((x) => x.id !== c.id));
    showToast("تم حذف القسم");
  };

  return (
    <div>
      <PageTitle
        title="الأقسام"
        subtitle="الأقسام الرئيسية والفرعية اللي بتظهر في الهيدر، صفحة الرئيسية، وفلاتر المتجر"
        action={<Button onClick={() => setEditing({})}><Plus size={15} /> قسم جديد</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cats.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
                <Icon name={c.icon} size={19} />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-ink">{c.name}</h3>
                <p className="text-[11px] text-faint font-mono" dir="ltr">/category/{c.id}</p>
              </div>
              <button onClick={() => setEditing(c)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" title="تعديل"><Pencil size={15} /></button>
              <button onClick={() => remove(c)} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 cursor-pointer" title="حذف"><Trash2 size={15} /></button>
            </div>
            <div className="flex gap-4 text-[11px] text-muted mb-3">
              <span><strong className="text-ink">{countOf(c.id)}</strong> منتج</span>
              <span><strong className="text-ink">{c.subcategories.length}</strong> قسم فرعي</span>
              <span>ترتيب <strong className="text-ink">{c.order}</strong></span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.subcategories.map((s) => (
                <span key={s} className="text-[10px] px-2 py-1 rounded-lg bg-ink/5 border border-ink/10 text-ink-3">{s}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {editing && <CategoryForm initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
