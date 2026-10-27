// مشترك بين الـ Edge Functions: CORS + التأكد إن اللي بيطلب أدمن + عميل بصلاحيات السيرفر
import { createClient } from "npm:@supabase/supabase-js@2";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// عميل بصلاحيات كاملة (service role) — موجود في السيرفر بس، عمره ما يتحط في الموقع
export const serviceClient = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

export async function requireAdmin(req: Request) {
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data, error } = await userClient.rpc("is_admin");
  if (error || !data) throw new Error("غير مصرح — لازم تسجل دخول كأدمن");
}
