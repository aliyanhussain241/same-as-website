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

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, ' ')} | airesumi.com` },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "canonical", href: `https://airesumi.com/blog/${params.slug}` },
    ],
  }),
  component: Page,
});
