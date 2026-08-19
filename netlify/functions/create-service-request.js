import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ipMap = new Map();
function rateOk(ip) {
  const now = Date.now();
  const entry = ipMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > 60000) { entry.count = 1; entry.start = now; }
  else { entry.count++; }
  ipMap.set(ip, entry);
  return entry.count <= 5;
}

function normalizePhone(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.trim();
}

function sanitize(str) { return str ? String(str).slice(0, 2000).trim() : ""; }

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

async function syncAttio(requestId, payload) {
  const key = process.env.ATTIO_API_KEY;
  if (!key) { await supabase.from("service_requests").update({ attio_status: "failed", attio_error: "ATTIO_API_KEY not configured" }).eq("id", requestId); return; }
  try {
    await supabase.from("service_requests").update({ attio_status: "syncing", attio_last_attempt_at: new Date().toISOString() }).eq("id", requestId);
    const res = await fetch("https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ data: { values: {
        name: [{ first_name: payload.name?.split(" ")[0] || "", last_name: payload.name?.split(" ").slice(1).join(" ") || "" }],
        email_addresses: [{ email_address: payload.email }],
        phone_numbers: payload.phone ? [{ phone_number: payload.phone }] : [],
      }}}),
    });
    if (!res.ok) throw new Error(`Attio ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    const rid = data?.data?.id?.record_id || "";
    await supabase.from("service_requests").update({ attio_status: "success", attio_record_id: rid, attio_error: null }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "attio_synced", message: `Contact synced (${rid})` });
  } catch (err) {
    await supabase.from("service_requests").update({ attio_status: "failed", attio_error: String(err.message).slice(0, 500) }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "attio_failed", message: String(err.message).slice(0, 500) });
  }
}

async function submitTowbook(requestId, payload) {
  const endpoint = process.env.TOWBOOK_ENDPOINT || "https://public.towbook.com/KrKN";
  if (process.env.TOWBOOK_ENABLED !== "true") {
    await supabase.from("service_requests").update({ towbook_status: "pending", towbook_error: "TOWBOOK_ENABLED not set to true" }).eq("id", requestId);
    return;
  }
  try {
    await supabase.from("service_requests").update({ towbook_status: "sending", towbook_attempt_count: 1, towbook_last_attempt_at: new Date().toISOString() }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "towbook_sending", message: "Towbook submission started" });
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: buildTowbookPayload(payload).toString() });
    if (!res.ok) throw new Error(`Towbook ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const ref = `TB-${Date.now().toString(36).toUpperCase()}`;
    await supabase.from("service_requests").update({ towbook_status: "success", towbook_reference: ref, towbook_submitted_at: new Date().toISOString(), towbook_error: null }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "towbook_success", message: `Towbook success (${ref})` });
  } catch (err) {
    await supabase.from("service_requests").update({ towbook_status: "failed", towbook_error: String(err.message).slice(0, 500) }).eq("id", requestId);
    await supabase.from("request_events").insert({ request_id: requestId, event_type: "towbook_failed", message: String(err.message).slice(0, 500) });
  }
}

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }});
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateOk(ip)) return Response.json({ error: "Too many requests." }, { status: 429 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const name = sanitize(body.name);
  const phone = normalizePhone(body.phone);
  const email = (body.email || "").trim().toLowerCase();
  if (!name || !phone) return Response.json({ error: "Name and phone are required." }, { status: 400 });

  const record = {
    name, phone, email,
    situation: sanitize(body.situation),
    service_type: sanitize(body.service_type || body.situation),
    urgency: sanitize(body.urgency),
    pickup_address: sanitize(body.pickup_address || body.pickupAddress),
    pickup_latitude: body.pickup_latitude || body.latitude || null,
    pickup_longitude: body.pickup_longitude || body.longitude || null,
    destination_address: sanitize(body.destination_address || body.destination),
    vehicle_year: sanitize(body.vehicle_year || body.year),
    vehicle_make: sanitize(body.vehicle_make || body.make),
    vehicle_model: sanitize(body.vehicle_model || body.model),
    vehicle_color: sanitize(body.vehicle_color || body.color),
    vehicle_condition: sanitize(body.vehicle_condition || body.condition),
    vin: sanitize(body.vin),
    license_plate: sanitize(body.license_plate || body.licensePlate),
    license_plate_state: sanitize(body.license_plate_state || body.licensePlateState),
    keys_available: sanitize(body.keys_available || body.keysAvailable),
    po_number: sanitize(body.po_number || body.poNumber),
    notes: sanitize(body.notes),
    photo_urls: Array.isArray(body.photo_urls) ? body.photo_urls : [],
    source: sanitize(body.source), medium: sanitize(body.medium), campaign: sanitize(body.campaign),
    content: sanitize(body.content), term: sanitize(body.term),
    gclid: sanitize(body.gclid), fbclid: sanitize(body.fbclid),
    referrer: sanitize(body.referrer), landing_page: sanitize(body.landing_page),
    user_agent: sanitize(body.user_agent),
    status: "new", attio_status: "pending", towbook_status: "pending",
  };

  // ===== SAVE TO SUPABASE FIRST =====
  const { data, error } = await supabase.from("service_requests").insert(record).select("id").single();
  if (error) { console.error("Insert error:", error); return Response.json({ error: "Failed to save request." }, { status: 500 }); }
  const requestId = data.id;

  await supabase.from("request_events").insert({ request_id: requestId, event_type: "request_received", message: "Service request received and saved", metadata: { source: record.source, campaign: record.campaign } });

  // Fire-and-forget integrations
  syncAttio(requestId, record).catch(() => {});
  submitTowbook(requestId, record).catch(() => {});

  return Response.json({ success: true, requestId }, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
}

export const config = { path: "/.netlify/functions/create-service-request" };
