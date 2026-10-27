# بابا المجال (baba-el-magal) — متجر أدوات منزلية

React 19 + Vite + React Router + Tailwind + Supabase

```bash
npm install
npm run dev        # http://localhost:5173  —  لوحة التحكم: /admin (admin123)
npm run build
npm run db:build   # يجمع database/schema/* في schema.sql ويولّد ملفات البيانات من src/data
```

📘 **الشرح الكامل:** [docs/دليل_المشروع.md](docs/دليل_المشروع.md) — الصفحات، لوحة التحكم، هيكل الملفات، Supabase خطوة بخطوة، الجداول، الربط بشركات الشحن والمخزن، والسيرفرات المقترحة.

| الملف | إيه |
|---|---|
| `database/README.md` | 📗 خريطة قاعدة البيانات: كل ملف فيه إيه وترتيب التشغيل |
| `database/schema/00 → 13` | جداول Supabase + الحماية + الدوال (مقسمة) — أو `schema.sql` كله في ملف |
| `database/seed/01 → 05` | البيانات الافتراضية (مقسمة) — أو `seed.sql` كله في ملف |
| `supabase/functions/` | دوال السيرفر: إنشاء شحنة، Webhook الشحن، مزامنة المخزن |
| `.env.example` | مفاتيح Supabase |
