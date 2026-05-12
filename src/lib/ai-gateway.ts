// Shared helper for calling Lovable AI Gateway (OpenAI-compatible)

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
};

export async function callAIGateway(opts: {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  json?: boolean;
}): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const body: any = {
    model: opts.model ?? "google/gemini-2.5-flash",
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
  };
  if (opts.json) body.response_format = { type: "json_object" };

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI Gateway error ${res.status}: ${errText}`);
  }
  const data: any = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

export function safeJSON<T = any>(text: string): T {
  let s = text.trim();
  // Strip markdown code fences if model wraps the JSON
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  return JSON.parse(s);
}
