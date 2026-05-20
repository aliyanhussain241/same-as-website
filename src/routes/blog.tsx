import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Blog } from "../app/Blog";

function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Blog />
    </motion.div>
  );
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Career Blog — Rezumi" },
      { name: "description", content: "Expert advice on resumes, interviews, and landing remote jobs." },
      links: [{ rel: "canonical", href: "https://airesumi.com/blog" }],
    ],
  links: [{ rel: "canonical", href: "https://airesumi.com/blog" }],
  }),
  component: Page,
});
