import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyAdmin(req) {
  const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
  if (!token) return false;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return !error && !!user;
}

export default async function handler(req) {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  if (!(await verifyAdmin(req))) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { requestId } = body;
  if (!requestId) return Response.json({ error: "requestId required" }, { status: 400 });

  const { data: request, error: err } = await supabase.from("service_requests").select("*").eq("id", requestId).single();
  if (err || !request) return Response.json({ error: "Not found" }, { status: 404 });

  const key = process.env.ATTIO_API_KEY;
  if (!key) return Response.json({ error: "ATTIO_API_KEY not configured" }, { status: 503 });

  await supabase.from("service_requests").update({ attio_status: "syncing", attio_last_attempt_at: new Date().toISOString() }).eq("id", requestId);

  try {
    const res = await fetch("https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ data: { values: {
        name: [{ first_name: request.name?.split(" ")[0] || "", last_name: request.name?.split(" ").slice(1).join(" ") || "" }],
        email_addresses: [{ email_address: request.email }],
        phone_numbers: request.phone ? [{ phone_number: request.phone }] : [],
      }}}),
    });
    if (!res.ok) throw new Error(`Attio ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    const rid = data?.data?.id?.record_id || "";
    await supabase.from("service_requests").update({ attio_status: "success", attio_record_id: rid, attio_error: null }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "attio_synced", message: `Retry successful (${rid})` });
    return Response.json({ success: true, attio_record_id: rid });
  } catch (err) {
    await supabase.from("service_requests").update({ attio_status: "failed", attio_error: String(err.message).slice(0, 500) }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "attio_failed", message: String(err.message).slice(0, 500) });
    return Response.json({ error: "Attio sync failed" }, { status: 502 });
  }
}

export const config = { path: "/.netlify/functions/retry-attio" };
