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
  // Title hamesha meta array se bahar hona chahiye
  title: "AI Resume Builder — Free ATS-Optimized Resumes | airesumi.com",

  meta: [
    {
      name: "description",
      content: "Build a professional, ATS-optimized resume in minutes using AI. Free resume builder trusted by job seekers worldwide. No sign-up required.",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "keywords",
      content: "AI resume builder, free resume builder, ATS resume, resume maker, AI CV builder",
    },
    // Open Graph
    {
      property: "og:title",
      content: "AI Resume Builder — Free ATS-Optimized Resumes | airesumi.com",
    },
    {
      property: "og:description",
      content: "Build a professional, ATS-optimized resume in minutes using AI. Free, no sign-up required.",
    },
    {
      property: "og:url",
      content: "https://airesumi.com/",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:image",
      content: "https://airesumi.com/assets/og-image.png",
    },
    // Twitter
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "AI Resume Builder — Free ATS-Optimized | airesumi.com",
    },
    {
      name: "twitter:description",
      content: "Build a professional ATS-optimized resume in minutes. Free, no sign-up required.",
    },
  ],

  links: [
    {
      rel: "canonical",
      href: "https://airesumi.com/",
    },
  ],

  scripts: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "airesumi",
        url: "https://airesumi.com",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: "AI-powered resume builder that creates ATS-optimized resumes tailored to any job description.",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "120",
        },
      }),
    },
  ],
}),
