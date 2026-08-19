import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function buildTowbookPayload(p) {
  const params = new URLSearchParams();
  params.append("VehicleLocation", p.pickup_address || "");
  params.append("Destination", p.destination_address || "");
  params.append("Reason", p.situation || p.service_type || "");
  params.append("LicensePlate", p.license_plate || "");
  params.append("LicensePlateState", p.license_plate_state || "");
  params.append("VIN", p.vin || "");
  params.append("Year", p.vehicle_year || "");
  params.append("Make", p.vehicle_make || "");
  params.append("Model", p.vehicle_model || "");
  params.append("Color", p.vehicle_color || "");
  params.append("PONumber", p.po_number || "");
  params.append("Notes", p.notes || "");
  params.append("FirstLastName", p.name || "");
  params.append("PhoneNumber", p.phone || "");
  params.append("Email", p.email || "");
  return params;
}

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
  if (!requestId) return Response.json({ error: "requestId is required" }, { status: 400 });

  const { data: request, error: err } = await supabase.from("service_requests").select("*").eq("id", requestId).single();
  if (err || !request) return Response.json({ error: "Request not found" }, { status: 404 });

  // DUPLICATE PROTECTION
  if (request.towbook_status === "success" && request.towbook_reference) {
    return Response.json({ error: "Request already successfully submitted to Towbook.", towbook_reference: request.towbook_reference }, { status: 409 });
  }

  if (process.env.TOWBOOK_ENABLED !== "true") return Response.json({ error: "Towbook not enabled" }, { status: 503 });

  const endpoint = process.env.TOWBOOK_ENDPOINT || "https://public.towbook.com/KrKN";
  await supabase.from("service_requests").update({ towbook_status: "sending", towbook_attempt_count: (request.towbook_attempt_count || 0) + 1, towbook_last_attempt_at: new Date().toISOString() }).eq("id", requestId);
  await supabase.from("request_events").insert({ request_id: requestId, event_type: "towbook_retry", message: `Manual retry (attempt ${(request.towbook_attempt_count || 0) + 1})` });

  try {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: buildTowbookPayload(request).toString() });
    if (!res.ok) throw new Error(`Towbook ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const ref = `TB-${Date.now().toString(36).toUpperCase()}`;
    await supabase.from("service_requests").update({ towbook_status: "success", towbook_reference: ref, towbook_submitted_at: new Date().toISOString(), towbook_error: null }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "towbook_success", message: `Retry successful (${ref})` });
    return Response.json({ success: true, towbook_reference: ref });
  } catch (err) {
    await supabase.from("service_requests").update({ towbook_status: "failed", towbook_error: String(err.message).slice(0, 500) }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "towbook_failed", message: String(err.message).slice(0, 500) });
    return Response.json({ error: "Towbook submission failed", detail: err.message }, { status: 502 });
  }
}

export const config = { path: "/.netlify/functions/retry-towbook" };
