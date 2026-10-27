// إنشاء بوليصة شحن عند شركة الشحن (بيتنادى من لوحة التحكم ← الطلب ← "إنشاء شحنة API")
// النشر: supabase functions deploy create-shipment
import { cors, json, requireAdmin, serviceClient } from "../_shared/admin.ts";

type Creds = { base_url: string; api_key: string; api_secret: string; account_id: string; pickup_location_id: string };

// كل شركة ليها شكل طلب مختلف — عدّل الربط حسب توثيق الـ API بتاع الشركة
const providers: Record<string, (order: any, items: any[], c: Creds) => Promise<string>> = {
  async bosta(order, items, c) {
    const [firstName, ...rest] = order.customer_name.split(" ");
    const res = await fetch(`${c.base_url}/deliveries`, {
      method: "POST",
      headers: { Authorization: c.api_key, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: 10, // تسليم
        businessReference: order.number,
        cod: Number(order.total) - (order.deposit_paid ? Number(order.deposit_amount) : 0),
        notes: order.notes ?? "",
        specs: { packageDetails: { itemsCount: items.reduce((s, i) => s + i.qty, 0), description: items.map((i) => i.name).join(" + ").slice(0, 200) } },
        dropOffAddress: { city: order.governorate, firstLine: `${order.city} - ${order.address}`, secondLine: order.landmark ?? "" },
        receiver: { firstName, lastName: rest.join(" ") || "-", phone: order.phone },
        ...(c.pickup_location_id ? { businessLocationId: c.pickup_location_id } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message ?? "Bosta API error");
    return data?.data?.trackingNumber ?? data?.trackingNumber;
  },

  // أي شركة تانية: API بسيط POST /shipments بيرجع { trackingNumber }
  async custom(order, items, c) {
    const res = await fetch(`${c.base_url}/shipments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${c.api_key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reference: order.number, account: c.account_id, receiver: { name: order.customer_name, phone: order.phone, governorate: order.governorate, address: `${order.city} - ${order.address}` }, cod: order.total, items }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message ?? "Shipping API error");
    return data.trackingNumber;
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    await requireAdmin(req);
    const { orderNumber, companyId } = await req.json();
    const db = serviceClient();

    const { data: order } = await db.from("orders").select("*, order_items(*)").eq("number", orderNumber).single();
    const { data: company } = await db.from("shipping_companies").select("*").eq("id", companyId).single();
    const { data: creds } = await db.from("shipping_company_credentials").select("*").eq("company_id", companyId).single();
    if (!order || !company) return json({ error: "الطلب أو الشركة مش موجودين" }, 404);
    if (!creds?.enabled) return json({ error: "الـ API متوقف للشركة دي" }, 400);

    const create = providers[company.provider] ?? providers.custom;
    const trackingNumber = await create(order, order.order_items, creds);

    await db.from("orders").update({ tracking_number: trackingNumber, shipping_company_id: companyId, status: "shipped" }).eq("id", order.id);
    await db.from("order_events").insert({ order_id: order.id, status: "shipped", note: `تم إنشاء بوليصة ${company.name}: ${trackingNumber}`, source: "admin" });

    return json({ trackingNumber });
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});
