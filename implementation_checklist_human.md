# DUAT Website: Human-in-the-Loop Implementation Checklist

**Purpose:** Track all manual tasks, API configuration, external tool setup, and decision-making points that require human intervention.

**How to Use:**
- Check off each task as you complete it
- Store API keys securely (never commit to git)
- Document decisions made for team reference
- Coordinate with Copilot on `implementation_checklist_ai.md` tasks

---

## 🔐 **WEEK 1: CRITICAL INFRASTRUCTURE SETUP**

### **TASK 5.1: Analytics Setup & Baseline Capture**
- **Status:** ⬜ Not Started
- **Timeline:** Day 1-2
- **Owner:** Marketing/Product Lead
- **Dependencies:** None

#### **Step 1: Choose Analytics Platform**
- [ ] **Option A: Google Analytics 4** (Free, recommended for SaaS)
  - Create Google Analytics 4 property
  - Setup web data stream
  - Get measurement ID: `G-XXXXXXXXXX`
  - Install gtag.js in `_document.tsx`

- [ ] **Option B: Mixpanel** (Advanced, paid)
  - Create Mixpanel account
  - Get project token
  - Install Mixpanel SDK
  - Decision: Which platform? → **DECISION: [Your choice here]**

- [ ] **Option C: Segment** (Event router, advanced)
  - Create Segment workspace
  - Configure analytics destinations
  - Install Segment SDK
  - Decision: Use Segment as router? → **DECISION: [Yes/No]**

**Recommended:** Google Analytics 4 (free, sufficient for MVP, integrates with Google Ads)

#### **Step 2: Environment Setup**
```bash
# File: .env.local (ADD TO .gitignore!)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_PLATFORM=ga4  # or mixpanel, segment
```

**Security:** 
- [ ] `.env.local` added to `.gitignore`
- [ ] Never commit API keys to git
- [ ] Use GitHub Secrets for production environment

#### **Step 3: Install Analytics Library**
Choose based on platform selected above.

#### **Step 4: Baseline Metrics Capture**
**Current State Assessment** (Document these numbers):

```markdown
### Current Performance Baseline

**Google Analytics Metrics (if not available, use Lighthouse):**
- Sessions per day: ___________
- Bounce rate: ___________
- Avg. session duration: ___________
- Users per day: ___________

**Conversion Metrics:**
- Demo request form submissions per week: ___________
- Contact form submissions per week: ___________
- Newsletter signups per week: ___________
- CTA click-through rate: ___________

**Technical Metrics (Lighthouse):**
- Performance score: ___________
- Accessibility score: ___________
- Best Practices score: ___________
- SEO score: ___________
- Core Web Vitals:
  - LCP (Largest Contentful Paint): ___________
  - FID (First Input Delay): ___________
  - CLS (Cumulative Layout Shift): ___________

**Date Captured:** ___________
**Tool Used:** ___________
**Notes:** ___________
```

**How to Capture Baseline:**
1. Run Lighthouse audit: DevTools → Lighthouse → Generate report
2. Take screenshots of metrics
3. Note current form submission rates (if available in current system)
4. Document in this checklist above

**Subtasks:**
- [ ] 5.1a - Choose analytics platform and document decision
- [ ] 5.1b - Create analytics account and get credentials
- [ ] 5.1c - Document API keys securely (add to team secret manager)
- [ ] 5.1d - Run Lighthouse audit and capture baseline
- [ ] 5.1e - Run Google Analytics audit (if using GA4)
- [ ] 5.1f - Document all baseline metrics in section above
- [ ] 5.1g - Create analytics dashboard (optional but recommended)

**Deliverable:** Baseline metrics document with all numbers captured

---

### **TASK 5.2: Analytics Event Tracking Implementation**
- **Status:** ⬜ Not Started (Depends on Task 5.1)
- **Timeline:** Day 3-5
- **Owner:** Product/Engineering Lead + Marketing
- **Dependencies:** Task 5.1 (analytics platform chosen)

#### **Step 1: Define Event Taxonomy**

```markdown
### Event Tracking Map

**Page Views:**
- Event: page_view
- Properties: page_path, page_title

**CTA Clicks:**
- Event: cta_clicked
- Properties: cta_text, cta_location (hero, features, footer), target_page

**Form Events:**
- Event: contact_form_opened
- Properties: form_location, form_type
- Event: contact_form_submitted
- Properties: form_fields (name, email, company), submission_time
- Event: contact_form_error
- Properties: error_type, field_with_error

**Demo Interaction:**
- Event: demo_opened
- Properties: demo_type (modal, fullscreen)
- Event: demo_closed
- Properties: time_spent_seconds

**Navigation:**
- Event: nav_menu_clicked
- Properties: menu_item, menu_section

**Newsletter:**
- Event: newsletter_signup_attempted
- Properties: signup_location
- Event: newsletter_signup_success
- Properties: email_domain

**Technical Events (performance):**
- Event: page_load_time
- Properties: page_path, load_time_ms
- Event: core_web_vitals
- Properties: lcp, fid, cls
```

**Subtasks:**
- [ ] 5.2a - Define event taxonomy with team
- [ ] 5.2b - Document all events in analytics platform
- [ ] 5.2c - Create event tracking spreadsheet for developers
- [ ] 5.2d - Share event specs with Copilot for Task 2.2 implementation
- [ ] 5.2e - Validate events firing correctly (use browser console/DevTools)
- [ ] 5.2f - Set up analytics dashboard views for key events
- [ ] 5.2g - Create event tracking documentation for team

**Deliverable:** Event taxonomy spreadsheet and dashboard setup

---

## 🎨 **WEEK 2: DESIGN ASSET DELIVERY**

### **TASK 4.1: Generate AI Images (Week 1)**
- **Status:** ⬜ Not Started
- **Timeline:** Day 5-7
- **Owner:** Design/Marketing Lead
- **Tool:** Midjourney or DALL-E 3

**Reference:** `duat_visual_assets_guide.md` Images 1-5, 8-10

**What to Generate:**
- [ ] IMAGE 1: Hero Background Animation (MP4/WebM)
- [ ] IMAGE 2: Supply Chain Flow Diagram
- [ ] IMAGE 3: Disruption Detection Timeline
- [ ] IMAGE 4: SAR Intelligence Visualization
- [ ] IMAGE 5: Cascade Risk Domino Effect
- [ ] IMAGE 8: Hero Stat Callout Cards (set of 4)
- [ ] IMAGE 9: Reactive vs Proactive Comparison
- [ ] IMAGE 10: Platform Dashboard Mockup

**Steps:**
1. Subscribe to Midjourney ($30/month) or use DALL-E 3 credits
2. Use exact prompts from `duat_visual_assets_guide.md`
3. Generate 2-3 variations per image
4. Select best versions with team approval
5. Export at specified dimensions (1920x1080+ minimum)
6. Convert to WebP format for web optimization
7. Verify file sizes (<2MB for web)

**Subtasks:**
- [ ] 4.1a - Subscribe to Midjourney or setup DALL-E
- [ ] 4.1b - Generate IMAGE 1 (Hero) - 3 variations
- [ ] 4.1c - Generate IMAGE 2 (Supply Chain Flow)
- [ ] 4.1d - Generate IMAGE 3 (Timeline)
- [ ] 4.1e - Generate IMAGE 4 (SAR Intelligence)
- [ ] 4.1f - Generate IMAGE 5 (Cascade Effect)
- [ ] 4.1g - Generate IMAGE 8 (Stat Cards)
- [ ] 4.1h - Generate IMAGE 9 (Reactive vs Proactive)
- [ ] 4.1i - Generate IMAGE 10 (Dashboard)
- [ ] 4.1j - Get team approval on final selections
- [ ] 4.1k - Convert all images to WebP + optimize
- [ ] 4.1l - Store in assets folder and commit to git

**Decision Points:**
- **Which Midjourney variations to use?** → IMAGE 1: [Variation A/B/C]
- **Animation hero background or static?** → **DECISION: [Animated/Static]**
- **Dashboard mockup - show real data or placeholder?** → **DECISION: [Real/Placeholder]**

**Deliverable:** 8+ optimized images in WebP format, <2MB each

---

### **TASK 4.2: Create Icon System (Week 2)**
- **Status:** ⬜ Not Started
- **Timeline:** Day 8-10
- **Owner:** Design Lead
- **Tool:** Figma, Adobe Illustrator, or Icon8

**Reference:** `duat_visual_assets_guide.md` IMAGE 6

**Icons to Create:** 12 icons (all specifications in guide)

1. Early Warning / Clock
2. Shield / Protection
3. Supply Chain Network
4. Satellite
5. AI / Neural Network
6. Automation / Gears
7. Financial / Margin Protection
8. Global Coverage
9. Risk Detection
10. Material Flow
11. Bottleneck Detection
12. Predictive Analytics

**Steps:**
1. Create Figma project for icon system
2. Set up 128x128px artboard
3. Design all 12 icons with consistent stroke weight (2-3px)
4. Use teal color (#00BCD4) for primary
5. Export as SVG (preferred) + PNG with transparency
6. Organize in folder structure

**Design Specs:**
```
Icon Specifications:
- Size: 128x128px (vector, scalable)
- Style: Line/outline (not filled)
- Color: Teal (#00BCD4) primary
- Stroke: 2-3px consistent
- Format: SVG (preferred) or PNG
- Padding: 16px from edges
```

**File Structure:**
```
assets/
├── icons/
│   ├── icon_01_early_warning.svg
│   ├── icon_02_shield.svg
│   ├── ...
│   └── icon_12_predictive.svg
└── icons_manifest.json (index of all icons)
```

**Subtasks:**
- [ ] 4.2a - Create Figma project for icons
- [ ] 4.2b - Design 12 icons (or outsource to designer)
- [ ] 4.2c - Get design review from team
- [ ] 4.2d - Export all as SVG + PNG
- [ ] 4.2e - Verify consistent style and sizing
- [ ] 4.2f - Create icons_manifest.json for reference
- [ ] 4.2g - Upload to assets folder
- [ ] 4.2h - Test rendering in web components

**Decision Points:**
- **Outsource icon design or create in-house?** → **DECISION: [Outsource/In-house]**
- **SVG or PNG primary format?** → **DECISION: [SVG/PNG]**

**Deliverable:** 12 SVG icons in assets folder

---

### **TASK 4.3: Team Photography Shoot (Week 2-3)**
- **Status:** ⬜ Not Started
- **Timeline:** Day 10-14
- **Owner:** Marketing Lead + HR (team coordination)
- **Reference:** `duat_visual_assets_guide.md` IMAGE 7

**Team Members (7 total):**
1. Michael Weinberg - CEO
2. Scott Jobe - CTO
3. Zack Zondlo - CIO and Chief AI Architect
4. Mark Rogers - GTM and Operational Advisor
5. Ruben Villa - Agricultural Supply Chain Strategist
6. Dean Evans - Marketing Advisor
7. Andreas Welsch - AI Advisor

**Options:**

#### **Option A: Professional Photographer (Recommended)**
- [ ] Request quotes from 3+ photographers
- [ ] Budget: $1,500-3,000 per session
- [ ] Schedule 2-3 hour session
- [ ] Studio or on-location (office preferred)
- [ ] Include styling/hair guidance

#### **Option B: DIY with iPhone + Professional Editing**
- [ ] Use iPhone 14+ Pro with portrait mode
- [ ] Professional backdrop ($50-100)
- [ ] Natural window lighting
- [ ] Hire post-production editor ($200-500)
- [ ] Budget: $300-600 total

#### **Decision:** → **OPTION: [A/B]**

**Photographer Brief:**
```
"We need professional headshots for a B2B SaaS company 
in the supply chain intelligence space. Tone should be 
confident and credible but not stiff corporate. Think 
enterprise tech startup rather than Wall Street. 

Requirements:
- Square crop (1:1 ratio), 1200x1200px minimum
- Professional lighting, no harsh shadows
- Business casual to formal attire
- Confident but approachable expression
- Consistent background and lighting across all shots
- Deliver RAW + JPEG high-res + web-optimized versions"
```

**Timeline:**
- [ ] Day 10: Get photographer quotes, select vendor
- [ ] Day 11: Confirm availability, send brief to photographer
- [ ] Day 12-13: Shoot day (coordinate with team)
- [ ] Day 14: Receive photos, select best versions
- [ ] Day 15: Post-production editing
- [ ] Day 16: Deliver final files

**Deliverables:**
- [ ] High-res RAW files (1 copy for archive)
- [ ] High-res JPEG files (1200x1200px+)
- [ ] Web-optimized versions (1200x1200px, <500KB)
- [ ] Thumbnail versions (300x300px)
- [ ] Consistent color grading across all photos

**Team Coordination:**
- [ ] Email team with photo date/time/location
- [ ] Send attire guidelines (business casual recommended)
- [ ] Provide makeup/hair tips
- [ ] Confirm attendance 48 hours before
- [ ] Plan travel/parking if off-site

**Subtasks:**
- [ ] 4.3a - Decide: professional vs DIY
- [ ] 4.3b - Request photographer quotes
- [ ] 4.3c - Select photographer/setup
- [ ] 4.3d - Schedule shoot date with team
- [ ] 4.3e - Send team guidelines email
- [ ] 4.3f - Conduct photoshoot
- [ ] 4.3g - Select best photos with team
- [ ] 4.3h - Manage post-production
- [ ] 4.3i - Organize photos in assets folder
- [ ] 4.3j - Test photo display on website

**Deliverable:** 7 optimized team headshots + 1 group photo

---

## 🧪 **MONTH 2: TESTING & OPTIMIZATION**

### **TASK 6.1: A/B Testing Framework Setup**
- **Status:** ⬜ Not Started
- **Timeline:** Day 15-21
- **Owner:** Product Lead + Marketing
- **Dependencies:** Task 5.1 & 5.2 (analytics working)

#### **Step 1: Choose A/B Testing Platform**
- [ ] **Option A: Google Optimize** (Free with GA4, recommended)
  - Integrates directly with Google Analytics
  - No additional SDK required
  - Create experiments in GA interface
  - Cost: Free

- [ ] **Option B: Optimizely** (Enterprise-grade, paid)
  - More advanced features
  - Better for complex experiments
  - Cost: $3,000-10,000/month
  - Decision: Worth the investment? → **DECISION: [Yes/No]**

- [ ] **Option C: VWO** (Mid-range, $99/month+)
  - Good balance of features and cost
  - Heatmap and session recording included
  - Easy to setup
  - Cost: $99-399/month

**Recommended:** Google Optimize (free, sufficient for MVP phase)

#### **Step 2: Setup Experiment 1: Hero Headline**

**Test Specification:**
```markdown
### Experiment: Hero Headline Variation

**Hypothesis:** 
"If we change the hero headline to a benefit-focused message, 
we will increase demo request CTR by 25%"

**Control (Current):**
"Systems of ProAction"

**Variation A (Proposed):**
"Predict Supply Chain Disruptions Months Before They Happen"

**Variation B (Alternative):**
"Sleep Better Knowing Your Supply Chain is Protected"

**Metric to Measure:**
- Primary: Demo request button CTR
- Secondary: Time on page, scroll depth

**Sample Size:** 1000 visitors minimum per variant
**Duration:** 14 days
**Success Threshold:** 20% improvement or greater

**Audience:** All traffic (no segmentation)
**Traffic Split:** 33% control, 33% var A, 33% var B
```

**Subtasks:**
- [ ] 6.1a - Choose A/B testing platform
- [ ] 6.1b - Setup testing account (if not Google Optimize)
- [ ] 6.1c - Create experiment in testing platform
- [ ] 6.1d - Define control and variations
- [ ] 6.1e - Set success metrics
- [ ] 6.1f - Configure traffic allocation
- [ ] 6.1g - Test experiment locally
- [ ] 6.1h - Launch experiment to small % traffic (10%)
- [ ] 6.1i - Monitor for issues for 24 hours
- [ ] 6.1j - Scale to 100% traffic if no issues
- [ ] 6.1k - Monitor experiment daily
- [ ] 6.1l - Document results after 2 weeks

**Decision Points:**
- **Which headline variation looks best?** → **VARIATION: [A/B]**
- **How long to run test?** → **DURATION: [14/21/28 days]**

#### **Step 3: Plan Additional A/B Tests**

**Test 2: CTA Button Colors (Week 4)**
- Control: Current color
- Variation: Green (#00C853)
- Metric: CTA click-through rate
- Duration: 2 weeks

**Test 3: Form Length (Week 6)**
- Control: 4 fields (name, email, company, message)
- Variation: 3 fields (name, email, company)
- Metric: Form submission rate, lead quality
- Duration: 2 weeks

**Test 4: CTA Button Text (Week 8)**
- Control: "Get Started"
- Variation: "See Demo"
- Variation B: "Request Briefing"
- Metric: CTA click-through rate, demo attendance
- Duration: 3 weeks

**Deliverable:** A/B testing setup document with experiments planned

---

### **TASK 6.2: Ongoing Analytics & Monitoring**
- **Status:** ⬜ Not Started
- **Timeline:** Ongoing after launch
- **Owner:** Product/Marketing Lead
- **Frequency:** Weekly reviews

#### **Weekly Analytics Review Checklist:**

```markdown
### Weekly Analytics Review Template

**Week of: ___________**

**Traffic Metrics:**
- Total sessions: ___________
- New vs returning: ___________
- Traffic sources (organic/paid/direct): ___________
- Bounce rate: ___________
- Avg session duration: ___________

**Engagement Metrics:**
- Page views per session: ___________
- Scroll depth (avg % of page): ___________
- Most visited pages: ___________
- Least visited pages: ___________

**Conversion Metrics:**
- Demo request submissions: ___________
- Demo request conversion rate: ___________
- Contact form submissions: ___________
- Newsletter signups: ___________

**CTA Performance (if A/B testing active):**
- CTA #1 CTR: ___________
- CTA #2 CTR: ___________
- CTA #3 CTR: ___________
- Best performing CTA: ___________

**Technical Metrics:**
- Page load time (avg): ___________
- Error rate: ___________
- Core Web Vitals status: ___________

**A/B Test Status:**
- Active experiments: ___________
- Expected completion dates: ___________
- Early winner (if any): ___________

**Action Items:**
1. _______________ (assignee: _______) 
2. _______________ (assignee: _______)

**Notes:** ___________
```

**Subtasks:**
- [ ] 6.2a - Schedule weekly analytics review (recurring)
- [ ] 6.2b - Create dashboard for weekly metrics
- [ ] 6.2c - Document weekly findings
- [ ] 6.2d - Act on insights (implement winning variations)
- [ ] 6.2e - Plan next round of tests based on data
- [ ] 6.2f - Monthly review with leadership
- [ ] 6.2g - Quarterly strategy adjustment

**Deliverable:** Weekly analytics reports (ongoing)

---

## 🔑 **CREDENTIALS & API KEYS STORAGE**

**⚠️ NEVER commit API keys to git repository**

Create `.env.local` file (in .gitignore):
```
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_PLATFORM=ga4

# Demo Platform (if embedded)
NEXT_PUBLIC_DEMO_URL=https://demo.duatflow.com

# Email Service (for contact form)
NEXT_PUBLIC_EMAIL_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAIL_TEMPLATE_ID=template_xxxxx
NEXT_PUBLIC_EMAIL_PUBLIC_KEY=pk_xxxxx
```

**Security Checklist:**
- [ ] `.env.local` exists and is in `.gitignore`
- [ ] All API keys are environment variables
- [ ] No API keys in commits
- [ ] Use GitHub Secrets for production environment
- [ ] Team has shared secret manager (1Password, Vault, etc.)
- [ ] API keys rotated quarterly

---

## 📋 **DECISION TRACKING**

**Decisions Made During Implementation:**

| Decision | Options | Chosen | Date | Owner |
|----------|---------|--------|------|-------|
| Analytics Platform | GA4 / Mixpanel / Segment | ________ | ________ | ________ |
| Icon Design | In-house / Outsource | ________ | ________ | ________ |
| Photography | Professional / DIY | ________ | ________ | ________ |
| A/B Test Platform | Google Optimize / Optimizely / VWO | ________ | ________ | ________ |
| Hero Animation | Animated / Static | ________ | ________ | ________ |
| Demo Display | Modal / Full-page | ________ | ________ | ________ |

---

## ✅ **COMPLETED TASKS**

(Tasks will be moved here as they are completed)

---

## 🔗 **Cross-References**

- **AI Code Tasks:** See `implementation_checklist_ai.md`
- **Design Specifications:** See `duat_visual_assets_guide.md`
- **Optimization Rationale:** See `kilo_code_optimazation.md`

**Last Updated:** [Auto-update as tasks progress]
