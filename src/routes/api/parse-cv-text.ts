import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/parse-cv-text")({
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
            process.env.VITE_SUPABASE_URL!,
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
          );
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid or expired session. Please log in again." }), { status: 401 });
          }

          const form = await request.formData();
          const file = form.get("cv") as File | null;
          if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
          }

          // ✅ MIME TYPE VALIDATION
          const allowedTypes = ["application/pdf", "text/plain"];
          if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: "Invalid file type. Only PDF and TXT allowed." }), { status: 415 });
          }

          if (file.type !== "application/pdf") {
            const text = await file.text();
            return new Response(JSON.stringify({ text }), { headers: { "Content-Type": "application/json" } });
          }

          const buf = new Uint8Array(await file.arrayBuffer());
          let binary = "";
          for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
          const dataUrl = `data:application/pdf;base64,${btoa(binary)}`;

          const text = await callAIGateway({
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Extract ALL the raw text from this CV/resume PDF. Return only the text, no commentary, preserving line breaks." },
                  { type: "image_url", image_url: { url: dataUrl } },
                ] as any,
              },
            ],
            temperature: 0,
          });
          return new Response(JSON.stringify({ text }), { headers: { "Content-Type": "application/json" } });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to parse CV text" }), { status: 500 });
        }
      },
    },
  },
});
