// The Step enum is preserved here because child components (DetailsForm,
// DesignSelection, JobForm, DoneView, CoverLetterGenerator) import it via
// `import { Step } from "./App"`. Top-level page-switching is now handled
// by TanStack Router routes — see src/routes/ and src/app/lib/navigation.ts.
//
// Step numeric values must stay stable: ResumeExamples / SalaryAnalyzer /
// InterviewGenerator / ATSChecker / StaticPages call `onNavigate(0)`,
// `onNavigate(1)`, `onNavigate(10)`, `onNavigate(11)` with raw numbers.

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
  ATS_CHECKER,
}
