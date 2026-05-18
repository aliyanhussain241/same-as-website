import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import "../app/app.css";
import { Step } from "../app/App";
import { CoverLetterData, JobDescription, ResumeData, UserData } from "../app/lib/types";
import { generateOptimizedResume } from "../app/lib/gemini";
import { DesignId } from "../app/components/ResumePreview";
import { DetailsForm } from "../app/DetailsForm";
import { DesignSelection } from "../app/DesignSelection";
import { JobForm } from "../app/JobForm";
import { GeneratingView } from "../app/GeneratingView";
import { DoneView } from "../app/DoneView";

type Phase = Step.DETAILS | Step.DESIGN | Step.JOB | Step.GENERATING | Step.DONE;

function ResumeBuilder() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>(Step.DETAILS);
  const [designId, setDesignId] = useState<DesignId>("classic");
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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => setMounted(true), []);

  // Adapter that lets child components keep using `setStep(Step.X)`.
  // In-flow steps update local phase; out-of-flow steps navigate away.
  const setStep = (target: Step) => {
    switch (target) {
      case Step.DETAILS:
      case Step.DESIGN:
      case Step.JOB:
      case Step.GENERATING:
      case Step.DONE:
        setPhase(target);
        return;
      case Step.LANDING:
        navigate({ to: "/" });
        return;
      case Step.COVER_LETTER:
        navigate({ to: "/cover-letter" });
        return;
      case Step.BLOG:
        navigate({ to: "/blog" });
        return;
      case Step.PREMIUM:
        navigate({ to: "/premium" });
        return;
      case Step.SALARY_ANALYZER:
        navigate({ to: "/salary-analyzer" });
        return;
      case Step.INTERVIEW_PREP:
        navigate({ to: "/interview-prep" });
        return;
      case Step.RESUME_EXAMPLES:
        navigate({ to: "/examples" });
        return;
      case Step.ABOUT:
        navigate({ to: "/about" });
        return;
      case Step.CONTACT:
        navigate({ to: "/contact" });
        return;
      case Step.PRIVACY:
        navigate({ to: "/privacy" });
        return;
      case Step.TERMS:
        navigate({ to: "/terms" });
        return;
      case Step.ATS_CHECKER:
        navigate({ to: "/ats-checker" });
        return;
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const response = await fetch("/api/upload-cv", { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload CV");
      }
      const parsed = await response.json();
      setUserData((prev) => ({
        ...prev,
        fullName: parsed.fullName || prev.fullName,
        email: parsed.email || prev.email,
        phone: parsed.phone || prev.phone,
        linkedin: parsed.linkedin || prev.linkedin,
        currentRole: parsed.currentRole || prev.currentRole,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : prev.skills,
        experience: Array.isArray(parsed.experience) && parsed.experience.length > 0 ? parsed.experience : prev.experience,
        education: parsed.education || prev.education,
      }));
    } catch (err: any) {
      setError(err.message || "Something went wrong parsing your CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    setPhase(Step.GENERATING);
    setError(null);
    try {
      const data = await generateOptimizedResume(userData, jobData, setStatusMessage);
      setResumeData(data);
      setPhase(Step.DONE);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setPhase(Step.JOB);
    }
  };

  const handlePrint = async () => {
    let input = document.getElementById("resume-document");
    if (!input) input = document.getElementById("resume-document-mobile");
    if (input) {
      try {
        const dataUrl = await toPng(input, { pixelRatio: 2, backgroundColor: "#ffffff" });
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (input.offsetHeight * pdfWidth) / input.offsetWidth;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${userData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        window.print();
      }
    } else {
      window.print();
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {phase === Step.DETAILS && (
        <DetailsForm
          userData={userData}
          setUserData={setUserData}
          setStep={setStep}
          isUploading={isUploading}
          handleCVUpload={handleCVUpload}
        />
      )}
      {phase === Step.DESIGN && (
        <DesignSelection designId={designId} setDesignId={setDesignId} setStep={setStep} />
      )}
      {phase === Step.JOB && (
        <JobForm
          jobData={jobData}
          setJobData={setJobData}
          setStep={setStep}
          error={error}
          handleGenerate={handleGenerate}
        />
      )}
      {phase === Step.GENERATING && <GeneratingView statusMessage={statusMessage} />}
      {phase === Step.DONE && resumeData && (
        <DoneView
          resumeData={resumeData}
          setStep={setStep}
          designId={designId}
          setDesignId={setDesignId}
          handlePrint={handlePrint}
        />
      )}
    </AnimatePresence>
  );
}

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Create Your Resume — AI-Powered Resume Builder | airesumi.com" },
      { name: "description", content: "Let AI write your resume for you. Tailored to your job, ATS-friendly, and ready to download in minutes." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Create Your Resume — AI Resume Builder | airesumi.com" },
      { property: "og:description", content: "AI-powered resume builder. ATS-optimized, free, no sign-up needed." },
      { property: "og:url", content: "https://airesumi.com/resume" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/assets/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://airesumi.com/resume" },
    ],
  }),
  component: Resume,
});
