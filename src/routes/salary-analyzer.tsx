import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SalaryAnalyzer } from "../app/SalaryAnalyzer";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <SalaryAnalyzer onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/salary-analyzer")({
  head: () => ({
    meta: [
      { title: "Free Salary Analyzer — Compare Salaries by Role | airesumi.com" },
      { name: "description", content: "Compare salaries across roles, regions, and experience levels." },
    ],
links: [{ rel: "canonical", href: "https://airesumi.com/salary-analyzer" }],
  }),
  component: Page,
});
