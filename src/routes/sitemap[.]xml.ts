import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://airesumi.com"; 

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/",       changefreq: "weekly",  priority: "1.0" },
          { path: "/resume", changefreq: "monthly", priority: "0.8" },
          { path: "/blog",   changefreq: "weekly",  priority: "0.7" },
          { path: "/blog/how-to-make-resume-with-ai",   changefreq: "monthly", priority: "0.6" },
          { path: "/blog/best-ai-resume-builder-free",  changefreq: "monthly", priority: "0.6" },
          { path: "/blog/ats-resume-guide",             changefreq: "monthly", priority: "0.6" },
        ];

        const today = new Date().toISOString().split("T")[0]; 

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
