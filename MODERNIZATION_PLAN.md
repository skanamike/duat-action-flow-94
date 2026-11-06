# DUAT Website: Modernization & Improvement Plan

_Prepared 2026-11-06 from a review of the code, a production build, lint and type checks, and screenshots of every page at desktop (1440px) and phone (390px) widths._

---

## 1. Where things stand

The site is a Lovable-generated **Vite + React 18 + Tailwind 3 + shadcn/ui** single-page app with 8 routes (`/`, `/product`, `/technology`, `/company`, `/company/team`, `/why-duat`, plus the orphaned `/pantheon` and `/companyv1`). It builds, and the visual base (dark navy and teal) works. Under that, the problems fall into three groups:

| Area | Health | Summary |
|---|---|---|
| Security | 🔴 | A live Hugging Face API token is committed in plain text |
| Broken UX | 🔴 | Phone visitors can't navigate. One CTA is invisible. The contact form always reports success |
| Content credibility | 🟠 | The roadmap is ~18 months stale, there are three brand names, stats have no sources, and AI images contain garbled text |
| SEO / sharing | 🟠 | Client-only SPA, the same title and description on every page, favicon used as the social share image, no sitemap |
| Performance | 🟡 | 565 KB JS bundle (158 KB gzip), unused three.js, 180–300 KB PNGs, no lazy-loading |
| Code health | 🟡 | 3 lint errors, 2 TypeScript errors, 37 of 48 shadcn components unused, debug `console.log`s, toolchain 1–2 majors behind |

---

## 2. Findings (verified)

### 🔴 Critical: fix this week

1. **Leaked API token.** `scripts/generate-images.js:13` hard-codes a Hugging Face token (`hf_Plcx…`). It is in git history, so deleting the file is not enough.
   → **Revoke it at huggingface.co → Settings → Access Tokens**, then read it from `process.env.HF_TOKEN`.
2. **Mobile navigation doesn't exist.** On phones the hamburger icon (`Navigation.tsx`, `aria-label="Open contact form"`) opens the contact form, not a menu. Phone visitors cannot reach Product, Technology, Team, or Why Duat.
3. **Invisible CTA on /product.** "Schedule Executive Briefing" uses `variant="outline"` (white background) with `text-white`, so it renders as a blank white box (visible in the screenshot).
4. **Contact form can't detect failure.** It posts to Zapier with `mode: "no-cors"`, so the response can't be read and a success toast always appears. The toast also tells prospects to _"check … Zapier task history"_.
5. **Horizontal scrolling on phones** on `/company` and `/company/team`.

### 🟠 Credibility and content

6. **Stale timeline.** The /product roadmap shows "**Q1 2025 – CURRENT**", Q2 2025 and Q3–Q4 2025 as future, and "2026 & Beyond". /why-duat calls "2025 the inflection point". Footer reads © 2024. For investors, outdated dates suggest the company has gone quiet.
7. **Brand confusion.** The site uses "DUAT" (nav), "DUATFLOW" (footer), "DuatFlow" (copy), and "AuraChain" (product page). It also links two demo URLs (`demo.duatflow.com` and a Render free-tier app with a "may take 60 seconds to load" warning).
8. **Unsourced claims.** "$4.7T crisis", "$184B lost annually", "69% lack visibility", and "first and only platform" have no citations. "Patented" appears too. Confirm it is _granted_, not _pending_, because the difference matters legally.
9. **AI images with gibberish text.** `disruption-timeline.png` and `sar-intelligence.png` are Stable Diffusion renders full of fake text. Up close they read as filler, which undermines a data-credibility product.
10. **Team page has no photos.** It shows grey placeholder circles. People invest in teams, so this is a high-leverage fix.
11. **Footer links are fake.** "Careers", "Press", "About", and "Risk Management" all open the contact form.
12. **Hero copy is abstract.** "Systems of ProAction … UNIQUE foreknowledge of the best proactions" doesn't say who the product is for or what it does. The existing `duat_optimized_copy.md` has a stronger headline ("Predict Supply Chain Disruptions Months Before They Happen") that never shipped.

### 🟡 Technical

13. **SEO.** Every route serves the same `<title>` and description, and crawlers and LinkedIn previews see an empty `<div id="root">`. `og:image` is the favicon. There is no sitemap.xml, canonical URLs, or structured data.
14. **Navigation uses `<a href>`** instead of router `<Link>`, so every click reloads the whole app.
15. **Bundle.** One 565 KB chunk with no code-splitting. `three`, `@react-three/*`, `recharts`, and `react-day-picker` are installed, and `SpinningEarth` is imported but never rendered.
16. **Images.** 1 MB of PNGs with no WebP/AVIF, no `width`/`height` attributes (layout shift), and no `loading="lazy"`. `/grid.svg` is referenced on 5 pages but doesn't exist.
17. **Analytics.** GA4 loads before any consent, and the `window.gtag` typing is missing (TS errors).
18. **Repo hygiene.** The README is Lovable boilerplate. `netlify.toml`, `public/_redirects`, and `public/vercel.json` cover two hosts. `bun.lockb` and `package-lock.json` are both present. `package.json` name is `vite_react_shadcn_ts`.
19. **Dependency drift.** The latest versions are React 19, Vite 8, Tailwind 4, React Router 7, Zod 4, and ESLint 10. Nothing is end-of-life yet, but the gap widens every month.

---

## 3. Recommended direction

### Strategic decision: framework

| Option | Pros | Cons |
|---|---|---|
| **A. Migrate to Astro 5 + React islands** ⭐ _recommended_ | Static HTML per page (real SEO and link previews), near-zero JS by default, per-page meta built in, content in Markdown/MDX (easy copy edits), reuses existing React/shadcn components as islands, free hosting on Netlify | ~1–2 weeks of effort. **Ends Lovable round-tripping** |
| B. Stay on Vite SPA, add prerendering (`vite-react-ssg`) | Smallest change, keeps the Lovable workflow | Ongoing patching around SPA limits, still ships the React runtime everywhere |
| C. Next.js 15 | Industry standard, good if a logged-in product app will live here | Overkill for a 6-page marketing site, needs a server or more config |

**Why A:** this is a marketing and investor site. Its jobs are to load fast, show well in Google and LinkedIn, and be easy to keep current. Astro is built for exactly that. The product itself (AuraChain/DuatFlow demo) stays a separate app.

> ⚠️ **Decision needed from you:** do you still edit through Lovable? If yes, choose B. If you're moving to code (Claude Code, an IDE), choose A.

### Target information architecture

```
/                Home: problem → solution → proof → CTA (2–3 scrolls)
/product         The platform + live demo + honest status + roadmap
/technology      How it works: SAR, data fusion, digital twin (diagrams)
/company         Mission, story, Team preview
/company/team    Team with real photos, expandable bios
/investors       (rename of /why-duat) market, moat, model, traction
/contact         Dedicated page + calendar booking (keep dialog too)
/privacy         Required once analytics/forms collect personal data
```

Delete `/pantheon` and `/companyv1`, or redirect them to `/company`.

### Design system refresh
- **One brand name** everywhere (decide: company = DUAT, product = DuatFlow?). Replace the CSS-drawn logo with a real SVG logo.
- **Typography:** pair a distinctive display face (e.g. _Space Grotesk_ or _Sora_) with _Inter_ for body text, self-hosted.
- **Imagery:** replace AI renders with **real, honest visuals**: actual SAR tiles (public Sentinel‑1 data), screenshots of the demo, and hand-built SVG diagrams for the supply-chain tiers and detection timeline. Clean diagrams carry more credibility than generated art.
- **Motion:** one restrained hero animation (an SVG or canvas network), with `prefers-reduced-motion` respected. Drop the 8 pulsing dots.
- **Accessibility:** WCAG 2.2 AA contrast check on teal-on-white, visible focus states, skip link, real `<nav>` landmark.

---

## 4. Phased roadmap

### Phase 0: Emergency fixes (½ day) ✅ do first, independent of the framework decision
- [ ] Revoke the HF token; move it to an env var; add `.env.example`
- [ ] Real mobile menu (shadcn `Sheet`, already in the repo)
- [ ] Fix the invisible "Schedule Executive Briefing" button
- [ ] Contact form: switch to a CORS-friendly endpoint (Netlify Forms, Formspree, or a Netlify Function relaying to Zapier) so failures surface; fix the toast copy
- [ ] Fix mobile horizontal overflow on /company and /company/team
- [ ] Update the roadmap dates and footer year (make the year dynamic)
- [ ] Remove debug `console.log`s from `main.tsx`

### Phase 1: Content and credibility (1 week, mostly _your_ input)
- [ ] Decide brand naming; collect a real logo SVG
- [ ] Team headshots and LinkedIn URLs
- [ ] Source every statistic (footnotes or a linked sources section); confirm patent status wording
- [ ] Ship the stronger headline/copy from `duat_optimized_copy.md`
- [ ] Choose one canonical demo URL; move the demo off Render's free tier or add a "waking up…" state
- [ ] Real footer: working links, LinkedIn, contact email, address (West Palm Beach)

### Phase 2: Rebuild on the modern stack (1–2 weeks, assuming Option A)
- [ ] Scaffold Astro 5 + Tailwind 4 + React 19 islands; port the color tokens
- [ ] Port pages to `.astro`/MDX; keep only the shadcn components actually used (~11)
- [ ] Per-page `<title>`, description, canonical, OG/Twitter image (generated per page), JSON-LD `Organization`
- [ ] `@astrojs/sitemap`, robots.txt pointing to it, 301s for retired routes
- [ ] `astro:assets` for automatic AVIF/WebP, sizing, lazy-loading
- [ ] Rebuild diagrams as SVG; replace AI images
- [ ] Consent-aware analytics (GA4 Consent Mode v2, or switch to cookieless Plausible/Umami)
- [ ] One host only (Netlify); remove Vercel/duplicate redirect configs; one lockfile

### Phase 3: Quality gates and growth (ongoing)
- [ ] GitHub Actions CI: typecheck, lint, build, **Lighthouse CI** (budgets: Perf ≥ 95, A11y ≥ 95, SEO = 100), link checker
- [ ] Playwright smoke test: every page renders, the mobile menu works, the form submits
- [ ] Renovate/Dependabot for dependencies
- [ ] Calendar booking (Cal.com/Calendly) on "Schedule Demo"
- [ ] Optional: `/insights` blog in MDX for SEO and thought leadership (supply-chain risk explainers)
- [ ] Optional: investor data-room request flow (gated form)

---

## 5. Success metrics

| Metric | Today | Target |
|---|---|---|
| JS shipped on Home | 158 KB gzip | < 40 KB |
| Lighthouse Performance (mobile) | measure in Phase 2 | ≥ 95 |
| Pages with unique title/description | 0 / 6 | 6 / 6 |
| Pages navigable on phone | Home only | All |
| Contact-form failures detected | 0% | 100% |
| Lint / type errors | 3 / 2 | 0 / 0 |

---

## 6. Open questions for you
1. Lovable: still in use? (decides Option A vs. B)
2. Brand: is "DUAT" the company and "DuatFlow" the product? Where does "AuraChain" fit?
3. Is the patent **granted** or **pending**?
4. Primary audience right now: **investors** or **pilot customers**? (decides what the home-page CTA prioritizes)
5. Which host is live today, Netlify or Vercel? And the production domain?
