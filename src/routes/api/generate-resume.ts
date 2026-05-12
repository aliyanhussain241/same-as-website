import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/generate-resume")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { userData, jobData } = (await request.json()) as any;
          if (!userData || !jobData) {
            return new Response(JSON.stringify({ error: "Missing required data" }), { status: 400 });
          }

          const systemInstruction = `You are an expert Executive Recruiter and ATS (Applicant Tracking System) Optimization Specialist.
Your task is to take a user's raw experience, education, and skills, and tailor it specifically for a target job description.

Rules:
1. MAXIMIZE ATS MATCH: Naturally integrate keywords from the job description into the professional summary and experience bullets.
2. ACTION-ORIENTED: Rewrite bullet points to start with strong action verbs.
3. TAILORED SUMMARY: Write a focused 2-3 sentence professional summary that positions the user perfectly for the target role.
4. NO LIES: Do not invent experiences or skills the user did not provide.
5. RELEVANCE: Keep only the most relevant education and skills. Group skills logically.

Respond ONLY in JSON.`;

          const prompt = `TARGET JOB:
Title: ${jobData.title}
Company: ${jobData.company}
Description:
${jobData.description}

USER RAW DATA:
Name: ${userData.fullName}
Contact: Email: ${userData.email} | Phone: ${userData.phone} | LinkedIn: ${userData.linkedin}
Current Role: ${userData.currentRole}
Skills:
${(userData.skills || []).map((s: string, i: number) => `Group ${i + 1}: ${s}`).join("\n")}
Experience:
${(userData.experience || []).map((e: string, i: number) => `Role ${i + 1}:\n${e}`).join("\n\n")}
Education:
${userData.education}

Generate a highly optimized resume in JSON matching:
{
  "header": { "fullName": "string", "contactInfo": "string", "title": "string" },
  "summary": "string",
  "experience": [{ "title": "string", "company": "string", "dateRange": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "dateRange": "string" }],
  "skills": [{ "category": "string", "items": ["string"] }]
}`;

          const text = await callAIGateway({
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
            json: true,
          });
          const parsed = safeJSON(text);
          if (userData.profilePicture) parsed.header.profilePicture = userData.profilePicture;
          return new Response(JSON.stringify(parsed), { headers: { "Content-Type": "application/json" } });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to generate resume" }), { status: 500 });
        }
      },
    },
  },
});
