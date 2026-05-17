import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { InterviewGenerator } from "../app/InterviewGenerator";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <InterviewGenerator onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/interview-prep")({
  head: () => ({
    meta: [
      { title: "Interview Question Generator — Rezumi" },
      { name: "description", content: "Practice with AI-generated interview questions tailored to your role and seniority." },
    ],
  }),
  component: Page,
});
