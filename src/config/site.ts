/**
 * Single source of truth for site-wide constants. Pages and components import
 * from here instead of hard-coding URLs, names or contact details.
 */

export const SITE = {
  company: "DUAT",
  product: "DuatFlow",
  tagline: "Predict supply chain disruptions months before they happen.",
  description:
    "DUAT's DuatFlow platform combines multimodal satellite (SAR) intelligence, big data and digital twinning to give enterprises complete upstream supply-chain visibility and early warning of disruptions.",
  email: "info@duatflow.com",
  location: "West Palm Beach, Florida",
  foundingYear: 2024,
  analyticsId: "G-LMDZPXWHR6",
} as const;

/** Interactive demo used on /product (DEBT-006: consolidate to one always-on URL). */
export const DEMO_URL = "https://aurachainmonitor-claude-code.onrender.com/";

/** "Watch Demo" link in the home hero (DEBT-006: confirm whether this differs from DEMO_URL). */
export const DEMO_VIDEO_URL = "https://demo.duatflow.com";

/** Same-origin lead-capture endpoint (Netlify Function, ADR-004). */
export const CONTACT_ENDPOINT = "/api/contact";

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Product", href: "/product" },
  { label: "Technology", href: "/technology" },
  { label: "Company", href: "/company" },
  { label: "Team", href: "/company/team" },
  { label: "Why Duat", href: "/why-duat" },
] as const;
