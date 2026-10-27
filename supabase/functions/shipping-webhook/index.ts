// شركة الشحن بتبعت هنا تحديثات حالة الشحنة تلقائياً → بتظهر للعميل في /track
// الرابط اللي تديه للشركة: https://PROJECT.supabase.co/functions/v1/shipping-webhook?company=2&secret=XXXX
// النشر: supabase functions deploy shipping-webhook --no-verify-jwt
//        supabase secrets set WEBHOOK_SECRET=XXXX
import { cors, json, serviceClient } from "../_shared/admin.ts";

// تحويل حالات الشركات لحالات المتجر — زوّد حسب الشركة
const STATUS_MAP: Record<string, string> = {
  // Bosta
  "picked up": "shipped",
  "in transit": "shipped",
  "out for delivery": "out_for_delivery",
  delivered: "delivered",
  returned: "returned",
  cancelled: "cancelled",
  // عام
  shipped: "shipped",
  out_for_delivery: "out_for_delivery",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== Deno.env.get("WEBHOOK_SECRET")) return json({ error: "unauthorized" }, 401);

  const companyId = Number(url.searchParams.get("company")) || null;
  const payload = await req.json().catch(() => ({}));
  const db = serviceClient();
  await db.from("shipping_webhook_log").insert({ company_id: companyId, payload });

  const tracking = payload.trackingNumber ?? payload.tracking_number ?? payload.awb;
  const raw = String(payload.state?.value ?? payload.status ?? "").toLowerCase();
  const status = STATUS_MAP[raw];
  if (!tracking || !status) return json({ ok: true, ignored: true });

  const { data: order } = await db.from("orders").select("id, status").eq("tracking_number", tracking).maybeSingle();
  if (!order) return json({ ok: true, notFound: true });

  if (order.status !== status) {
    await db.from("orders").update({ status }).eq("id", order.id);
    await db.from("order_events").insert({ order_id: order.id, status, note: payload.note ?? payload.state?.label ?? null, source: "webhook" });
  }
  return json({ ok: true });
});
