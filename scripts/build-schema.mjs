// بيجمع ملفات database/schema/*.sql بالترتيب في database/schema.sql (ملف واحد للصق مرة واحدة)
//   npm run db:build
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = new URL("../database/schema/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const header = `-- =====================================================================
--  schema.sql — كل جداول ودوال وحماية قاعدة بيانات بابا المجال في ملف واحد
--  اتجمع تلقائياً من database/schema/ — ماتعدلش هنا، عدّل الملف الصغير وشغّل npm run db:build
--  الترتيب: ${files.join(" ← ")}
-- =====================================================================
`;
writeFileSync(new URL("../database/schema.sql", import.meta.url), header + files.map((f) => readFileSync(new URL(f, dir), "utf8")).join("\n"), "utf8");
console.log(`✓ database/schema.sql من ${files.length} ملف`);
