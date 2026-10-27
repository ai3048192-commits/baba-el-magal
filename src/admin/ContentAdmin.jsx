import { useState } from "react";
import { useStore } from "../store/StoreContext";
import { Card, Field, FieldInput, ListEditor, PageTitle } from "./ui";

const TABS = [
  { id: "hero", label: "سلايدر الرئيسية" },
  { id: "banner", label: "البانر الترويجي" },
  { id: "partners", label: "شريط الشركاء" },
  { id: "features", label: "مميزات المتجر" },
  { id: "about", label: "صفحة من نحن" },
];

// نموذج لتعديل كائن (بانر / من نحن) حقل بحقل
function ObjectForm({ value, fields, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => (
        <Field key={f.key} label={f.label} className={f.full || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
          <FieldInput field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
        </Field>
      ))}
    </div>
  );
}

export default function ContentAdmin() {
  const { db, setCollection } = useStore();
  const [tab, setTab] = useState("hero");
  const setAbout = (patch) => setCollection("about", { ...db.about, ...patch });

  return (
    <div>
      <PageTitle title="محتوى الصفحات" subtitle="كل تعديل بيتحفظ فوراً ويظهر في الموقع" />

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap cursor-pointer ${tab === t.id ? "bg-brand border-brand text-white" : "bg-card border-ink/10 text-muted hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <Card title="شرائح السلايدر في أول الصفحة الرئيسية">
          <ListEditor
            items={db.heroSlides}
            onChange={(v) => setCollection("heroSlides", v)}
            newItem={{ image: "", subtitle: "", title: "عنوان جديد", highlight: "في بابا المجال", description: "" }}
            fields={[
              { key: "subtitle", label: "النص الصغير فوق العنوان" },
              { key: "title", label: "العنوان" },
              { key: "highlight", label: "الجزء الملون من العنوان" },
              { key: "description", label: "الوصف", type: "textarea" },
              { key: "image", label: "الصورة", type: "image" },
            ]}
          />
        </Card>
      )}

      {tab === "banner" && (
        <Card title="البانر الترويجي في الصفحة الرئيسية">
          <ObjectForm
            value={db.promoBanner}
            onChange={(v) => setCollection("promoBanner", v)}
            fields={[
              { key: "label", label: "الشارة الصغيرة", full: true },
              { key: "titleStart", label: "بداية العنوان" },
              { key: "highlight", label: "الجزء الملون (مثال: 50%)" },
              { key: "titleEnd", label: "نهاية العنوان", full: true },
              { key: "text", label: "الوصف", type: "textarea" },
              { key: "buttonText", label: "نص الزر" },
              { key: "link", label: "رابط الزر", placeholder: "/friday-offers", ltr: true },
              { key: "imageBadge", label: "شارة الصورة", full: true },
              { key: "image", label: "الصورة", type: "image" },
            ]}
          />
        </Card>
      )}

      {tab === "partners" && (
        <Card title="صور شريط الشركاء المتحرك">
          <ListEditor
            items={db.partners}
            onChange={(v) => setCollection("partners", v)}
            newItem={{ name: "", image: "" }}
            fields={[
              { key: "name", label: "الاسم", full: true },
              { key: "image", label: "الصورة", type: "image" },
            ]}
          />
        </Card>
      )}

      {tab === "features" && (
        <Card title="مميزات المتجر (تظهر في الفوتر)">
          <ListEditor
            items={db.storeFeatures}
            onChange={(v) => setCollection("storeFeatures", v)}
            newItem={{ icon: "Truck", title: "", text: "" }}
            fields={[
              { key: "title", label: "العنوان" },
              { key: "text", label: "الوصف" },
              { key: "icon", label: "الأيقونة", type: "icon" },
            ]}
          />
        </Card>
      )}

      {tab === "about" && (
        <div className="space-y-4">
          <Card title="النصوص الرئيسية">
            <ObjectForm
              value={db.about}
              onChange={(v) => setCollection("about", v)}
              fields={[
                { key: "badge", label: "الشارة أعلى الصفحة", full: true },
                { key: "title", label: "العنوان" },
                { key: "highlight", label: "الجزء الملون" },
                { key: "intro", label: "المقدمة", type: "textarea" },
                { key: "storyTitle", label: "عنوان القصة", full: true },
                { key: "story1", label: "القصة - فقرة 1", type: "textarea" },
                { key: "story2", label: "القصة - فقرة 2", type: "textarea" },
              ]}
            />
          </Card>
          <Card title="الإحصائيات">
            <ListEditor
              items={db.about.stats}
              onChange={(v) => setAbout({ stats: v })}
              newItem={{ icon: "Users", title: "", text: "" }}
              fields={[
                { key: "title", label: "الرقم (مثال: +50 ألف)" },
                { key: "text", label: "الوصف" },
                { key: "icon", label: "الأيقونة", type: "icon" },
              ]}
            />
          </Card>
          <Card title="الركائز">
            <ListEditor
              items={db.about.pillars}
              onChange={(v) => setAbout({ pillars: v })}
              newItem={{ title: "", text: "" }}
              fields={[
                { key: "title", label: "العنوان", full: true },
                { key: "text", label: "الوصف", type: "textarea" },
              ]}
            />
          </Card>
          <Card title="لماذا نحن">
            <ListEditor
              items={db.about.features}
              onChange={(v) => setAbout({ features: v })}
              newItem={{ icon: "Gem", title: "", text: "" }}
              fields={[
                { key: "title", label: "العنوان" },
                { key: "icon", label: "الأيقونة", type: "icon" },
                { key: "text", label: "الوصف", type: "textarea" },
              ]}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
