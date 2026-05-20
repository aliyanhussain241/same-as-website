import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Wand2, Target, Building2, Search } from "lucide-react";
import { Step } from "./App";
import { JobDescription } from "./lib/types";

interface JobFormProps {
  jobData: JobDescription;
  setJobData: React.Dispatch<React.SetStateAction<JobDescription>>;
  setStep: (step: Step) => void;
  error?: string | null;
  handleGenerate: () => Promise<void>;
}

export const JobForm: React.FC<JobFormProps> = ({ jobData, setJobData, setStep, error, handleGenerate }) => {
  return (
    <motion.div
      key="target-role"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto py-12 px-6 print:hidden min-h-screen"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 03 / 03</span>
          <h2 className="text-4xl font-bold tracking-tight">Target Role</h2>
        </div>
      </div>

      <div className="bg-white border border-[#f3f4f6] rounded-3xl p-6 sm:p-10 lg:p-14 [box-shadow:0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-10 relative overflow-hidden">
        
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-[#FF6321] text-white p-2 rounded-xl shrink-0 mt-1"><Target size={20} /></div>
          <div>
            <h3 className="font-bold text-[#111827] text-lg mb-1">Pass the ATS automatically</h3>
            <p className="text-[#4b5563] text-sm leading-relaxed">Paste the job description below and our AI will tailor your resume to match. <span className="text-[#FF6321] font-semibold">All fields are optional</span> — fill them for a targeted resume, or skip and hit Generate for a general one.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Job Title <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                placeholder="e.g. Senior Frontend Engineer"
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Company Name <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Building2 size={18} />
              </div>
              <input
                type="text"
                className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                placeholder="e.g. Acme Corp"
                value={jobData.company}
                onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
             <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">Job Description <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
          </div>
          <div className="relative">
            <textarea
              rows={8}
              className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-y text-[15px] leading-relaxed placeholder:text-gray-400 relative z-10 bg-transparent"
              placeholder="Paste the full job description here (optional). The more context you provide, the better we can tailor your resume..."
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="bg-[#fef2f2] text-[#dc2626] p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="pt-8 border-t border-[#f3f4f6] flex justify-between items-center">
          <button
            onClick={() => setStep(Step.DESIGN)}
            className="flex items-center gap-2 px-6 py-4 bg-[#f9fafb] border border-gray-100 text-[#4b5563] font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={handleGenerate}
            className="group flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all"
          >
            <Wand2 size={18} className="text-orange-400" />
            Generate Resume
          </button>
        </div>
      </div>
    </motion.div>
  );
}
