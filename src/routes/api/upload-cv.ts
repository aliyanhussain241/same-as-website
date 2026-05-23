import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

async function fileToText(file: File): Promise<{ text?: string; dataUrl?: string }> {
  if (file.type === "application/pdf") {
    const buf = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
    const base64 = btoa(binary);
    return { dataUrl: `data:application/pdf;base64,${base64}` };
  }
  return { text: await file.text() };
}

export const Route = createFileRoute("/api/upload-cv")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ✅ AUTH CHECK
          const authHeader = request.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), { status: 401 });
          }
          const token = authHeader.replace("Bearer ", "");
        const supabase = createClient(
  (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
  (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)!
);
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid or expired session. Please log in again." }), { status: 401 });
          }

          const form = await request.formData();
          const file = form.get("cv") as File | null;

          // ✅ NULL CHECK FIRST
          if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
          }

          // ✅ MIME TYPE VALIDATION
          const allowedTypes = ["application/pdf", "text/plain"];
          if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: "Invalid file type. Only PDF and TXT allowed." }), { status: 415 });
          }

          // ✅ SIZE CHECK
          if (file.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "File too large. Max 5MB." }), { status: 413 });
          }

          const { text, dataUrl } = await fileToText(file);
          const instruction = `Extract the following information from the provided CV into JSON:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string",
  "currentRole": "string",
  "skills": ["string"],
  "experience": ["string (combine title, company, dates, bullets per role)"],
  "education": "string"
}
If anything is missing, use empty string or empty array. Do not invent data.`;

          const userContent: any = dataUrl
            ? [
                { type: "text", text: instruction },
                { type: "image_url", image_url: { url: dataUrl } },
              ]
            : `${instruction}\n\nCV TEXT:\n${text}`;

          const responseText = await callAIGateway({
            messages: [{ role: "user", content: userContent }],
            temperature: 0.1,
            json: true,
          });
          return new Response(JSON.stringify(safeJSON(responseText)), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to parse CV" }), { status: 500 });
        }
      },
    },
  },
});
