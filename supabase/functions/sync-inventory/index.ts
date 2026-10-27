// مزامنة المخزون مع نظام المخازن (ERP) — بيتنادى من الإعدادات ← الربط ← "مزامنة الآن"
// أو أوتوماتيك كل فترة بـ Supabase Cron (راجع docs/دليل_المشروع.md)
// النشر: supabase functions deploy sync-inventory
import { cors, json, requireAdmin, serviceClient } from "../_shared/admin.ts";

type StockRow = { sku: string; stock: number; price?: number };

// كل نظام بيرجع الكميات بشكل مختلف — عدّل حسب الـ API بتاعك
async function fetchStock(cfg: any): Promise<StockRow[]> {
  if (cfg.provider === "custom") {
    // متوقع: GET {baseUrl}/stock → [{ sku, stock, price? }]
    const res = await fetch(`${cfg.baseUrl}/stock`, { headers: { Authorization: `Bearer ${cfg.apiKey}` } });
    if (!res.ok) throw new Error(`ERP API ${res.status}`);
    return await res.json();
  }
  throw new Error(`الربط مع ${cfg.provider} لسه محتاج يتكتب في sync-inventory`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const db = serviceClient();
  let logId: number | null = null;
  try {
    // لو النداء من Cron بيبعت x-cron-secret، غير كده لازم أدمن
    if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) await requireAdmin(req);

    const { data: setting } = await db.from("integration_settings").select("value").eq("key", "inventory").single();
    const cfg = setting?.value;
    if (!cfg?.enabled) return json({ error: "ربط المخزن متوقف" }, 400);

    const { data: log } = await db.from("inventory_sync_log").insert({}).select("id").single();
    logId = log?.id ?? null;

    let updated = 0;
    if (cfg.syncStock) {
      for (const row of await fetchStock(cfg)) {
        const patch: Record<string, number> = { stock: Math.max(0, Math.floor(row.stock)) };
        if (row.price) patch.price = row.price;
        const { count } = await db.from("products").update(patch, { count: "exact" }).eq("sku", row.sku);
        updated += count ?? 0;
      }
    }

    // إرسال الطلبات الجديدة للمخزن (اختياري)
    if (cfg.syncOrders) {
      const { data: orders } = await db.from("orders").select("number, order_items(name, qty, product_id)").eq("status", "confirmed");
      if (orders?.length) {
        await fetch(`${cfg.baseUrl}/orders`, {
          method: "POST",
          headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(orders),
        });
      }
    }

    await db.from("inventory_sync_log").update({ status: "ok", finished_at: new Date().toISOString(), updated_count: updated }).eq("id", logId);
    return json({ updated });
  } catch (e) {
    if (logId) await db.from("inventory_sync_log").update({ status: "error", finished_at: new Date().toISOString(), message: (e as Error).message }).eq("id", logId);
    return json({ error: (e as Error).message }, 400);
  }
});
