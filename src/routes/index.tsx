import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import "../app/app.css";
import { LandingPage } from "../app/LandingPage";
import { useStepNavigate } from "../app/lib/navigation";

function Index() {
  const [mounted, setMounted] = useState(false);
  const setStep = useStepNavigate();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <LandingPage setStep={setStep} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rezumi — AI Resume Builder for Remote Jobs" },
      { name: "description", content: "Create an ATS-optimized resume in 10 minutes with Rezumi's AI builder." },
    ],
  }),
  component: Index,
});
