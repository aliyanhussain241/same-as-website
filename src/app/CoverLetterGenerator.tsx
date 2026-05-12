import React from "react";
import { motion } from "motion/react";
import { Loader2, UploadCloud, Wand2, Download } from "lucide-react";
import { Step } from "./App";
import { UserData, JobDescription, CoverLetterData } from "./lib/types";

interface CoverLetterGeneratorProps {
  coverLetterState: 'IDLE' | 'GENERATING' | 'DONE';
  coverLetterData: CoverLetterData | null;
  coverLetterTone: string;
  setCoverLetterTone: (tone: string) => void;
  userData: UserData;
  jobData: JobDescription;
  setJobData: React.Dispatch<React.SetStateAction<JobDescription>>;
  setStep: (step: Step) => void;
  error: string;
  isUploading: boolean;
  handleCVUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleGenerateCoverLetter: () => Promise<void>;
  handlePrintCoverLetter: () => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  coverLetterState,
  coverLetterData,
  coverLetterTone,
  setCoverLetterTone,
  userData,
  jobData,
  setJobData,
  setStep,
  error,
  isUploading,
  handleCVUpload,
  handleGenerateCoverLetter,
  handlePrintCoverLetter
}) => {
  return (
    <motion.div
      key="cover_letter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex flex-col min-h-screen ${coverLetterState === 'GENERATING' ? 'items-center justify-center' : ''} bg-[#f9fafb] relative pb-20 pt-[68px]`}
    >
      {coverLetterState === 'IDLE' && (
        <div className="max-w-4xl mx-auto w-full px-6 pt-12">
          <h2 className="text-4xl font-bold tracking-tight mb-2 text-[#0a0a0a]">Cover Letter Generator</h2>
          <p className="text-[#6b7280] mb-8">Generate a matching cover letter using your resume data and the target job description.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Data Review */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">1. Your Profile Data</h3>
                
                {!userData.fullName && !userData.experience[0] ? (
                  <div className="border border-dashed border-[#FF6321] bg-orange-50 rounded-2xl p-6 text-center relative hover:bg-orange-100 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleCVUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                    />
                    
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 size={32} className="text-[#FF6321] animate-spin" />
                        <p className="text-[#FF6321] font-medium text-sm">Extracting CV data via AI...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="bg-white p-3 rounded-full text-[#FF6321] shadow-sm">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#111827]">Upload Resume to Auto-Fill</h4>
                          <p className="text-xs text-[#4b5563] mt-1">PDF, TXT, DOC, DOCX up to 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-sm text-[#4b5563]">
                    <div>
                      <span className="font-semibold text-[#111827]">Name:</span> {userData.fullName || "Not provided"}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">Current Role:</span> {userData.currentRole || "Not provided"}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">Experience Entries:</span> {userData.experience.filter(e => e.trim().length > 0).length}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">Skills Provided:</span> {userData.skills[0] ? "Yes" : "No"}
                    </div>
                    
                    <button 
                      onClick={() => setStep(Step.DETAILS)}
                      className="text-[#FF6321] font-semibold text-xs uppercase tracking-widest mt-2 block hover:underline"
                    >
                      Edit Profile Data
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">3. Select Tone</h3>
                 <div className="flex gap-3">
                   {['Professional', 'Confident', 'Friendly'].map(tone => (
                     <button
                       key={tone}
                       onClick={() => setCoverLetterTone(tone)}
                       className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${coverLetterTone === tone ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'}`}
                     >
                       {tone}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
            
            {/* Right Column: Job Desc & CTA */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">2. Target Job</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#4b5563] mb-1">Job Title</label>
                    <input 
                      value={jobData.title}
                      onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full p-3 bg-[#f3f4f6] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#4b5563] mb-1">Company</label>
                    <input 
                      value={jobData.company}
                      onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="w-full p-3 bg-[#f3f4f6] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#4b5563] mb-1">Job Description</label>
                    <textarea 
                      value={jobData.description}
                      onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                      placeholder="Paste the full job posting..."
                      className="w-full h-32 p-3 bg-[#f3f4f6] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321] resize-none" 
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-[#fef2f2] text-[#dc2626] rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleGenerateCoverLetter}
                disabled={!userData.fullName || !userData.experience[0] || !jobData.description || !jobData.title}
                className="w-full py-4 bg-[#FF6321] hover:bg-[#E85B1F] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                <Wand2 size={20} />
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>
      )}
      
      {coverLetterState === 'GENERATING' && (
        <div className="text-center z-10 p-6 mt-20">
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 2, ease: "linear", repeat: Infinity }}
             className="inline-block mb-6 relative"
          >
            <div className="w-16 h-16 border-4 border-[#e5e7eb] rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#FF6321] rounded-full border-t-transparent absolute top-0 left-0"></div>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-[#111827] mb-2"
          >
            Crafting your Cover Letter...
          </motion.h3>
          <p className="text-[#6b7280] max-w-sm mx-auto animate-pulse">This might take a few seconds as we analyze your profile and tailor the letter.</p>
        </div>
      )}
      
      {coverLetterState === 'DONE' && coverLetterData && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-32 grid lg:grid-cols-3 gap-8 print:block print:p-0 print:m-0 print:max-w-none">
          {/* Left side: Output Letter */}
          <div className="lg:col-span-2 space-y-4 print:space-y-0">
            <div className="flex items-center justify-between print:hidden">
              <h2 className="text-2xl font-bold text-[#111827]">Your Cover Letter</h2>
              <div className="flex gap-2">
                 <button onClick={() => {
                    navigator.clipboard.writeText(coverLetterData.content);
                 }} className="px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#f9fafb]">
                   Copy
                 </button>
                 <button onClick={handlePrintCoverLetter} className="px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#f9fafb]">
                   <Download size={14} /> PDF
                 </button>
                 <button onClick={handleGenerateCoverLetter} className="px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#f9fafb]">
                   <Wand2 size={14} /> Regenerate
                 </button>
              </div>
            </div>
            <div id="cover-letter-document" className="bg-white p-10 rounded-2xl border border-[#e5e7eb] [box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)] min-h-[600px] print:p-0 print:border-none print:[box-shadow:none] print:min-h-auto flex flex-col justify-start pb-20">
              <div 
                contentEditable
                suppressContentEditableWarning
                className="w-full resize-none outline-none text-[#374151] font-sans leading-relaxed text-sm bg-transparent whitespace-pre-wrap print:text-black print:text-[12pt] flex-1"
              >
                {coverLetterData.content}
              </div>
            </div>
          </div>
          
          {/* Right side: Insights */}
          <div className="space-y-6 print:hidden">
             <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">AI Insights</h3>
               
               <div className="space-y-6">
                 <div>
                   <h4 className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-2 text-orange-700 bg-orange-50 px-2 py-1 rounded w-fit">
                     ✓ Matched Skills
                   </h4>
                   <ul className="text-sm text-[#4b5563] space-y-1 list-disc pl-4 marker:text-orange-500">
                     {coverLetterData.insights.matchedSkills.map((s, i) => <li key={i}>{s}</li>)}
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-2 text-[#dc2626] bg-[#fef2f2] px-2 py-1 rounded w-fit">
                     ⚠ Missing Keywords
                   </h4>
                   {coverLetterData.insights.missingKeywords.length > 0 ? (
                     <ul className="text-sm text-[#4b5563] space-y-1 list-disc pl-4 marker:text-red-400">
                       {coverLetterData.insights.missingKeywords.map((s, i) => <li key={i}>{s}</li>)}
                     </ul>
                   ) : (
                     <p className="text-sm text-[#4b5563]">You hit all key requirements!</p>
                   )}
                 </div>
                 
                 <div>
                   <h4 className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-2 text-orange-500 bg-orange-50 px-2 py-1 rounded w-fit">
                     💡 Improvement Tips
                   </h4>
                   <ul className="text-sm text-[#4b5563] space-y-2">
                     {coverLetterData.insights.improvementTips.map((tip, i) => (
                       <li key={i} className="flex gap-2">
                         <span className="text-orange-500">•</span>
                         <span>{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             </div>
             
             <div className="bg-[#111827] p-6 rounded-2xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <h3 className="font-bold text-lg mb-2 relative z-10">Pro Templates & Tones</h3>
               <p className="text-sm text-gray-300 mb-4 relative z-10">Unlock premium cover letter templates, bold rewriting, and unlimited generations.</p>
               <button className="w-full py-2 bg-white text-[#111827] font-bold rounded-lg text-sm transition-transform active:scale-95 relative z-10">
                 Upgrade to Pro
               </button>
             </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
