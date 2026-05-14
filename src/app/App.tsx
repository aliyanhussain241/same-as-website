import { motion, AnimatePresence } from "motion/react";
import { FileText, Briefcase, Download, ArrowRight, Loader2, Wand2, ArrowLeft, Star, CheckCircle2, Smartphone, Monitor, Sparkles, CheckCircle, Target, CircleDollarSign, Crown, Search, Send, MessageSquare, Gauge, User, Mail, Phone, Linkedin, Image as ImageIcon, GraduationCap, Code2, UploadCloud, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { CoverLetterData, JobDescription, ResumeData, UserData } from "./lib/types";
import rezumiLogo from "@/assets/rezumi-logo.png";
import { generateCoverLetter, generateOptimizedResume } from "./lib/gemini";
import { ResumePreview, DesignId } from "./components/ResumePreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { Header, Logo } from "./components/Header";
import { SalaryAnalyzer } from './SalaryAnalyzer';
import { InterviewGenerator } from './InterviewGenerator';
import { ResumeExamples } from './ResumeExamples';
import { About, Contact, PrivacyPolicy, TermsOfService } from './StaticPages';
import { ATSChecker } from './ATSChecker';
import { LandingPage } from './LandingPage';
import { DetailsForm } from './DetailsForm';
import { DesignSelection } from './DesignSelection';
import { JobForm } from './JobForm';
import { GeneratingView } from './GeneratingView';
import { DoneView } from './DoneView';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { Blog } from './Blog';

export enum Step {
  LANDING,
  DETAILS,
  DESIGN,
  JOB,
  GENERATING,
  DONE,
  COVER_LETTER,
  BLOG,
  PREMIUM,
  SALARY_ANALYZER,
  INTERVIEW_PREP,
  RESUME_EXAMPLES,
  ABOUT,
  CONTACT,
  PRIVACY,
  TERMS,
  ATS_CHECKER
}

export default function App() {
  const [step, setStep] = useState<Step>(Step.LANDING);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [designId, setDesignId] = useState<DesignId>('classic');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    currentRole: "",
    skills: [""],
    experience: [""],
    education: "",
  });
  const [jobData, setJobData] = useState<JobDescription>({
    title: "",
    company: "",
    description: "",
  });
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [coverLetterState, setCoverLetterState] = useState<'IDLE' | 'GENERATING' | 'DONE'>('IDLE');
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
  const [coverLetterTone, setCoverLetterTone] = useState<string>('Professional');

  // Add CV uploading state
  const [isUploading, setIsUploading] = useState(false);

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload CV");
      }

      const parsedData = await response.json();
      
      // Update userData with the parsed data
      setUserData(prev => ({
        ...prev,
        fullName: parsedData.fullName || prev.fullName,
        email: parsedData.email || prev.email,
        phone: parsedData.phone || prev.phone,
        linkedin: parsedData.linkedin || prev.linkedin,
        currentRole: parsedData.currentRole || prev.currentRole,
        skills: Array.isArray(parsedData.skills) && parsedData.skills.length > 0 ? parsedData.skills : prev.skills,
        experience: Array.isArray(parsedData.experience) && parsedData.experience.length > 0 ? parsedData.experience : prev.experience,
        education: parsedData.education || prev.education,
      }));

    } catch (err: any) {
      setError(err.message || "Something went wrong parsing your CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    setStep(Step.GENERATING);
    setError(null);
    try {
      const data = await generateOptimizedResume(userData, jobData, setStatusMessage);
      setResumeData(data);
      setStep(Step.DONE);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStep(Step.JOB);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setCoverLetterState('GENERATING');
    setError(null);
    try {
      const data = await generateCoverLetter(userData, jobData, coverLetterTone, setStatusMessage);
      setCoverLetterData(data);
      setCoverLetterState('DONE');
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setCoverLetterState('IDLE');
    }
  };

  const handleLoadTemplate = (selectedResume: any) => {
    const firstName = "Alex";
    const lastName = "Doe";
    const name = `${firstName} ${lastName}`;
    const role = selectedResume.title?.replace(" Resume Example", "") || "Professional";

    const newUserData = {
      fullName: name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: "(555) 012-3456",
      linkedin: `/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      currentRole: role,
      skills: selectedResume.keywords || ["Leadership", "Communication"],
      experience: [
        `Senior ${role} at TechCorp Inc\n- Architected core platform handling 500K daily requests, reducing processing times by 40%\n- Led team of 4 professionals delivering $2M product feature on time and 15% under budget\n- Improved operational efficiency by 60% using automation and industry best practices`,
        `${role} at StartupXYZ\n- Built end-to-end solutions serving 2M+ monthly active users with 99.9% uptime\n- Reduced infrastructure costs by $180K/year through extensive performance optimization\n- Mentored 3 junior team members; 2 promoted within 12 months`
      ],
      education: "B.S. in Related Field — State University (2019)",
    };

    const newResumeData = {
      header: {
        fullName: name,
        contactInfo: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com • (555) 012-3456 • LinkedIn: /in/${firstName.toLowerCase()}${lastName.toLowerCase()} • GitHub: /${firstName.toLowerCase()}${lastName.toLowerCase()}\nSan Francisco, CA`,
        title: role,
      },
      summary: `Results-driven ${role} with 5+ years of experience building scalable applications and driving business outcomes. Proven track record of reducing system latency by 40% and delivering high-impact features used by 2M+ users. Expertise aligned perfectly with ${selectedResume.industry || "Software"} requirements.`,
      experience: [
        {
          title: `Senior ${role}`,
          company: "TechCorp Inc",
          dateRange: "Jan 2022 – Present",
          bullets: [
            "Architected core platform handling 500K daily requests, reducing processing times by 40%",
            "Led team of 4 professionals delivering $2M product feature on time and 15% under budget",
            "Improved operational efficiency by 60% using automation and industry best practices"
          ]
        },
        {
          title: role,
          company: "StartupXYZ",
          dateRange: "Mar 2020 – Dec 2021",
          bullets: [
            "Built end-to-end solutions serving 2M+ monthly active users with 99.9% uptime",
            "Reduced infrastructure costs by $180K/year through extensive performance optimization",
            "Mentored 3 junior team members; 2 promoted within 12 months"
          ]
        }
      ],
      education: [
        {
          degree: "B.S. in Related Field",
          institution: "State University",
          dateRange: "2019"
        }
      ],
      skills: [
        {
          category: "Core Competencies",
          items: selectedResume.keywords || ["Leadership", "Communication"]
        }
      ]
    };

    setUserData(newUserData);
    setResumeData(newResumeData);
    setStep(Step.DONE);
  };

  const handlePrint = async () => {
    let input = document.getElementById('resume-document');
    if (!input) input = document.getElementById('resume-document-mobile');

    if (input) {
      try {
        const dataUrl = await toPng(input, { pixelRatio: 2, backgroundColor: '#ffffff' });
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const width = input.offsetWidth;
        const height = input.offsetHeight;
        const pdfHeight = (height * pdfWidth) / width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${userData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  const handlePrintCoverLetter = async () => {
    const input = document.getElementById('cover-letter-document');
    if (input) {
      try {
        const dataUrl = await toPng(input, { pixelRatio: 2, backgroundColor: '#ffffff' });
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const width = input.offsetWidth;
        const height = input.offsetHeight;
        const pdfHeight = (height * pdfWidth) / width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${userData.fullName.replace(/\s+/g, '_')}_Cover_Letter.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-[#FF6321] selection:text-white print:bg-white print:m-0 print:p-0">
      <Header step={step} setStep={setStep} windowWidth={windowWidth} />
      <AnimatePresence mode="wait">
        {/* LANDING PAGE */}
        {step === Step.LANDING && <LandingPage setStep={setStep} />}

        {/* DETAILS ENTRY STEP */}
        {step === Step.DETAILS && (
          <DetailsForm
            userData={userData}
            setUserData={setUserData}
            setStep={setStep}
            isUploading={isUploading}
            handleCVUpload={handleCVUpload}
          />
        )}

        {/* DESIGN SELECTION STEP */}
        {step === Step.DESIGN && (
          <DesignSelection
            designId={designId}
            setDesignId={setDesignId}
            setStep={setStep}
          />
        )}

        {/* JOB INPUT STEP */}
        {step === Step.JOB && (
          <JobForm
            jobData={jobData}
            setJobData={setJobData}
            setStep={setStep}
            error={error}
            handleGenerate={handleGenerate}
          />
        )}

        {/* GENERATING STEP */}
        {step === Step.GENERATING && (
          <GeneratingView statusMessage={statusMessage} />
        )}

        {/* DONE STEP */}
        {step === Step.DONE && resumeData && (
          <DoneView
            resumeData={resumeData}
            setStep={setStep}
            designId={designId}
            setDesignId={setDesignId}
            handlePrint={handlePrint}
          />
        )}

        {/* COVER LETTER PAGE */}
        {step === Step.COVER_LETTER && (
          <CoverLetterGenerator
            coverLetterState={coverLetterState}
            coverLetterData={coverLetterData}
            coverLetterTone={coverLetterTone}
            setCoverLetterTone={setCoverLetterTone}
            userData={userData}
            jobData={jobData}
            setJobData={setJobData}
            setStep={setStep}
            error={error}
            isUploading={isUploading}
            handleCVUpload={handleCVUpload}
            handleGenerateCoverLetter={handleGenerateCoverLetter}
            handlePrintCoverLetter={handlePrintCoverLetter}
          />
        )}

        {/* BLOG PAGE */}
        {step === Step.BLOG && (
          <motion.div
            key="blog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Blog />
          </motion.div>
        )}

        {/* PREMIUM PAGE */}
        {step === Step.PREMIUM && (
          <motion.div
            key="premium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 md:p-8 text-center bg-[#111827] text-white pt-[68px]"
          >
            <div className="max-w-4xl mt-16 w-full">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-orange-400 font-bold text-sm mb-8 border border-white/10">
                <Crown size={16} className="fill-orange-400" /> ResuBeat Pro
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-[64px] font-bold tracking-tight mb-6 leading-tight">
                Unlock your full <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">career potential.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Get unlimited AI generations, premium designs, tailored cover letters, and deep career insights.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mb-16">
                 {/* Feature 1 */}
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-400 relative z-10">
                       <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 relative z-10">Unlimited Resumes</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Generate as many tailored resumes as you need for different roles and industries.</p>
                 </div>
                 
                 {/* Feature 2 */}
                 <div className="bg-white/5 border border-orange-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white relative z-10 shadow-lg shadow-orange-500/30">
                       <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 relative z-10">Pro Templates</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Access our full library of ATS-optimized designer templates proven to get interviews.</p>
                 </div>
                 
                 {/* Feature 3 */}
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-400 relative z-10">
                       <Target size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 relative z-10">Auto-Apply Pipeline</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Let our system automatically apply to matching jobs on your behalf every single day.</p>
                 </div>
              </div>
              
              <button className="relative w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[18px] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] flex justify-center items-center overflow-hidden group mx-auto mb-20">
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-2">Get ResuBeat Pro <ArrowRight size={20} /></span>
              </button>
            </div>
          </motion.div>
        )}

        {/* SALARY ANALYZER PAGE */}
        {step === Step.SALARY_ANALYZER && (
          <motion.div
            key="salary-analyzer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <SalaryAnalyzer onNavigate={setStep} />
          </motion.div>
        )}

        {/* INTERVIEW GENERATOR PAGE */}
        {step === Step.INTERVIEW_PREP && (
          <motion.div
            key="interview-generator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <InterviewGenerator onNavigate={setStep} />
          </motion.div>
        )}

        {/* RESUME EXAMPLES PAGE */}
        {step === Step.RESUME_EXAMPLES && (
          <motion.div
            key="resume-examples"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <ResumeExamples onNavigate={setStep} onLoadTemplate={handleLoadTemplate} />
          </motion.div>
        )}
        {/* ABOUT */}
        {step === Step.ABOUT && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <About onNavigate={setStep} />
          </motion.div>
        )}

        {/* CONTACT */}
        {step === Step.CONTACT && (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <Contact onNavigate={setStep} />
          </motion.div>
        )}

        {/* PRIVACY */}
        {step === Step.PRIVACY && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <PrivacyPolicy onNavigate={setStep} />
          </motion.div>
        )}

        {/* TERMS */}
        {step === Step.TERMS && (
          <motion.div
            key="terms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <TermsOfService onNavigate={setStep} />
          </motion.div>
        )}

        {/* ATS CHECKER */}
        {step === Step.ATS_CHECKER && (
          <motion.div
            key="ats-checker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#F8FAFC]"
          >
            <ATSChecker onNavigate={setStep} />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer setStep={setStep} />
    </div>
  );
}

const Footer = ({ setStep }: { setStep: (step: Step) => void }) => (
  <footer className="bg-white border-t border-gray-100 py-16 w-full print:hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-[#4b5563]">
        <div className="space-y-4">
          <div className="flex items-center">
            <img src={rezumiLogo} alt="Rezumi - AI Resume Builder" className="h-12 w-auto" />
          </div>
          <p className="text-[15px] leading-relaxed">
            The fastest, most effective way to secure your next role. Built with top recruiters and AI.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-[#1a202c] mb-6">Product</h4>
          <ul className="space-y-4 text-[15px]">
              <li><button onClick={() => setStep(Step.DETAILS)} className="hover:text-[#FF6321] transition-colors text-left">Resume Builder</button></li>
              <li><button onClick={() => setStep(Step.COVER_LETTER)} className="hover:text-[#FF6321] transition-colors text-left">Cover Letter</button></li>
              <li><button onClick={() => setStep(Step.ATS_CHECKER)} className="hover:text-[#FF6321] transition-colors text-left">ATS Resume Checker</button></li>
              <li><button onClick={() => setStep(Step.PREMIUM)} className="hover:text-[#FF6321] transition-colors text-left">Rezumi Pro</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#1a202c] mb-6">Resources</h4>
          <ul className="space-y-4 text-[15px]">
              <li><button onClick={() => setStep(Step.BLOG)} className="hover:text-[#FF6321] transition-colors text-left">Career Blog</button></li>
              <li><button onClick={() => setStep(Step.RESUME_EXAMPLES)} className="hover:text-[#FF6321] transition-colors text-left">Resume Examples</button></li>
              <li><button onClick={() => setStep(Step.INTERVIEW_PREP)} className="hover:text-[#FF6321] transition-colors text-left">Interview Questions</button></li>
              <li><button onClick={() => setStep(Step.SALARY_ANALYZER)} className="hover:text-[#FF6321] transition-colors text-left">Salary Analyzer</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#1a202c] mb-6">Company</h4>
          <ul className="space-y-4 text-[15px]">
              <li><button onClick={() => setStep(Step.ABOUT)} className="hover:text-[#FF6321] transition-colors text-left">About Us</button></li>
              <li><button onClick={() => setStep(Step.CONTACT)} className="hover:text-[#FF6321] transition-colors text-left">Contact</button></li>
              <li><button onClick={() => setStep(Step.PRIVACY)} className="hover:text-[#FF6321] transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => setStep(Step.TERMS)} className="hover:text-[#FF6321] transition-colors text-left">Terms of Service</button></li>
          </ul>
        </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div>&copy; {new Date().getFullYear()} Rezumi. All rights reserved.</div>
        <div className="flex gap-6">
            <button onClick={() => setStep(Step.PRIVACY)} className="hover:text-[#1a202c] transition-colors">Privacy</button>
            <button onClick={() => setStep(Step.TERMS)} className="hover:text-[#1a202c] transition-colors">Terms</button>
        </div>
    </div>
  </footer>
);
