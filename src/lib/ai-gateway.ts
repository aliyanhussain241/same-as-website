// Direct Google Gemini API client (replaces Lovable AI Gateway).
// Uses GEMINI_API_KEY env var. Works on Cloudflare Workers / Node / any fetch-capable runtime.

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<{ type: string; text?: string; image_url?: { url: string } }>;
};

const DEFAULT_MODEL = "gemini-2.5-flash";

function mapModel(model?: string): string {
  if (!model) return DEFAULT_MODEL;
  // Strip provider prefix like "google/" if present, drop "-preview" suffix variants.
  return model.replace(/^google\//, "");
}

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

function partsFromContent(content: AIMessage["content"]): GeminiPart[] {
  if (typeof content === "string") return [{ text: content }];
  const parts: GeminiPart[] = [];
  for (const item of content) {
    if (item.type === "text" && item.text) {
      parts.push({ text: item.text });
    } else if (item.type === "image_url" && item.image_url?.url) {
      const url = item.image_url.url;
      const m = /^data:([^;]+);base64,(.+)$/.exec(url);
      if (m) {
        parts.push({ inlineData: { mimeType: m[1], data: m[2] } });
      } else {
        // Fall back: include URL as text reference
        parts.push({ text: url });
      }
    }
  }
  return parts;
}

export async function callAIGateway(opts: {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  json?: boolean;
}): Promise<string> {
  const apiKey = (globalThis as any).GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const model = mapModel(opts.model);

  // Collect system instructions; merge consecutive non-system messages into Gemini "contents".
  const systemTexts: string[] = [];
  const contents: { role: "user" | "model"; parts: GeminiPart[] }[] = [];

  for (const msg of opts.messages) {
    if (msg.role === "system") {
      const t = typeof msg.content === "string"
        ? msg.content
        : msg.content.map((c) => c.text || "").join("\n");
      if (t) systemTexts.push(t);
      continue;
    }
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: partsFromContent(msg.content),
    });
  }

  const body: any = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.3,
    },
  };
  if (systemTexts.length) {
    body.systemInstruction = { parts: [{ text: systemTexts.join("\n\n") }] };
  }
  if (opts.json) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }
  const data: any = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? "").join("");
}

export function safeJSON<T = any>(text: string): T {
  let s = text.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  return JSON.parse(s);
}
