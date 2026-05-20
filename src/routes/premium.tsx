import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Crown, FileText, Sparkles, Target } from "lucide-react";

function PremiumPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 md:p-8 text-center bg-[#111827] text-white pt-[68px]"
    >
      <div className="max-w-4xl mt-16 w-full">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-orange-400 font-bold text-sm mb-8 border border-white/10">
          <Crown size={16} className="fill-orange-400" /> airesumi Pro
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-[64px] font-bold tracking-tight mb-6 leading-tight">
          Unlock your full <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">career potential.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Get unlimited AI generations, premium designs, tailored cover letters, and deep career insights.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mb-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
            <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-400 relative z-10"><FileText size={24} /></div>
            <h3 className="text-xl font-bold mb-3 relative z-10">Unlimited Resumes</h3>
            <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Generate as many tailored resumes as you need for different roles and industries.</p>
          </div>
          <div className="bg-white/5 border border-orange-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors shadow-[0_0_40px_rgba(249,115,22,0.1)]">
            <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white relative z-10 shadow-lg shadow-orange-500/30"><Sparkles size={24} /></div>
            <h3 className="text-xl font-bold mb-3 relative z-10">Pro Templates</h3>
            <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Access our full library of ATS-optimized designer templates proven to get interviews.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
            <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-400 relative z-10"><Target size={24} /></div>
            <h3 className="text-xl font-bold mb-3 relative z-10">Auto-Apply Pipeline</h3>
            <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Let our system automatically apply to matching jobs on your behalf every single day.</p>
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/resume" })}
          className="relative w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[18px] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] flex justify-center items-center overflow-hidden group mx-auto mb-20"
        >
          <span className="relative z-10 flex items-center gap-2">Get airesumi Pro <ArrowRight size={20} /></span>
        </button>
      </div>
    </motion.div>
  );
}

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "airesumi Pro — Premium AI Resume Tools | airesumi.com" },
      { name: "description", content: "Unlimited resumes, premium templates, and advanced AI tools with airesumi Pro." },
    ],
links: [{ rel: "canonical", href: "https://airesumi.com/premium" }],
  }),
  component: PremiumPage,
});
