# DUAT Website: AI Code Implementation Checklist

**Purpose:** Track all code generation, component updates, and technical implementation tasks that GitHub Copilot will handle.

**How to Use:** 
- Check off each task as Copilot generates and implements the code
- Reference the related file paths for code changes
- Verify each implementation against acceptance criteria
- Move completed items to "✅ COMPLETED" sections

---

## 🚀 **WEEK 1: CRITICAL FIXES (Conversion Impact)**

### **TASK 1.1: Simplify Hero Headline**
- **Status:** ⬜ Not Started
- **File to Modify:** `src/components/Hero.tsx`
- **Lines of Code:** 22-27
- **Acceptance Criteria:**
  - [ ] New headline is benefit-focused, not technical
  - [ ] Gradient text styling maintained
  - [ ] Responsive on mobile (<768px)
  - [ ] No console errors on render
  
**Code Changes Required:**
```
Replace "Systems of ProAction" with "Predict Supply Chain Disruptions Months Before They Happen"
```

**Related Files:**
- Design reference: `duat_visual_assets_guide.md` IMAGE 1 (Hero Background Animation)
- Style guide: Check color palette for gradient colors

---

### **TASK 1.2: Fix Mobile Navigation Accessibility**
- **Status:** ⬜ Not Started
- **File to Modify:** `src/components/Navigation.tsx`
- **Lines of Code:** 30-35, 50-70 (mobile menu logic)
- **Acceptance Criteria:**
  - [ ] Menu button has proper `aria-expanded` attribute
  - [ ] Menu button has `aria-controls` pointing to menu id
  - [ ] Escape key closes mobile menu
  - [ ] Click outside closes mobile menu
  - [ ] Keyboard focus visible on all interactive elements
  - [ ] WCAG 2.1 Level AA compliant

**Code Changes Required:**
1. Update button ARIA attributes
2. Add keyboard event handlers (Escape, Enter, Arrow keys)
3. Add click-outside detection
4. Add focus management on menu open/close

**Subtasks:**
- [ ] 1.2a - Update aria-label and add aria-expanded
- [ ] 1.2b - Implement keyboard event handlers
- [ ] 1.2c - Add click-outside detection
- [ ] 1.2d - Add focus trap for menu
- [ ] 1.2e - Test with screen reader (NVDA/JAWS simulation)

---

### **TASK 1.3: Implement Form State Management & UX**
- **Status:** ⬜ Not Started
- **Files to Modify:** `src/components/ContactForm.tsx`, `src/hooks/useFormState.ts` (create new)
- **Acceptance Criteria:**
  - [ ] Form shows loading state while submitting
  - [ ] Success message displayed after submission
  - [ ] Error message shows if submission fails
  - [ ] Form clears after successful submission
  - [ ] Next step CTA shown (e.g., "Check your email")
  - [ ] Disabled state on submit button during request

**Code Changes Required:**
1. Create custom hook: `useFormState.ts`
   - Track form state: idle, loading, success, error
   - Handle form reset
   - Handle error recovery
2. Update ContactForm.tsx
   - Add useState for form data
   - Implement state transitions
   - Add conditional rendering for states
   - Add error boundary

**Subtasks:**
- [ ] 1.3a - Create useFormState custom hook
- [ ] 1.3b - Update form submission handler
- [ ] 1.3c - Add success state UI
- [ ] 1.3d - Add error state UI with retry
- [ ] 1.3e - Add loading animation/skeleton
- [ ] 1.3f - Test with mock API responses

**Code Snippet (Hook Structure):**
```typescript
// src/hooks/useFormState.ts
interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  data: FormData | null;
}
```

---

### **TASK 1.4: Add Social Proof Elements**
- **Status:** ⬜ Not Started
- **Files to Modify:** `src/components/SocialProof.tsx` (create new), Update main page layout
- **Location:** After Features section
- **Acceptance Criteria:**
  - [ ] Company logos displayed in grid
  - [ ] Logo opacity reduced for visual hierarchy (60%)
  - [ ] Responsive on mobile (2 columns → 4 columns on desktop)
  - [ ] Accessible alt text for all logos
  - [ ] No layout shift on logo load

**Code Changes Required:**
1. Create SocialProof component with:
   - Company logo array (IBM, VMware, SAP, etc.)
   - Grid layout with responsive columns
   - Image optimization (lazy loading, WebP)
2. Integrate into main page

**Subtasks:**
- [ ] 1.4a - Create SocialProof component
- [ ] 1.4b - Add company logo data
- [ ] 1.4c - Implement responsive grid
- [ ] 1.4d - Add image optimization
- [ ] 1.4e - Add accessibility attributes
- [ ] 1.4f - Test on mobile/tablet/desktop

---

## 📊 **WEEK 2-3: NECESSARY IMPROVEMENTS (UX Enhancement)**

### **TASK 2.1: Content Restructuring & Page Organization**
- **Status:** ⬜ Not Started
- **Files to Create/Modify:**
  - Create: `src/pages/company.tsx`
  - Create: `src/pages/technology.tsx`
  - Modify: `src/pages/index.tsx` (remove overflow content)
- **Acceptance Criteria:**
  - [ ] Company page created with team/mission content
  - [ ] Technology page explains SAR, AI architecture
  - [ ] Homepage max length: 8 sections only
  - [ ] Breadcrumb navigation added
  - [ ] Internal links updated

**Page Structure:**
```
Homepage (8 sections max):
- Hero
- Value Prop
- Key Features (3 only)
- Crisis Management
- CTA Section
- Social Proof
- FAQ (3 items)
- Contact

Company Page:
- About Duat
- Team Bios (with photos from IMAGE 7)
- Mission/Values
- Press/Awards

Technology Page:
- SAR Intelligence explanation (IMAGE 4)
- AI/ML architecture
- System architecture diagram
- Data security
```

**Subtasks:**
- [ ] 2.1a - Audit current page content (count sections)
- [ ] 2.1b - Create company.tsx with about content
- [ ] 2.1c - Create technology.tsx with technical deep-dive
- [ ] 2.1d - Update homepage to remove overflow
- [ ] 2.1e - Add breadcrumb component
- [ ] 2.1f - Update navigation menu with new pages
- [ ] 2.1g - Update internal links throughout site
- [ ] 2.1h - Test navigation and page transitions

---

### **TASK 2.2: Implement Targeted CTA Strategy**
- **Status:** ⬜ Not Started
- **Files to Modify:** `src/components/CTA.tsx` (update), `src/components/CTAButton.tsx` (create new)
- **Acceptance Criteria:**
  - [ ] Three CTA variants created: hero, secondary, outline
  - [ ] CTA text is benefit-focused, not generic
  - [ ] CTA colors match design system
  - [ ] Analytics tracking implemented for each CTA
  - [ ] Hover/active states clear and accessible

**CTA Matrix Implementation:**
```
Audience: C-Suite/Investors
- Text: "Request Executive Briefing"
- Color: Primary teal (#00BCD4)
- Icon: Calendar/briefcase
- Analytics event: "cta_executive_briefing_clicked"

Audience: Operational Users
- Text: "See Platform Demo"
- Color: Secondary (outline)
- Icon: Play/monitor
- Analytics event: "cta_demo_clicked"

Audience: Early Adopters
- Text: "Join Pilot Program"
- Color: Gradient (accent to secondary)
- Icon: Zap/star
- Analytics event: "cta_pilot_clicked"
```

**Subtasks:**
- [ ] 2.2a - Create CTAButton variant component
- [ ] 2.2b - Define CTA text variations per audience
- [ ] 2.2c - Implement color variants in design system
- [ ] 2.2d - Add analytics event tracking (see Task 5.2)
- [ ] 2.2e - Replace all generic CTAs with specific versions
- [ ] 2.2f - Test responsive behavior on all devices
- [ ] 2.2g - Test keyboard navigation and screen reader

---

### **TASK 2.3: Performance Optimization (Images & Loading)**
- **Status:** ⬜ Not Started
- **Files to Modify:** Multiple components, `next.config.js`
- **Acceptance Criteria:**
  - [ ] All images optimized to WebP with JPEG fallback
  - [ ] Non-critical images use lazy loading
  - [ ] Hero image preloaded
  - [ ] Image dimensions specified (no layout shift)
  - [ ] Lighthouse score improved to 85+

**Optimization Checklist:**
1. Image optimization
   - [ ] Hero background image: WebP + preload
   - [ ] Section images: WebP + lazy load
   - [ ] Logo images: WebP + native lazy load
   - [ ] Icon sets: SVG inline or CSS sprites

2. Code optimization
   - [ ] Remove unused dependencies
   - [ ] Code splitting enabled
   - [ ] Dynamic imports for heavy components
   - [ ] CSS minification

3. Performance monitoring
   - [ ] Lighthouse audit (target: 85+ score)
   - [ ] Core Web Vitals check
   - [ ] Monitor LCP, FID, CLS

**Subtasks:**
- [ ] 2.3a - Audit current image usage
- [ ] 2.3b - Convert images to WebP format
- [ ] 2.3c - Implement Next.js Image optimization
- [ ] 2.3d - Add lazy loading to non-critical images
- [ ] 2.3e - Preload hero images
- [ ] 2.3f - Remove unused dependencies
- [ ] 2.3g - Implement code splitting
- [ ] 2.3h - Run Lighthouse audit and document baseline

**Related Task:** See `implementation_checklist_human.md` Task 5.1 (Lighthouse baseline capture)

---

### **TASK 2.4: Create Progressive Disclosure Patterns**
- **Status:** ⬜ Not Started
- **Files to Create:** `src/components/Disclosure.tsx`, `src/components/AccordionItem.tsx`
- **Acceptance Criteria:**
  - [ ] Accordion component created and reusable
  - [ ] Smooth open/close animations
  - [ ] Only one section open at a time (optional configurable)
  - [ ] Keyboard accessible (Enter/Space to toggle)
  - [ ] ARIA attributes for expanded state

**Implementation Locations:**
1. FAQ Section
   - 3-5 questions about DUAT platform
   - Expandable details with technical info

2. Features Section
   - "Learn More" expandable for each feature
   - Progressive disclosure of technical details

3. Pricing (future)
   - Feature comparison accordion

**Subtasks:**
- [ ] 2.4a - Create Disclosure component with hooks
- [ ] 2.4b - Implement animation (Framer Motion or CSS)
- [ ] 2.4c - Add keyboard handlers (Enter, Space, Escape)
- [ ] 2.4d - Add ARIA attributes (aria-expanded, aria-controls)
- [ ] 2.4e - Integrate into FAQ section
- [ ] 2.4f - Test accessibility with screen reader
- [ ] 2.4g - Test on mobile/tablet/desktop

---

## 🎯 **MONTH 2: ADVANCED FEATURES (Growth)**

### **TASK 3.1: Interactive Demo Integration**
- **Status:** ⬜ Not Started
- **Files to Modify:** Create `src/components/DemoModal.tsx`, `src/pages/demo.tsx`
- **Acceptance Criteria:**
  - [ ] Embedded demo accessible from CTA
  - [ ] Modal or full-page view (configurable)
  - [ ] Demo loads with progress indicator
  - [ ] Close button accessible
  - [ ] Analytics event for demo opens/closes
  - [ ] Fallback for demo unavailability

**Implementation:**
```
Option A: Modal Component
- Trigger: "See Platform Demo" CTA button
- Content: Embedded iframe to https://demo.duatflow.com
- Overlay with close button
- Analytics: track open/close/time_spent

Option B: Dedicated Demo Page
- Full-screen embedded demo
- Sidebar with feature descriptions
- CTAs for follow-up
- Analytics: track interactions
```

**Subtasks:**
- [ ] 3.1a - Create DemoModal component with iframe
- [ ] 3.1b - Implement loading state/skeleton
- [ ] 3.1c - Add analytics event tracking
- [ ] 3.1d - Test cross-origin iframe loading
- [ ] 3.1e - Add fallback UI if demo unavailable
- [ ] 3.1f - Test on mobile (may need full-page option)
- [ ] 3.1g - Test keyboard accessibility (focus trap, escape to close)

---

### **TASK 3.2: Content Marketing Foundation**
- **Status:** ⬜ Not Started
- **Files to Create:** `src/pages/blog.tsx`, `src/pages/blog/[slug].tsx`, Blog data structure
- **Acceptance Criteria:**
  - [ ] Blog listing page created
  - [ ] Individual blog post pages created
  - [ ] Posts are searchable and filterable
  - [ ] Related posts displayed
  - [ ] Social sharing buttons
  - [ ] Newsletter signup form integration

**Initial Blog Topics:**
1. "Supply Chain Visibility: The Foundation of Risk Management"
2. "How SAR Technology is Transforming Supply Chain Intelligence"
3. "Case Study: Early Detection Saves $2M in Disruption Costs"
4. "AI in Supply Chain: Myth vs Reality"
5. "Regulatory Compliance: GDPR and Supply Chain Data"

**Subtasks:**
- [ ] 3.2a - Create blog listing page
- [ ] 3.2b - Create blog post template/layout
- [ ] 3.2c - Create blog data structure (markdown or CMS)
- [ ] 3.2d - Implement search/filter functionality
- [ ] 3.2e - Add related posts component
- [ ] 3.2f - Add social sharing buttons
- [ ] 3.2g - Integrate newsletter signup
- [ ] 3.2h - Add SEO metadata (title, description, OG images)
- [ ] 3.2i - Test blog navigation and performance

---

### **TASK 3.3: Design Asset Integration**
- **Status:** ⬜ Not Started
- **Reference:** `duat_visual_assets_guide.md`
- **Files to Modify:** Multiple component files
- **Acceptance Criteria:**
  - [ ] All 10 images integrated into appropriate sections
  - [ ] 12 icons used throughout site
  - [ ] Team photos displayed on About/Team page
  - [ ] Animations implemented where appropriate
  - [ ] Assets optimized for web (file size, format)

**Asset Placement Map:**
```
IMAGE 1 (Hero Animation) → Hero section background
IMAGE 2 (Supply Chain Flow) → Features section
IMAGE 3 (Disruption Timeline) → Crisis Management section
IMAGE 4 (SAR Intelligence) → Technology page
IMAGE 5 (Cascade Effect) → Value Proposition section
IMAGE 6 (Icon System) → Throughout (CTAs, features, benefits)
IMAGE 7 (Team Photos) → Team page
IMAGE 8 (Stat Cards) → Hero section callouts
IMAGE 9 (Reactive vs Proactive) → Comparison section
IMAGE 10 (Dashboard Mockup) → Demo section
ANIMATIONS (3) → Hero, Features, and Technology sections
```

**Subtasks:**
- [ ] 3.3a - Collect all generated images from design team
- [ ] 3.3b - Optimize images (compression, WebP conversion)
- [ ] 3.3c - Create image assets folder structure
- [ ] 3.3d - Integrate IMAGE 1 into Hero background
- [ ] 3.3e - Integrate IMAGE 2 into Features section
- [ ] 3.3f - Integrate IMAGE 3 into Crisis section
- [ ] 3.3g - Integrate IMAGE 7 team photos on About page
- [ ] 3.3h - Integrate all 12 icons throughout site
- [ ] 3.3i - Implement animations (Lottie or CSS)
- [ ] 3.3j - Test all image loading and animations
- [ ] 3.3k - Verify no layout shift from images

**Related Files:**
- Design guide: `duat_visual_assets_guide.md`
- Image status: `implementation_checklist_human.md` Task 4.1-4.3

---

## ✅ **COMPLETED TASKS**

(Tasks will be moved here as they are completed)

---

## 📋 **HOW TO USE THIS CHECKLIST**

### **For Each Task:**
1. **Identify Status:** Change ⬜ to 🔄 (In Progress) → ✅ (Completed)
2. **Request Code Implementation:** Ask Copilot with specific task number
   - Example: "Complete TASK 1.1: Simplify Hero Headline"
3. **Verify Implementation:** Check all acceptance criteria are met
4. **Mark Complete:** Update status and move to ✅ section
5. **Test:** Always test on desktop, tablet, and mobile

### **Code Generation Requests:**
```
For each task, provide Copilot with:
- Task number and name
- File path to modify
- Acceptance criteria
- Any related files or context
```

### **Dependency Map:**
```
Task 1.1 → Independent (can start immediately)
Task 1.2 → Independent (can start immediately)
Task 1.3 → Depends on form component existing
Task 1.4 → Depends on component library
Task 2.1 → Can start after 1.x tasks
Task 2.2 → Depends on CTA component updates
Task 2.3 → Can run in parallel
Task 2.4 → Independent component creation
Task 3.1 → Depends on demo URL stability
Task 3.2 → Can start anytime
Task 3.3 → Depends on design team delivering assets
```

---

## 🔗 **Cross-References**

- **Human Tasks:** See `implementation_checklist_human.md` for API keys, analytics setup, A/B testing
- **Design Guide:** See `duat_visual_assets_guide.md` for asset specifications
- **Code Optimization:** See `kilo_code_optimazation.md` for detailed rationale

**Last Updated:** [Auto-update as tasks progress]
