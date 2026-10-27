// مكونات لوحة التحكم المشتركة: كروت، حقول، نافذة، ومحرر قوائم عام
import { useRef, useState } from "react";
import { X, Plus, Trash2, ChevronUp, ChevronDown, Upload, ImageOff } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { ICON_NAMES, Icon } from "../lib/icons";
import { nextId } from "../lib/format";

export const inputCls =
  "w-full bg-base/60 border border-ink/10 rounded-2xl px-3.5 py-3 text-xs text-ink placeholder-fainter hover:border-ink/20 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition";

export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ title, action, children, className = "" }) {
  return (
    <section className={`bg-card border border-ink/10 rounded-[1.75rem] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-shadow duration-500 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-ink/10">
          <h2 className="text-sm font-black text-ink flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-brand to-brand-2" />
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "btn-shine bg-gradient-to-l from-brand to-brand-dark text-white border-transparent shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5",
    ghost: "bg-ink/5 hover:bg-ink/10 text-ink-2 border-ink/10",
    danger: "bg-transparent hover:bg-brand/10 text-brand border-brand/30",
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}
    />
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-[11px] font-bold text-muted">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-fainter">{hint}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-xs font-bold text-ink-3 cursor-pointer"
    >
      <span className={`relative w-9 h-5 rounded-full transition ${checked ? "bg-brand" : "bg-ink/10"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? "right-0.5" : "right-[18px]"}`} />
      </span>
      {label}
    </button>
  );
}

export function Modal({ title, onClose, children, footer, wide = false }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={onClose}>
      <div
        className={`bg-card border border-ink/10 rounded-[2rem] w-full ${wide ? "max-w-4xl" : "max-w-xl"} max-h-[92vh] flex flex-col shadow-2xl animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h3 className="text-sm font-black text-ink">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ink/5 cursor-pointer" aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-ink/10 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// حقل صورة: رابط أو رفع من الجهاز (الصور المرفوعة بتتخزن في المتصفح فخليها صغيرة)
export function ImageInput({ value, onChange }) {
  const fileRef = useRef(null);
  const { showToast } = useStore();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 400 * 1024) {
      showToast("حجم الصورة أكبر من 400KB — استخدم رابط صورة بدلاً منها", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex gap-3 items-start">
      <div className="w-16 h-16 rounded-xl bg-deep border border-ink/10 overflow-hidden shrink-0 flex items-center justify-center text-fainter">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImageOff size={18} />}
      </div>
      <div className="flex-1 space-y-2">
        <input value={value?.startsWith("data:") ? "(صورة مرفوعة)" : value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className={inputCls} dir="ltr" />
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted hover:text-ink cursor-pointer">
          <Upload size={13} /> رفع من الجهاز
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
}

export function IconSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
        <Icon name={value} size={18} />
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} dir="ltr">
        {ICON_NAMES.map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}

// حقل حسب النوع (يستخدم في ListEditor ونماذج الإعدادات)
export function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case "textarea":
      return <textarea rows={field.rows || 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
    case "number":
      return <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} dir="ltr" />;
    case "image":
      return <ImageInput value={value} onChange={onChange} />;
    case "icon":
      return <IconSelect value={value} onChange={onChange} />;
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" value={value || "#E50914"} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent cursor-pointer" />
          <input value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputCls} dir="ltr" />
        </div>
      );
    case "select":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "toggle":
      return <Toggle checked={!!value} onChange={onChange} label={value ? "مفعّل" : "متوقف"} />;
    case "password":
      return <input type="password" autoComplete="off" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputCls} dir="ltr" />;
    case "datetime":
      return <input type="datetime-local" value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputCls} dir="ltr" />;
    default:
      return <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputCls} dir={field.ltr ? "ltr" : undefined} />;
  }
}

// محرر قائمة عام: إضافة/حذف/ترتيب/تعديل عناصر (سلايدر، شركاء، جوائز...)
// fields: [{ key, label, type, full }]
export function ListEditor({ items, onChange, fields, newItem, itemTitle = (i) => i.title || i.name || i.label }) {
  const [open, setOpen] = useState(null);

  const update = (id, key, val) => onChange(items.map((it) => (it.id === id ? { ...it, [key]: val } : it)));
  const remove = (id) => {
    if (window.confirm("حذف العنصر ده؟")) onChange(items.filter((it) => it.id !== id));
  };
  const move = (idx, dir) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };
  const add = () => {
    const item = { ...newItem, id: nextId(items) };
    onChange([...items, item]);
    setOpen(item.id);
  };

  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div key={it.id} className="border border-ink/10 rounded-xl bg-deep/60">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setOpen(open === it.id ? null : it.id)} className="flex-1 flex items-center gap-3 text-right cursor-pointer min-w-0">
              {it.image && <img src={it.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />}
              {it.icon && !it.image && (
                <span className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Icon name={it.icon} size={16} />
                </span>
              )}
              {it.color && !it.image && <span className="w-5 h-5 rounded-md border border-ink/20 shrink-0" style={{ background: it.color }} />}
              <span className="text-xs font-bold text-ink-2 truncate">{itemTitle(it) || "عنصر جديد"}</span>
            </button>
            <button onClick={() => move(idx, -1)} className="p-1.5 text-faint hover:text-ink cursor-pointer" aria-label="لأعلى"><ChevronUp size={15} /></button>
            <button onClick={() => move(idx, 1)} className="p-1.5 text-faint hover:text-ink cursor-pointer" aria-label="لأسفل"><ChevronDown size={15} /></button>
            <button onClick={() => remove(it.id)} className="p-1.5 text-faint hover:text-brand cursor-pointer" aria-label="حذف"><Trash2 size={15} /></button>
          </div>
          {open === it.id && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border-t border-ink/10">
              {fields.map((f) => (
                <Field key={f.key} label={f.label} className={f.full || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
                  <FieldInput field={f} value={it[f.key]} onChange={(v) => update(it.id, f.key, v)} />
                </Field>
              ))}
            </div>
          )}
        </div>
      ))}
      <Button variant="ghost" onClick={add} className="w-full border-dashed">
        <Plus size={14} /> إضافة عنصر
      </Button>
    </div>
  );
}

export function StatusBadge({ status, list }) {
  const s = list.find((x) => x.id === status) || list[0];
  return <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-lg border ${s.className}`}>{s.label}</span>;
}

// تبويبات أفقية (الإعدادات، العروض، الشحن)
export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
      {tabs.map((t) => {
        const I = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition cursor-pointer ${
              value === t.id ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" : "bg-card border-ink/10 text-muted hover:text-ink"
            }`}
          >
            {I && <I size={14} />} {t.label}
          </button>
        );
      })}
    </div>
  );
}

// شبكة حقول مربوطة بكائن (value/onChange) — بتختصر نماذج الإعدادات
export function FieldsGrid({ fields, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => (
        <Field key={f.key} label={f.label} hint={f.hint} className={f.full || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
          <FieldInput field={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
        </Field>
      ))}
    </div>
  );
}
