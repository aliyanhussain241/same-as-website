import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Step } from "./App";
import { DesignId } from "./components/ResumePreview";

interface DesignSelectionProps {
  designId: DesignId;
  setDesignId: (designId: DesignId) => void;
  setStep: (step: Step) => void;
}

export const DesignSelection: React.FC<DesignSelectionProps> = ({ designId, setDesignId, setStep }) => {
  return (
    <motion.div
      key="design"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto py-12 px-6 print:hidden min-h-screen"
    >
      <div className="flex items-center justify-between mb-12">
         <div>
           <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 02 / 03</span>
           <h2 className="text-4xl font-bold tracking-tight">Choose Design</h2>
         </div>
      </div>

      <div className="bg-white border rounded-3xl p-6 sm:p-8 lg:p-12 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'classic', name: 'Classic', desc: 'Timeless & professional' },
            { id: 'modern', name: 'Modern', desc: 'Bold accents & clean' },
            { id: 'minimal', name: 'Minimal', desc: 'Whitespace focused' },
            { id: 'split', name: 'Split', desc: 'Creative sidebar layout' },
            { id: 'creative-orange', name: 'Creative Orange', desc: 'Curved vibrant sidebar' },
            { id: 'corporate-dark', name: 'Corporate Dark', desc: 'Professional gray & dark' },
            { id: 'modern-block', name: 'Modern Block', desc: 'Clean geometric structure' },
            { id: 'contrast-bold', name: 'Contrast Bold', desc: 'Striking dark & orange' }
          ].map((design) => (
            <div
              key={design.id}
              onClick={() => setDesignId(design.id as DesignId)}
              className={`cursor-pointer rounded-2xl border-2 transition-all p-4 flex flex-col gap-4 ${
                designId === design.id ? 'border-[#FF6321] bg-[#FF6321]/5 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]' : 'border-[#e5e7eb] hover:border-[#d1d5db]'
              }`}
            >
              <div className="bg-[#f5f5f4] rounded-xl h-48 overflow-hidden relative border border-[#f3f4f6] flex items-center justify-center p-2">
                 {design.id === 'classic' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] p-3 flex flex-col gap-2">
                      <div className="text-center mb-1 border-b border-[#1f2937] pb-2">
                         <div className="w-16 h-2 xl:h-2.5 bg-[#111827] mx-auto mb-1"></div>
                         <div className="w-10 h-1 xl:h-1.5 bg-[#6b7280] mx-auto"></div>
                      </div>
                      <div className="w-10 h-1 bg-[#111827] mb-0.5"></div>
                      <div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div>
                      <div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div>
                      <div className="w-3/4 h-1 bg-[#e5e7eb] rounded-sm"></div>
                      <div className="w-12 h-1 bg-[#111827] mt-2 mb-1"></div>
                      <div className="flex justify-between">
                        <div className="w-12 h-1.5 bg-[#1f2937]"></div>
                        <div className="w-8 h-1 bg-[#9ca3af]"></div>
                      </div>
                      <div className="w-8 h-1 bg-[#4b5563] mt-0.5"></div>
                      <div className="w-full h-1 bg-[#e5e7eb] rounded-sm mt-1"></div>
                      <div className="w-5/6 h-1 bg-[#e5e7eb] rounded-sm mt-0.5"></div>
                   </div>
                 )}
                 {design.id === 'modern' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] p-3 flex flex-col gap-2">
                      <div className="border-l-[3px] border-[#FF6321] pl-2 mb-2">
                         <div className="h-2.5 w-1/2 bg-[#111827] mb-1"></div>
                         <div className="h-1.5 w-1/3 bg-[#FF6321]"></div>
                      </div>
                      <div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div>
                      <div className="w-4/5 h-1 bg-[#e5e7eb] rounded-sm"></div>
                      <div className="flex items-center gap-2 mt-2 mb-1">
                         <div className="w-12 h-1.5 bg-[#111827]"></div>
                         <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-12 h-1.5 bg-[#1f2937]"></div>
                         <div className="w-6 h-1 bg-[#d1d5db]"></div>
                      </div>
                      <div className="w-8 h-1 bg-[#FF6321] mt-0.5"></div>
                      <div className="w-full h-1 bg-[#e5e7eb] rounded-sm mt-1"></div>
                      <div className="w-4/5 h-1 bg-[#e5e7eb] rounded-sm mt-0.5"></div>
                   </div>
                 )}
                 {design.id === 'minimal' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2">
                       <div className="text-center mb-4">
                         <div className="h-2 w-16 bg-[#1f2937] mx-auto mb-1.5"></div>
                         <div className="h-1 w-10 bg-[#9ca3af] mx-auto"></div>
                       </div>
                       <div className="w-10 h-0.5 bg-[#d1d5db] mx-auto mb-2 uppercase tracking-widest"></div>
                       <div className="flex gap-3">
                          <div className="w-6 h-1 bg-[#9ca3af] mt-0.5"></div>
                          <div className="flex-1 flex flex-col gap-1">
                             <div className="w-12 h-1.5 bg-[#1f2937]"></div>
                             <div className="w-8 h-1 bg-[#9ca3af]"></div>
                             <div className="h-1 w-full bg-[#e5e7eb] rounded-sm mt-1"></div>
                             <div className="h-1 w-5/6 bg-[#e5e7eb] rounded-sm"></div>
                          </div>
                       </div>
                   </div>
                 )}
                 {design.id === 'split' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex overflow-hidden">
                       <div className="w-[35%] bg-[#1f2937] p-2 flex flex-col gap-1.5 items-center pt-3">
                          <div className="w-8 h-8 rounded-full border-2 border-[#eab308] bg-[#4b5563] mb-1"></div>
                          <div className="w-8 h-1 bg-[#eab308] mt-1 mb-0.5"></div>
                          <div className="w-full h-[1px] bg-[#4b5563]"></div>
                          <div className="w-4/5 h-0.5 bg-[#9ca3af] text-center"></div>
                          <div className="w-4/5 h-0.5 bg-[#9ca3af] text-center"></div>
                          <div className="w-3/5 h-0.5 bg-[#9ca3af] text-center"></div>
                       </div>
                       <div className="w-[65%] p-3 flex flex-col gap-1.5 pt-4">
                          <div className="flex flex-col items-center mb-2">
                            <div className="h-2.5 w-16 bg-[#111827] mb-1"></div>
                            <div className="h-1 w-10 bg-[#eab308]"></div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1 mt-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-[#1f2937] flex items-center justify-center">
                                <div className="w-0.5 h-0.5 bg-[#eab308] rounded-full"></div>
                             </div>
                             <div className="w-10 h-1.5 bg-[#1f2937]"></div>
                          </div>
                          <div className="h-1 w-full bg-[#e5e7eb] rounded-sm"></div>
                          <div className="h-1 w-5/6 bg-[#e5e7eb] rounded-sm"></div>
                          <div className="h-1 w-4/5 bg-[#e5e7eb] rounded-sm"></div>
                       </div>
                   </div>
                 )}
                 {design.id === 'creative-orange' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex overflow-hidden">
                       <div className="w-[35%] bg-[#EA580C] p-2 flex flex-col gap-1 items-center pt-3 rounded-br-2xl rounded-tr-2xl relative">
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 mb-1 z-10 shrink-0"></div>
                          <div className="w-4/5 h-0.5 bg-white/40 mt-1 mb-0.5"></div>
                          <div className="w-3/5 h-[1px] bg-white/20 mb-1"></div>
                          <div className="w-full h-[1px] bg-white/20 mb-0.5 mt-2"></div>
                          <div className="w-4/5 h-0.5 bg-white/40"></div>
                       </div>
                       <div className="w-[65%] p-3 flex flex-col pt-4">
                          <div className="h-2 w-2/3 bg-[#111827] rounded-sm mb-1"></div>
                          <div className="h-1 w-1/3 bg-[#9ca3af] mb-2"></div>
                          <div className="flex items-center gap-1 mb-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></div>
                             <div className="w-10 h-1 bg-[#4b5563]"></div>
                          </div>
                          <div className="h-1 w-full bg-[#e5e7eb] rounded-sm mb-0.5"></div>
                          <div className="h-1 w-5/6 bg-[#e5e7eb] rounded-sm mb-2"></div>
                          <div className="flex items-center gap-1 mb-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></div>
                             <div className="w-12 h-1 bg-[#4b5563]"></div>
                          </div>
                          <div className="h-1 w-full bg-[#e5e7eb] rounded-sm mb-0.5"></div>
                          <div className="h-1 w-4/5 bg-[#e5e7eb] rounded-sm"></div>
                       </div>
                   </div>
                 )}
                 {design.id === 'corporate-dark' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
                       <div className="h-10 bg-[#E5E7EB] flex items-center">
                          <div className="w-[60%] px-2">
                            <div className="h-1 w-1/2 bg-[#1f2937] mb-0.5"></div>
                            <div className="h-0.5 w-full bg-[#9ca3af]"></div>
                            <div className="h-0.5 w-4/5 bg-[#9ca3af] mt-0.5"></div>
                          </div>
                          <div className="w-[40%] px-2 text-right border-l border-white/60">
                            <div className="h-1.5 w-3/4 bg-[#111827] mb-0.5 ml-auto"></div>
                            <div className="h-0.5 w-1/2 bg-[#4b5563] ml-auto"></div>
                          </div>
                       </div>
                       <div className="flex flex-1 relative">
                          <div className="w-[60%] p-2 pt-3 flex flex-col gap-1">
                             <div className="flex items-center gap-1 mb-1">
                                <div className="w-3 h-[1px] bg-[#111827]"></div>
                                <div className="w-8 h-1 bg-[#1f2937]"></div>
                             </div>
                             <div className="w-full h-0.5 bg-[#e5e7eb] mb-0.5"></div>
                             <div className="w-4/5 h-0.5 bg-[#e5e7eb] mb-2"></div>
                          </div>
                          <div className="w-[40%] bg-[#1F2937] p-2 pt-5 relative">
                             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-[3px] border-[#1F2937] bg-white"></div>
                             <div className="w-full h-1 bg-white/20 mb-1 mx-auto mt-2 rounded"></div>
                             <div className="w-4/5 h-[1px] bg-white/40 mb-2 mx-auto"></div>
                          </div>
                       </div>
                   </div>
                 )}
                 {design.id === 'modern-block' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col overflow-hidden p-2 border-t-[3px] border-[#F97316]">
                       <div className="flex gap-2 mb-2">
                          <div className="w-8 h-10 bg-[#e5e7eb] shrink-0"></div>
                          <div className="flex-1 pt-1 justify-center flex flex-col">
                             <div className="h-2 w-4/5 bg-[#111827] mb-1"></div>
                             <div className="h-1 w-1/2 bg-[#F97316] mb-1.5"></div>
                             <div className="h-0.5 w-full bg-[#d1d5db] border-t border-b border-[#f3f4f6] py-0.5"></div>
                          </div>
                       </div>
                       <div className="w-[90%] mx-auto h-2 bg-[#374151] mb-2 px-1 py-0.5 flex items-center justify-center">
                          <div className="w-1/3 h-[1px] bg-white/40"></div>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-[40%]">
                             <div className="w-2/3 h-1 bg-[#F97316] mb-1"></div>
                             <div className="w-full h-0.5 bg-[#e5e7eb] mb-0.5"></div>
                             <div className="w-4/5 h-0.5 bg-[#e5e7eb] mb-1.5"></div>
                          </div>
                          <div className="w-[60%]">
                             <div className="w-3/4 h-1 bg-[#F97316] mb-1"></div>
                             <div className="w-full h-0.5 bg-[#d1d5db] mb-0.5"></div>
                             <div className="w-full h-0.5 bg-[#e5e7eb] mb-0.5"></div>
                             <div className="w-5/6 h-0.5 bg-[#e5e7eb]"></div>
                          </div>
                       </div>
                   </div>
                 )}
                 {design.id === 'contrast-bold' && (
                   <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex overflow-hidden">
                       <div className="w-[45%] flex flex-col relative z-20">
                          <div className="h-12 flex items-center justify-center relative">
                             <div className="w-8 h-8 rounded-full border-[3px] border-[#F97316] bg-white z-10 ml-2 mt-4 shrink-0"></div>
                          </div>
                          <div className="p-2 pt-6">
                             <div className="w-full h-2 bg-[#F97316] rounded-r-full -ml-2 mb-2"></div>
                             <div className="w-5/6 h-0.5 bg-[#9ca3af] mb-1"></div>
                             <div className="w-full h-[1px] bg-[#e5e7eb] mb-2"></div>
                          </div>
                       </div>
                       <div className="w-[55%] bg-[#1F2937] flex flex-col">
                          <div className="h-14 bg-[#F97316] rounded-l-3xl -ml-3 p-2 pl-4 pt-4 flex flex-col [box-shadow:0_1px_3px_0_rgba(0,0,0,0.1)] z-10">
                             <div className="h-1.5 w-11/12 bg-white mb-1"></div>
                             <div className="h-0.5 w-1/2 bg-white/80"></div>
                          </div>
                          <div className="p-2 pl-3 pt-3">
                             <div className="w-4/5 h-1.5 border border-white/20 rounded-full mb-1 inline-block"></div>
                             <div className="w-full h-[1px] bg-white/20 mb-2"></div>
                             <div className="w-3/4 h-1.5 border border-white/20 rounded-full mb-1 inline-block"></div>
                             <div className="w-4/5 h-[1px] bg-white/20"></div>
                          </div>
                       </div>
                   </div>
                 )}
              </div>
              <div className="text-center">
                 <h3 className="font-bold text-[#111827] text-sm mb-1">{design.name}</h3>
                 <p className="text-xs text-[#6b7280]">{design.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#f3f4f6] flex justify-between">
          <button
            onClick={() => setStep(Step.DETAILS)}
            className="flex items-center justify-center w-14 h-14 bg-[#f5f5f4] text-[#0a0a0a] rounded-full hover:bg-[#e5e7eb] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => setStep(Step.JOB)}
            className="group flex items-center gap-4 bg-[#0a0a0a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#FF6321] transition-all"
          >
            Next Step
            <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
