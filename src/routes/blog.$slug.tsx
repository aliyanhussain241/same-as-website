import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

function BlogPost() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data }) => {
        setPost(data as Post);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-[100px] pb-20 px-6 max-w-3xl mx-auto">
        <p className="text-center text-[#6b7280]">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-[100px] pb-20 px-6 max-w-3xl mx-auto">
        <a href="/blog" className="text-[#EA580C] mb-6 text-sm font-medium inline-block">← Back to blog</a>
        <h1 className="text-2xl font-bold text-[#111827]">Post not found.</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-[100px] pb-20 px-6 max-w-3xl mx-auto"
    >
      <a href="/blog" className="text-[#EA580C] mb-6 text-sm font-medium inline-block">← Back to blog</a>

      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-3 text-[#111827]">{post.title}</h1>

      {post.excerpt && (
        <p className="text-lg text-[#6b7280] mb-4">{post.excerpt}</p>
      )}

      {post.published_at && (
        <p className="text-sm text-[#9ca3af] mb-8">
          {new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      )}

      <div className="prose prose-lg max-w-none whitespace-pre-wrap text-[#374151] leading-relaxed">
        {post.content}
      </div>
    </motion.div>
  );
}

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Blog Post — Rezumi" },
      { name: "description", content: "Career tips and resume advice from Rezumi." },
    ],
  }),
  component: BlogPost,
});
