import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";

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
          const form = await request.formData();
          const file = form.get("cv") as File | null;
          if (!file) return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });

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
