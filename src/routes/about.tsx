import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { About } from "../app/StaticPages";
import { useStepNavigate } from "../app/lib/navigation";

function Page() {
  const onNavigate = useStepNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-[#F8FAFC]">
      <About onNavigate={onNavigate} />
    </motion.div>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Rezumi" },
      { name: "description", content: "Learn about Rezumi's mission to help job seekers land remote roles." },
    ],
  }),
  component: Page,
});
