import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { TermsOfService } from "../app/StaticPages";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <TermsOfService onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Rezumi" },
      { name: "description", content: "Rezumi terms of service." },
    ],
  }),
  component: Page,
});
