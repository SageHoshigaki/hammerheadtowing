import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ALLOWED = ["status","job_value","notes","vehicle_color","vin","license_plate","license_plate_state","po_number","completed_at"];

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

  const { requestId, updates } = body;
  if (!requestId || !updates || typeof updates !== "object") return Response.json({ error: "requestId and updates required" }, { status: 400 });

  const sanitized = {};
  for (const key of ALLOWED) { if (key in updates) sanitized[key] = updates[key]; }
  if (!Object.keys(sanitized).length) return Response.json({ error: "No valid fields" }, { status: 400 });

  if (sanitized.status === "completed" && !sanitized.completed_at) sanitized.completed_at = new Date().toISOString();

  const { data, error } = await supabase.from("service_requests").update(sanitized).eq("id", requestId).select("*").single();
  if (error) return Response.json({ error: "Update failed" }, { status: 500 });

  await supabase.from("request_events").insert({ request_id: requestId, event_type: "request_updated", message: `Updated: ${Object.keys(sanitized).join(", ")}`, metadata: sanitized });
  return Response.json({ success: true, request: data });
}

export const config = { path: "/.netlify/functions/update-request" };
