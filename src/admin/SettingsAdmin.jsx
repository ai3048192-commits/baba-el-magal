import { useRef, useState } from "react";
import {
  Download, Upload, RotateCcw, KeyRound, Store, Palette, LayoutTemplate, Search, Phone, Wallet, Plug, ShieldCheck,
  ChevronUp, ChevronDown, Eye, EyeOff, CheckCircle2, XCircle, RefreshCw, LogIn, LogOut, CloudUpload,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import { HOME_SECTION_LABELS, PAYMENT_METHODS } from "../lib/format";
import { FONTS, PRESETS } from "../lib/theme";
import { callFunction, getConfig, getSession, pushAllToSupabase, signIn, signOut, testConnection } from "../lib/supabase";
import { Button, Card, Field, FieldsGrid, FieldInput, PageTitle, Tabs, Toggle, inputCls } from "./ui";
import ThemeToggle from "../components/layout/ThemeToggle";

const TABS = [
  { id: "general", label: "الهوية واللوجو", icon: Store },
  { id: "appearance", label: "الألوان والخطوط", icon: Palette },
  { id: "layout", label: "التخطيط", icon: LayoutTemplate },
  { id: "seo", label: "SEO", icon: Search },
  { id: "contact", label: "التواصل", icon: Phone },
  { id: "payment", label: "الدفع والعربون", icon: Wallet },
  { id: "integrations", label: "الربط و API", icon: Plug },
  { id: "security", label: "الأمان والنسخ", icon: ShieldCheck },
];

export default function SettingsAdmin() {
  const [tab, setTab] = useState("general");
  return (
    <div>
      <PageTitle title="إعدادات الموقع" subtitle="كل حاجة في الموقع من هنا — التعديلات بتتحفظ وتظهر فوراً" />
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === "general" && <General />}
      {tab === "appearance" && <Appearance />}
      {tab === "layout" && <Layout />}
      {tab === "seo" && <Seo />}
      {tab === "contact" && <Contact />}
      {tab === "payment" && <Payment />}
      {tab === "integrations" && <Integrations />}
      {tab === "security" && <Security />}
    </div>
  );
}

// ربط مختصر لجزء من الإعدادات (theme / layout / seo ...)
function useSection(key) {
  const { db, updateSettings } = useStore();
  return [db.settings[key] || {}, (v) => updateSettings({ [key]: v })];
}

function General() {
  const { db, updateSettings } = useStore();
  const s = db.settings;
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="بيانات المتجر">
        <FieldsGrid
          value={s}
          onChange={(v) => updateSettings(v)}
          fields={[
            { key: "storeName", label: "اسم المتجر (يظهر في اللوجو)", ltr: true },
            { key: "storeNameAr", label: "الاسم بالعربي" },
            { key: "tagline", label: "وصف المتجر (الفوتر)", type: "textarea" },
          ]}
        />
      </Card>
      <Card title="اللوجو وأيقونة الموقع">
        <div className="space-y-5">
          <Field label="صورة اللوجو" hint="PNG شفاف بارتفاع 80px تقريباً — سيبها فاضية للوجو الافتراضي">
            <FieldInput field={{ type: "image" }} value={s.logoImage} onChange={(v) => updateSettings({ logoImage: v })} />
          </Field>
          <Field label="أيقونة التاب (Favicon)" hint="صورة مربعة 64×64 أو SVG">
            <FieldInput field={{ type: "image" }} value={s.favicon} onChange={(v) => updateSettings({ favicon: v })} />
          </Field>
        </div>
      </Card>
    </div>
  );
}

function Appearance() {
  const [theme, setTheme] = useSection("theme");
  const colors = [
    ["brand", "اللون الأساسي", "الأزرار، الأسعار، العناوين الملونة"],
    ["brandDark", "لون المرور على الأزرار", "أغمق شوية من الأساسي"],
    ["accent", "لون التدرج", "نهاية التدرج في العناوين"],
  ];
  const surfaces = [
    ["الوضع الغامق 🌙", [["bg", "خلفية الموقع"], ["surface", "خلفية الكروت"], ["surface2", "خلفية الأقسام والحقول"]]],
    ["الوضع الفاتح ☀️", [["lightBg", "خلفية الموقع"], ["lightSurface", "خلفية الكروت"], ["lightSurface2", "خلفية الأقسام والحقول"]]],
  ];
  return (
    <div className="space-y-4">
      <Card title="ثيمات جاهزة">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESETS.map((p) => {
            const active = p.brand.toLowerCase() === theme.brand?.toLowerCase() && p.bg.toLowerCase() === theme.bg?.toLowerCase();
            return (
              <button
                key={p.name}
                onClick={() => {
                  // eslint-disable-next-line no-unused-vars
                  const { name, ...vals } = p;
                  setTheme({ ...theme, ...vals });
                }}
                className={`rounded-2xl border p-3 text-right transition cursor-pointer ${active ? "border-brand ring-2 ring-brand/30" : "border-ink/10 hover:border-ink/25"}`}
                style={{ background: p.bg }}
              >
                <div className="flex gap-1.5 mb-3">
                  {[p.brand, p.accent, p.surface].map((c) => <span key={c} className="w-6 h-6 rounded-lg border border-white/10" style={{ background: c }} />)}
                </div>
                <span className="text-xs font-bold text-white">{p.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="ألوان الهوية (نفسها في الوضعين)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colors.map(([k, label, hint]) => (
              <Field key={k} label={label} hint={hint}>
                <FieldInput field={{ type: "color" }} value={theme[k]} onChange={(v) => setTheme({ ...theme, [k]: v })} />
              </Field>
            ))}
          </div>
        </Card>

        <Card title="خلفيات الوضعين" action={<ThemeToggle />}>
          <div className="space-y-5">
            {surfaces.map(([title, list]) => (
              <div key={title} className="space-y-3">
                <span className="text-xs font-black text-ink-2">{title}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {list.map(([k, label]) => (
                    <Field key={k} label={label}>
                      <FieldInput field={{ type: "color" }} value={theme[k]} onChange={(v) => setTheme({ ...theme, [k]: v })} />
                    </Field>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[11px] text-faint">دوس على زرار الشمس/القمر فوق عشان تشوف الوضع التاني وإنت بتعدّل.</p>
          </div>
        </Card>

        <Card title="الخطوط">
          <div className="space-y-4">
            {[["fontBody", "خط النصوص"], ["fontHeading", "خط العناوين"]].map(([k, label]) => (
              <Field key={k} label={label}>
                <select value={theme[k]} onChange={(e) => setTheme({ ...theme, [k]: e.target.value })} className={inputCls}>
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
            ))}
            <Field label="الوضع الافتراضي للزوار الجدد" hint="الزائر يقدر يبدّل من زرار الشمس/القمر، واختياره بيتحفظ">
              <select value={theme.defaultMode} onChange={(e) => setTheme({ ...theme, defaultMode: e.target.value })} className={inputCls}>
                <option value="dark">غامق 🌙</option>
                <option value="light">فاتح ☀️</option>
                <option value="system">حسب جهاز الزائر</option>
              </select>
            </Field>
            <div className="rounded-2xl border border-ink/10 bg-deep p-5 space-y-2">
              <span className="text-[10px] text-faint">معاينة</span>
              <h3 className="text-2xl font-black text-ink">أدوات منزلية <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-2">تريح بالك</span></h3>
              <p className="text-xs text-muted">اكتشف أحدث الأجهزة الذكية وأدوات التنظيم الفاخرة بجودة عالمية.</p>
              <button className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold">تسوق الآن</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Layout() {
  const [layout, setLayout] = useSection("layout");
  const saved = layout.homeSections || [];
  const sections = [...saved, ...Object.keys(HOME_SECTION_LABELS).filter((id) => !saved.some((x) => x.id === id)).map((id) => ({ id, visible: true }))];
  const move = (i, d) => {
    const next = [...sections];
    if (i + d < 0 || i + d >= next.length) return;
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setLayout({ ...layout, homeSections: next });
  };
  const toggles = [
    ["showTopBar", "الشريط العلوي (رقم خدمة العملاء)"],
    ["stickyHeader", "تثبيت الهيدر فوق عند التمرير"],
    ["showFloatingSocial", "أزرار الواتساب والسوشيال العائمة"],
    ["showNewsletter", "صندوق الاشتراك في الفوتر"],
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="أقسام الصفحة الرئيسية (الترتيب والإظهار)">
        <div className="space-y-2">
          {sections.map((sec, i) => (
            <div key={sec.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border border-ink/10 bg-deep/60 ${sec.visible ? "" : "opacity-50"}`}>
              <span className="w-6 text-center text-[11px] font-black text-faint">{i + 1}</span>
              <span className="flex-1 text-xs font-bold text-ink-2">{HOME_SECTION_LABELS[sec.id] || sec.id}</span>
              <button onClick={() => move(i, -1)} className="p-1.5 text-faint hover:text-ink cursor-pointer" aria-label="لأعلى"><ChevronUp size={15} /></button>
              <button onClick={() => move(i, 1)} className="p-1.5 text-faint hover:text-ink cursor-pointer" aria-label="لأسفل"><ChevronDown size={15} /></button>
              <button
                onClick={() => setLayout({ ...layout, homeSections: sections.map((x) => (x.id === sec.id ? { ...x, visible: !x.visible } : x)) })}
                className="p-1.5 text-muted hover:text-ink cursor-pointer"
                aria-label="إظهار/إخفاء"
              >
                {sec.visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <Card title="العرض والأعمدة">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="عرض الصفحة">
              <select value={layout.containerWidth} onChange={(e) => setLayout({ ...layout, containerWidth: Number(e.target.value) })} className={inputCls}>
                <option value={72}>ضيق (1152px)</option>
                <option value={80}>عادي (1280px)</option>
                <option value={90}>عريض (1440px)</option>
                <option value={110}>كامل (1760px)</option>
              </select>
            </Field>
            <Field label="أعمدة المنتجات">
              <select value={layout.productColumns} onChange={(e) => setLayout({ ...layout, productColumns: Number(e.target.value) })} className={inputCls}>
                {[3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} أعمدة</option>)}
              </select>
            </Field>
            <Field label="أقسام جنب القائمة">
              <select value={layout.navCategoriesCount} onChange={(e) => setLayout({ ...layout, navCategoriesCount: Number(e.target.value) })} className={inputCls}>
                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>
        </Card>
        <Card title="عناصر الموقع">
          <div className="space-y-3">
            {toggles.map(([k, label]) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-deep border border-ink/10">
                <span className="text-xs font-bold text-ink-2">{label}</span>
                <Toggle checked={layout[k] !== false} onChange={(v) => setLayout({ ...layout, [k]: v })} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="وضع الصيانة">
          <div className="space-y-3">
            <Toggle checked={!!layout.maintenanceMode} onChange={(v) => setLayout({ ...layout, maintenanceMode: v })} label={layout.maintenanceMode ? "الموقع مقفول للزوار (إنت شايفه عادي لأنك أدمن)" : "الموقع شغال"} />
            <textarea rows="2" value={layout.maintenanceMessage || ""} onChange={(e) => setLayout({ ...layout, maintenanceMessage: e.target.value })} className={inputCls} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Seo() {
  const [seo, setSeo] = useSection("seo");
  const { db } = useStore();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="محركات البحث والمشاركة">
        <FieldsGrid
          value={seo}
          onChange={setSeo}
          fields={[
            { key: "title", label: `عنوان الموقع (${(seo.title || "").length}/60 حرف)`, full: true },
            { key: "description", label: `الوصف (${(seo.description || "").length}/160 حرف)`, type: "textarea" },
            { key: "keywords", label: "الكلمات المفتاحية (مفصولة بفاصلة)", full: true },
            { key: "ogImage", label: "صورة المشاركة على فيسبوك وواتساب (1200×630)", type: "image" },
          ]}
        />
        <div className="mt-4"><Toggle checked={seo.indexing !== false} onChange={(v) => setSeo({ ...seo, indexing: v })} label={seo.indexing !== false ? "مسموح لجوجل يأرشف الموقع" : "ممنوع الأرشفة (noindex)"} /></div>
      </Card>
      <div className="space-y-4">
        <Card title="معاينة في جوجل">
          <div className="bg-white rounded-xl p-4 space-y-1" dir="rtl">
            <div className="text-[11px] text-[#202124]">{window.location.host}</div>
            <div className="text-[#1a0dab] text-base font-medium line-clamp-1">{seo.title || db.settings.storeNameAr}</div>
            <div className="text-[#4d5156] text-xs line-clamp-2">{seo.description}</div>
          </div>
        </Card>
        <Card title="أدوات التحليل والتتبع">
          <FieldsGrid
            value={seo}
            onChange={setSeo}
            fields={[
              { key: "googleAnalyticsId", label: "Google Analytics (G-XXXX)", ltr: true },
              { key: "facebookPixelId", label: "Facebook Pixel ID", ltr: true },
            ]}
          />
        </Card>
        <Card title="CSS مخصص (للمتقدمين)">
          <textarea rows="5" value={seo.customCss || ""} onChange={(e) => setSeo({ ...seo, customCss: e.target.value })} placeholder=".my-class { color: red; }" className={`${inputCls} font-mono`} dir="ltr" />
        </Card>
      </div>
    </div>
  );
}

function Contact() {
  const { db, updateSettings } = useStore();
  const s = db.settings;
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="أرقام وعناوين التواصل">
        <FieldsGrid
          value={s}
          onChange={updateSettings}
          fields={[
            { key: "phone", label: "رقم خدمة العملاء", ltr: true },
            { key: "phoneLabel", label: "نص الرقم في الفوتر" },
            { key: "email", label: "البريد الإلكتروني", ltr: true },
            { key: "address", label: "العنوان" },
            { key: "whatsappNumber", label: "رقم الواتساب بكود الدولة", placeholder: "201000000000", ltr: true },
            { key: "walletNumber", label: "رقم المحفظة (فودافون كاش)", ltr: true },
            { key: "instapayAddress", label: "عنوان إنستا باي", ltr: true },
            { key: "whatsappMessage", label: "رسالة الواتساب الافتراضية", type: "textarea" },
          ]}
        />
      </Card>
      <div className="space-y-4">
        <Card title="الشريط العلوي والتنبيهات">
          <FieldsGrid
            value={s}
            onChange={updateSettings}
            fields={[
              { key: "topBarText", label: "نص الشريط العلوي", full: true },
              { key: "notificationTitle", label: "عنوان التنبيه", full: true },
              { key: "notificationText", label: "نص التنبيه (الجرس)", type: "textarea" },
            ]}
          />
        </Card>
        <Card title="السوشيال ميديا">
          <FieldsGrid
            value={s.social}
            onChange={(v) => updateSettings({ social: v })}
            fields={[
              { key: "facebook", label: "فيسبوك", ltr: true },
              { key: "instagram", label: "انستجرام", ltr: true },
              { key: "telegram", label: "تيليجرام", ltr: true },
              { key: "tiktok", label: "تيك توك", ltr: true },
            ]}
          />
          <p className="text-[11px] text-faint mt-3">سيب الرابط فاضي لإخفاء الزر.</p>
        </Card>
      </div>
    </div>
  );
}

function Payment() {
  const { db, updateSettings } = useStore();
  const s = db.settings;
  const [deposit, setDeposit] = useSection("deposit");
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="طرق الدفع المتاحة للعميل">
        <div className="space-y-3">
          {Object.entries(PAYMENT_METHODS).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-deep border border-ink/10">
              <span className="text-xs font-bold text-ink-2">{label}</span>
              <Toggle checked={!!s.paymentMethods?.[k]} onChange={(v) => updateSettings({ paymentMethods: { ...s.paymentMethods, [k]: v } })} />
            </div>
          ))}
          <p className="text-[11px] text-faint">الدفع بالبطاقة محتاج ربط ببوابة دفع (Paymob / Fawry / Kashier) عن طريق Edge Function — راجع الدليل.</p>
        </div>
      </Card>
      <Card title="العربون (للدفع عند الاستلام)" action={<Toggle checked={!!deposit.enabled} onChange={(v) => setDeposit({ ...deposit, enabled: v })} label={deposit.enabled ? "مفعّل" : "متوقف"} />}>
        <FieldsGrid
          value={deposit}
          onChange={setDeposit}
          fields={[
            { key: "type", label: "نوع العربون", type: "select", options: [{ value: "percent", label: "نسبة من الإجمالي %" }, { value: "fixed", label: "مبلغ ثابت ج.م" }] },
            { key: "value", label: deposit.type === "fixed" ? "المبلغ (ج.م)" : "النسبة (%)", type: "number" },
            { key: "minOrder", label: "مطلوب للطلبات من (ج.م)", type: "number", hint: "0 = كل الطلبات" },
            { key: "note", label: "الرسالة اللي بتظهر للعميل", type: "textarea" },
          ]}
        />
        <p className="text-[11px] text-faint mt-3">العميل بيحوّل العربون على المحفظة أو إنستا باي، وإنت بتأكد الاستلام من صفحة الطلب.</p>
      </Card>
    </div>
  );
}

function Integrations() {
  const { db, updateSettings, showToast, markPushed } = useStore();
  const integ = db.settings.integrations || {};
  const setInteg = (v) => updateSettings({ integrations: v });
  const cfg = getConfig(db.settings);
  const [status, setStatus] = useState(null);
  const [session, setSession] = useState(getSession);
  const [cred, setCred] = useState({ email: "", password: "" });

  const test = async () => {
    if (!cfg) return showToast("اكتب رابط Supabase والـ anon key الأول", "error");
    setStatus("loading");
    try {
      await testConnection(cfg);
      setStatus("ok");
    } catch (e) {
      setStatus(e.message);
    }
  };

  const login = async () => {
    try {
      setSession(await signIn(cfg, cred.email, cred.password));
      setCred({ email: "", password: "" });
      showToast("تم تسجيل الدخول في Supabase");
    } catch (e) {
      showToast(`فشل الدخول: ${e.message}`, "error");
    }
  };

  const [pushing, setPushing] = useState(false);
  const pushAll = async () => {
    if (!window.confirm("هيتم رفع المنتجات والأقسام والعروض والشحن والإعدادات لـ Supabase (تحديث وإضافة، مش مسح). متأكد؟")) return;
    setPushing(true);
    try {
      const n = await pushAllToSupabase(cfg, session.token, db);
      markPushed();
      showToast(`تم رفع ${n} جدول لـ Supabase`);
    } catch (e) {
      showToast(`الرفع فشل: ${e.message}`, "error");
    }
    setPushing(false);
  };

  const syncInventory = async () => {
    if (!cfg || !session) return showToast("محتاج تربط Supabase وتسجل دخول الأول", "error");
    try {
      const r = await callFunction(cfg, "sync-inventory", { provider: integ.inventory?.provider }, session.token);
      showToast(`تمت المزامنة: ${r.updated ?? 0} منتج`);
    } catch (e) {
      showToast(`المزامنة فشلت: ${e.message}`, "error");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="قاعدة البيانات — Supabase">
        <div className="space-y-4">
          <FieldsGrid
            value={integ}
            onChange={setInteg}
            fields={[
              { key: "supabaseUrl", label: "Project URL", placeholder: "https://xxxx.supabase.co", ltr: true, full: true },
              { key: "supabaseAnonKey", label: "anon public key", type: "password", full: true },
              { key: "functionsUrl", label: "رابط Edge Functions (اختياري)", placeholder: "https://xxxx.supabase.co/functions/v1", ltr: true, full: true },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" onClick={test}><RefreshCw size={14} className={status === "loading" ? "animate-spin" : ""} /> اختبار الاتصال</Button>
            {status === "ok" && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> متصل وشغال</span>}
            {status && !["ok", "loading"].includes(status) && <span className="text-xs text-brand font-bold flex items-center gap-1"><XCircle size={14} /> {status}</span>}
          </div>
          <p className="text-[11px] text-faint leading-relaxed">
            لما الربط يشتغل: الطلبات بتتسجل في Supabase من أي جهاز، والتتبع بيدور هناك. الـ anon key آمن يتحط هنا لأن الحماية بـ RLS في database/schema.sql. <strong className="text-ink-3">service_role key ممنوع يتحط هنا أبداً.</strong>
          </p>
        </div>
      </Card>

      <Card title="دخول الأدمن على Supabase">
        {session ? (
          <div className="space-y-3">
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 size={14} /> مسجل دخول: {session.email}</p>
            <p className="text-[11px] text-faint">دلوقتي تقدر تسحب الطلبات من صفحة الطلبات وتحدث حالتها، وترفع بيانات لوحة التحكم لقاعدة البيانات.</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={pushAll} disabled={pushing}><CloudUpload size={14} className={pushing ? "animate-pulse" : ""} /> رفع كل البيانات لـ Supabase</Button>
              <Button variant="ghost" onClick={() => { signOut(); setSession(null); }}><LogOut size={14} /> تسجيل خروج</Button>
            </div>
            <p className="text-[11px] text-faint">الرفع بيشمل مفاتيح API شركات الشحن والمخزن (بتتحفظ في جداول محمية للأدمن بس) عشان الـ Edge Functions تستخدمها.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] text-faint">اعمل يوزر من Supabase ← Authentication، وضيف الإيميل بتاعه في جدول admins.</p>
            <input value={cred.email} onChange={(e) => setCred({ ...cred, email: e.target.value })} placeholder="الإيميل" className={inputCls} dir="ltr" />
            <input type="password" value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} placeholder="كلمة المرور" className={inputCls} dir="ltr" />
            <Button onClick={login} disabled={!cfg}><LogIn size={14} /> دخول</Button>
          </div>
        )}
      </Card>

      <Card
        title="API المخزن (ERP / برنامج المخازن)"
        className="xl:col-span-2"
        action={<Toggle checked={!!integ.inventory?.enabled} onChange={(v) => setInteg({ ...integ, inventory: { ...integ.inventory, enabled: v } })} label={integ.inventory?.enabled ? "مفعّل" : "متوقف"} />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <FieldsGrid
            value={integ.inventory}
            onChange={(v) => setInteg({ ...integ, inventory: v })}
            fields={[
              { key: "provider", label: "النظام", type: "select", options: [{ value: "custom", label: "API خاص (REST)" }, { value: "odoo", label: "Odoo" }, { value: "zoho", label: "Zoho Inventory" }, { value: "erpnext", label: "ERPNext" }] },
              { key: "intervalMinutes", label: "المزامنة كل (دقيقة)", type: "number" },
              { key: "baseUrl", label: "رابط الـ API", placeholder: "https://erp.example.com/api", ltr: true, full: true },
              { key: "apiKey", label: "API Key", type: "password", full: true },
              { key: "syncStock", label: "سحب الكميات من المخزن", type: "toggle" },
              { key: "syncOrders", label: "إرسال الطلبات للمخزن", type: "toggle" },
            ]}
          />
          <div className="space-y-3 text-[11px] text-muted leading-relaxed bg-deep border border-ink/10 rounded-xl p-4">
            <p>البيانات دي بتتحفظ في جدول <span className="font-mono text-ink-2">integration_settings</span> والمزامنة بتتم من Edge Function اسمها <span className="font-mono text-ink-2">sync-inventory</span> (موجودة في supabase/functions).</p>
            <Button variant="ghost" onClick={syncInventory} className="w-full"><RefreshCw size={14} /> مزامنة الآن</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Security() {
  const { db, updateSettings, resetDb, importDb, showToast } = useStore();
  const fileRef = useRef(null);
  const [pass, setPass] = useState({ next: "", confirm: "" });

  const exportDb = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `baba-el-magal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (importDb(JSON.parse(reader.result))) showToast("تم استرجاع النسخة الاحتياطية");
        else showToast("الملف مش نسخة احتياطية صحيحة", "error");
      } catch {
        showToast("الملف مش نسخة احتياطية صحيحة", "error");
      }
    };
    reader.readAsText(file);
  };

  const changePassword = () => {
    if (pass.next.length < 6) return showToast("كلمة المرور لازم تكون 6 حروف على الأقل", "error");
    if (pass.next !== pass.confirm) return showToast("كلمتين المرور مش متطابقين", "error");
    updateSettings({ adminPassword: pass.next });
    setPass({ next: "", confirm: "" });
    showToast("تم تغيير كلمة المرور");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card title="كلمة مرور لوحة التحكم">
        <div className="space-y-4">
          <Field label="كلمة المرور الجديدة"><input type="password" value={pass.next} onChange={(e) => setPass({ ...pass, next: e.target.value })} className={inputCls} /></Field>
          <Field label="تأكيد كلمة المرور"><input type="password" value={pass.confirm} onChange={(e) => setPass({ ...pass, confirm: e.target.value })} className={inputCls} /></Field>
          <Button onClick={changePassword}><KeyRound size={14} /> تغيير كلمة المرور</Button>
          <p className="text-[11px] text-faint">دي حماية مؤقتة على المتصفح. بعد الربط بـ Supabase استخدم دخول Supabase (تبويب الربط).</p>
        </div>
      </Card>
      <Card title="النسخ الاحتياطي">
        <div className="space-y-3">
          <p className="text-[11px] text-muted leading-relaxed">خد نسخة من كل البيانات (منتجات، طلبات، إعدادات) وترجعها على أي جهاز.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={exportDb}><Download size={14} /> تحميل نسخة احتياطية</Button>
            <Button variant="ghost" onClick={() => fileRef.current?.click()}><Upload size={14} /> استرجاع نسخة</Button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
          </div>
          <div className="pt-3 border-t border-ink/10">
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm("هيتم مسح كل التعديلات والطلبات والرجوع للبيانات الأصلية. متأكد؟")) {
                  resetDb();
                  showToast("تمت إعادة ضبط البيانات");
                }
              }}
            >
              <RotateCcw size={14} /> إعادة ضبط كل البيانات
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
