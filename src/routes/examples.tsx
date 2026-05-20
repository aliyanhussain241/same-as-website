import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ResumeExamples } from "../app/ResumeExamples";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <ResumeExamples onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: "Resume Examples by Role — Rezumi" },
      { name: "description", content: "Browse high-impact resume examples across industries and use them as a starting point." },
    ],
 links: [{ rel: "canonical", href: "https://airesumi.com/examples" }],
  }),
  component: Page,
});
