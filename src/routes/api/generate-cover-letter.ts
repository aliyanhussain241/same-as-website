import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/generate-cover-letter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { userData, jobData, tone } = (await request.json()) as any;

          const systemInstruction = `You are an expert Career Coach and Cover Letter Writer.

Rules:
1. TONE: ${tone || "Professional"}.
2. STRUCTURE: Strong opening hook, body paragraph highlighting key matches, professional closing with call to action.
3. PERSONALIZATION: Reference the specific company name, job title, and user experiences.
4. FORMAT: Plain text content with paragraph breaks.
5. INSIGHTS: Provide matched skills, missing keywords, and improvement tips.

Respond ONLY in JSON.`;

          const prompt = `TARGET JOB:
Title: ${jobData.title}
Company: ${jobData.company}
Description:
${jobData.description}

USER:
Name: ${userData.fullName}
Experience:
${(userData.experience || []).map((e: string, i: number) => `Role ${i + 1}:\n${e}`).join("\n\n")}
Skills:
${(userData.skills || []).map((s: string, i: number) => `Group ${i + 1}: ${s}`).join("\n")}

Respond strictly with JSON:
{
  "content": "string (cover letter text with \\n line breaks)",
  "insights": {
    "matchedSkills": ["string"],
    "missingKeywords": ["string"],
    "improvementTips": ["string"]
  }
}`;

          const text = await callAIGateway({
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.5,
            json: true,
          });
          return new Response(JSON.stringify(safeJSON(text)), { headers: { "Content-Type": "application/json" } });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to generate cover letter" }), { status: 500 });
        }
      },
    },
  },
});
