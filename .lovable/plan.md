## Problem

Right now the entire app lives at `/` (`src/routes/index.tsx`) and renders `src/app/App.tsx`, which switches between 17 "steps" via internal React state. Every screen shows the URL `/`, so deep links, refresh, back/forward and SEO are all broken on Cloudflare.

This is not a Cloudflare/wrangler issue — it's an app architecture issue. Cloudflare is serving the SPA correctly; there is just only one route to serve.

## Approach

Create a TanStack route file per top-level page and let each route render the matching screen component directly. Keep the multi-step **resume builder** flow (Details → Design → Job → Generating → Done) on a single `/resume` route since those steps share heavy state (`userData`, `jobData`, `resumeData`) and aren't meaningful as shareable URLs.

### New route files (one per page)

```
src/routes/
  index.tsx              → / (LandingPage)
  resume.tsx             → /resume (multi-step builder flow, internal state preserved)
  cover-letter.tsx       → /cover-letter
  ats-checker.tsx        → /ats-checker
  examples.tsx           → /examples
  blog.tsx               → /blog
  salary-analyzer.tsx    → /salary-analyzer
  interview-prep.tsx     → /interview-prep
  premium.tsx            → /premium
  about.tsx              → /about
  contact.tsx            → /contact
  privacy.tsx            → /privacy
  terms.tsx              → /terms
```

Each route gets its own `head()` with unique `title`, `description`, `og:title`, `og:description` for SEO.

### Shared layout

Move the `<Header />` from `App.tsx` into `src/routes/__root.tsx` so it shows on every route. The header navigation becomes real `<Link to="/...">` instead of `setStep(...)`.

### Header rewrite

Replace `step`/`setStep` props with TanStack `Link` and `useLocation` for active-state highlighting. Remove `Step` enum dependency.

### Refactor App.tsx

Delete the `App.tsx` switcher. Split its logic:
- The resume builder state + handlers (`userData`, `jobData`, `handleGenerate`, `handlePrint`, CV upload, etc.) move into `/resume` route as a single `ResumeBuilder` component that keeps a local `phase` state for Details/Design/Job/Generating/Done sub-steps.
- The `Step` enum is removed (replaced by routes for top-level pages and a smaller local `phase` union inside the resume builder).
- Other pages (`LandingPage`, `CoverLetterGenerator`, `ATSChecker`, etc.) are rendered directly by their route files. Pages that previously called `setStep(Step.DETAILS)` to start the builder will now use `useNavigate` to go to `/resume`.

### Cover letter

Cover letter generation also needs `userData`/`jobData`. Options:
- Keep its own local state (simpler, user re-enters info) — **chosen** to keep the refactor scoped.
- Or lift to a shared context later if needed.

## Files changed

- **New**: 12 route files listed above
- **Edited**: `src/routes/index.tsx` (just LandingPage), `src/routes/__root.tsx` (add Header + Outlet), `src/app/components/Header.tsx` (Link-based nav)
- **Deleted/Replaced**: `src/app/App.tsx` (logic split into route files), `Step` enum removed
- **Touched**: any child component that calls `setStep(...)` gets a small prop change to either `onAdvance` callback (within resume builder) or `useNavigate` (cross-page jumps)

## Out of scope

- Splitting the resume builder sub-steps into their own URLs (would require persisting form state to URL/storage)
- Server-side route auth changes
- Cloudflare/wrangler config (already correct)

## Verification

After the change: navigate via header, refresh on each page, share a deep link — URL stays correct and the right page renders.
