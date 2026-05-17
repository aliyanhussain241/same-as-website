import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ATSChecker } from "../app/ATSChecker";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <ATSChecker onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/ats-checker")({
  head: () => ({
    meta: [
      { title: "ATS Resume Checker — Rezumi" },
      { name: "description", content: "Check how your resume scores against Applicant Tracking Systems and get instant fixes." },
    ],
  }),
  component: Page,
});
