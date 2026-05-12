import React from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface GeneratingViewProps {
  statusMessage: string;
}

export const GeneratingView: React.FC<GeneratingViewProps> = ({ statusMessage }) => {
  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6 print:hidden relative pt-[68px]"
    >
      <div className="text-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, ease: "linear", repeat: Infinity }}
           className="inline-block mb-8 text-[#FF6321]"
        >
          <Loader2 size={64} className="opacity-80" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Beating the ATS...</h2>
        <p className="text-[#6b7280] max-w-sm mx-auto animate-pulse">{statusMessage}</p>
      </div>
    </motion.div>
  );
}
