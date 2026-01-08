# Kegel Coach - Design Guidelines

## Design Philosophy
**Aesthetic**: Modern, calm wellness/fitness aesthetic with a soft, glassy feel. The app should feel premium, trustworthy, and focused on health education rather than explicit content. Use neutral, professional language consistent with fitness/wellness framing.

**Compliance**: Adult-only (18+) with clear disclaimers. No explicit sexual content or pornographic visuals. Frame all content as pelvic floor fitness and wellness education.

---

## Visual Design System

### Color Palette
- **Primary**: Calming, professional wellness colors (soft blues, teals, or muted purples)
- **Accent**: Energizing but not aggressive (coral, warm orange, or gentle green)
- **Neutral**: Clean grays with sufficient contrast for accessibility
- **Success/Progress**: Green tones for completion states
- **Warning/Paywall**: Subtle amber for locked content indicators
- **Dark Mode**: Full support required with inverted palette maintaining readability

### Typography
- **Headings**: Clean, modern sans-serif (generous spacing)
- **Body**: Readable at all sizes, optimized for mobile-first
- **Emphasis**: Bold weights for technique cues and safety notes
- **Hierarchy**: Clear distinction between instruction levels (exercise title → cues → details)

### Spacing & Layout
- Generous white space throughout
- Consistent padding system (4px base grid)
- Mobile-first responsive breakpoints
- Cards with soft shadows or glassy/frosted glass effects
- Rounded corners for approachability

---

## Navigation Architecture

### Route Structure
- **Public Routes**: Landing (`/`), Pricing, Login/Signup
- **Onboarding Flow**: Linear stack navigation (Age Gate → Goals → Experience → Education → Paywall)
- **App Routes** (Protected):
  - Dashboard (`/app`) - Hub with progress overview
  - Library (`/app/library`) - Browse all plans
  - Plan Detail (`/app/plan/[planId]`) - Sessions in plan
  - Session Player (`/app/session/[sessionId]`) - Fullscreen workout UI
  - Progress (`/app/progress`) - Stats and calendar
  - Settings & Billing

### Navigation Patterns
- **Desktop**: Persistent sidebar navigation + top navbar
- **Mobile**: Bottom navigation bar (4 tabs: Dashboard, Library, Progress, Settings)
- **Session Player**: Fullscreen with minimal chrome, exit confirmation
- **Paywall**: Modal overlay on locked content

---

## Component System

### Core UI Components (shadcn/ui or Radix UI)
- **Cards**: Soft shadows, rounded corners, hover states
- **Buttons**:
  - Primary (CTAs): Bold, high contrast
  - Secondary: Outlined or ghost style
  - Floating Action (in Session Player): Large, accessible, with subtle shadow
- **Badges**: For plan levels (Beginner/Intermediate/Advanced), status (Locked/Unlocked)
- **Progress Ring**: Animated SVG for session timer
- **Timeline**: Expandable session step preview
- **Modals**: Glassmorphism or soft overlay for paywalls
- **Skeleton Loaders**: Smooth content loading states
- **Error States**: Friendly, actionable error messages

### Session Player Components
- **Timer Display**: Large, centered, animated countdown
- **Progress Ring**: Circular progress indicator (smooth animations)
- **Phase Indicator**: Clear "Contract" vs "Relax" states with color coding
- **Next Step Preview**: Collapsed by default, expandable
- **Controls**: Pause/Resume/Skip (large touch targets)
- **Timeline Drawer**: Swipeable/collapsible view of all steps

---

## Animation & Motion

### Framer Motion Integration
- **Page Transitions**: Smooth fade + slide between routes (100-200ms)
- **Progress Ring**: Continuous smooth animation, no jank
- **Micro-interactions**:
  - Button hover/press feedback
  - Card expansion/collapse
  - Badge pulse on state change
  - Timer phase transitions
- **Reduced Motion**: Respect `prefers-reduced-motion` setting (disable non-essential animations)

### Timer Animations
- **Contract Phase**: Pulsing glow or color shift
- **Relax Phase**: Gentle fade or breathing animation
- **Transitions**: Smooth count-in between exercises
- **Completion**: Celebratory but subtle (confetti or checkmark)

---

## Screen Specifications

### 1. Landing Page
- **Hero**: Large headline, subheadline, primary CTA ("Start Free")
- **Sections**: Benefits, How It Works, Testimonials (mock), Pricing, FAQ
- **Footer**: Legal links, contact
- **Mobile**: Stacked sections, sticky CTA button

### 2. Onboarding Flow
- **Age Gate**: Simple yes/no confirmation (18+)
- **Goal Selection**: Card grid (3-4 options with icons)
- **Experience Level**: 3 large cards (Beginner/Intermediate/Advanced)
- **Education**: Scrollable content with illustrations, "Next" CTA
- **Progress Indicator**: Stepper or progress bar at top

### 3. Dashboard (`/app`)
- **Header**: Welcome message, streak badge
- **Quick Stats**: Cards for total minutes, sessions completed, current streak
- **Recommended Session**: Large featured card with "Start Session" CTA
- **Recent Activity**: Timeline or list

### 4. Library (`/app/library`)
- **Plan Cards**: Grid (desktop) / List (mobile)
- **Each Card**: Level badge, duration, progress percentage, lock icon if paywalled
- **Filter/Sort**: Tabs or dropdown (All, Beginner, Intermediate, Advanced)

### 5. Session Player (`/app/session/[sessionId]`)
- **Fullscreen Layout**:
  - Exit button (top-left, with confirmation)
  - Timer display (center, large)
  - Progress ring (wrapping timer)
  - Phase indicator ("Contract" / "Relax")
  - Technique cue (below timer, concise)
  - Next step preview (bottom drawer, collapsible)
  - Controls (pause/resume/skip - bottom, large touch targets)
- **Completion Screen**: Summary stats, rating prompt, "Next Session" CTA

### 6. Progress (`/app/progress`)
- **Calendar View**: Month grid with colored dots for completed days
- **Stats Cards**: Total time, streak, sessions completed
- **Charts** (optional): Weekly/monthly activity graph
- **Export/Reset**: Tucked in settings menu

### 7. Paywall Modal
- **Overlay**: Semi-transparent backdrop
- **Content**:
  - Headline: "Unlock Full Training Library"
  - Benefits list (3-5 bullet points)
  - Pricing cards (Monthly/Yearly/Lifetime)
  - "Start Free Trial" or "Subscribe" CTA
  - "Restore Purchase" link (if applicable)
  - Dismissible close button

---

## Accessibility Requirements

- **Keyboard Navigation**: All interactive elements focusable and operable
- **ARIA Labels**: Descriptive labels for screen readers (especially timer states)
- **Color Contrast**: WCAG AA minimum (AAA preferred for body text)
- **Focus Indicators**: Clear visual focus states
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Text Resizing**: Support up to 200% zoom without breaking layout
- **Reduced Motion**: Disable decorative animations for users with motion sensitivity
- **Error Messaging**: Clear, actionable error states with recovery paths

---

## Responsive Design

- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Mobile-First**: Default styles for mobile, progressively enhance
- **Session Player**: Always fullscreen on mobile, optional fullscreen on desktop
- **Navigation**: Bottom bar (mobile), sidebar (desktop)

---

## State & Feedback

- **Loading States**: Skeleton loaders, spinners for async actions
- **Success States**: Toast notifications, checkmarks, progress updates
- **Error States**: Inline validation, toast errors, fallback UI
- **Empty States**: Helpful illustrations and CTAs (e.g., "No sessions completed yet")
- **Locked Content**: Clear lock icons, "Upgrade" CTAs, preview-only access
- **Hover States**: Subtle elevation or color shift on interactive elements
- **Pressed States**: Slight scale down or color darken for tactile feedback

---

## Audio/Haptic Cues (Optional)

- **Phase Transitions**: Short beep or chime (toggle on/off in settings)
- **Session Complete**: Success sound
- **Vibration** (PWA): Gentle haptic feedback on mobile for contract/relax cues
- **User Control**: All audio/haptics optional and toggleable