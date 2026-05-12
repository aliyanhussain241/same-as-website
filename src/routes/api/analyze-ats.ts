import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/analyze-ats")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { resumeText, jobDescription } = (await request.json()) as any;
          if (!resumeText) {
            return new Response(JSON.stringify({ error: "Resume text is required" }), { status: 400 });
          }

          const systemInstruction = `You are an expert Applicant Tracking System (ATS) Evaluator. Act like a strict ATS parser. Identify missing keywords, formatting errors, lacking quantifications, missing structural sections, and provide a realistic score from 0 to 100. Respond ONLY in JSON.`;

          const prompt = `RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "No specific job description provided. Perform a general ATS compliance check."}

Provide analysis in EXACTLY this JSON structure (no comments):
{
  "score": 67,
  "metrics": { "keywordMatch": 58, "formatScore": 82, "contentScore": 71, "readability": 75 },
  "issues": {
    "critical": [{ "title": "", "description": "", "fix": "" }],
    "warnings": [{ "title": "", "description": "", "fix": "" }],
    "passed": ["string"]
  },
  "keywords": {
    "found": ["string"],
    "missing": [{ "keyword": "string", "importance": "high" }],
    "suggested": ["string"]
  },
  "formatting": [{ "check": "", "status": "pass", "details": "" }],
  "improvementPlan": [{ "priority": 1, "title": "", "impact": "", "description": "", "example": "", "action": "" }]
}`;

          const text = await callAIGateway({
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
            json: true,
          });
          return new Response(JSON.stringify(safeJSON(text)), { headers: { "Content-Type": "application/json" } });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to analyze ATS" }), { status: 500 });
        }
      },
    },
  },
});
