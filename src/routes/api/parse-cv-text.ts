import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/parse-cv-text")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const file = form.get("cv") as File | null;
          if (!file) return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });

          if (file.type !== "application/pdf") {
            const text = await file.text();
            return new Response(JSON.stringify({ text }), { headers: { "Content-Type": "application/json" } });
          }

          // PDF: use AI gateway to extract text
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
