import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export default async function handler(req) {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const requestId = formData.get("requestId") || "unlinked";

    if (!file || typeof file === "string") return Response.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return Response.json({ error: "Invalid file type" }, { status: 400 });
    if (file.size > MAX_SIZE) return Response.json({ error: "File too large (max 10 MB)" }, { status: 400 });

    const ext = file.name?.split(".").pop() || "jpg";
    const path = `${requestId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage.from("service-request-photos").upload(path, buffer, { contentType: file.type, upsert: false });
    if (error) { console.error("Upload error:", error); return Response.json({ error: "Upload failed" }, { status: 500 }); }

    const { data: urlData } = supabase.storage.from("service-request-photos").getPublicUrl(data.path);
    return Response.json({ success: true, url: urlData.publicUrl, path: data.path });
  } catch (err) {
    console.error("Upload handler error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = { path: "/.netlify/functions/upload-photo" };
