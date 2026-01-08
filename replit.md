# Kegel Coach

A mobile wellness app for pelvic floor training with timer-based workouts, progress tracking, and personalized training programs.

## Overview

Kegel Coach helps users improve their pelvic floor health through guided training sessions. The app features:

- **Onboarding Flow**: Age verification, goal selection, experience level, and educational content
- **Training Library**: 3 progressive programs (Beginner 14-day, Intermediate 30-day, Advanced 60-day)
- **Session Player**: Interactive timer-based workout with progress ring, phase indicators, and controls
- **Progress Tracking**: Streaks, total minutes, completed sessions, calendar view
- **Settings**: Sound/vibration preferences, reminders, account management
- **Multi-language Support**: English, German (Deutsch), French (Français), Italian (Italiano)

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation 7
- **State Management**: React Context with AsyncStorage persistence
- **UI**: Custom components with iOS 26 liquid glass aesthetic
- **Backend**: Express.js (minimal, for landing page)

## Project Structure

```
client/
├── App.tsx                    # Main app entry point
├── components/                # Reusable UI components
│   ├── ErrorBoundary.tsx      # Error handling wrapper
│   ├── PrimaryButton.tsx      # Action button component
│   ├── ProgressRing.tsx       # Circular progress indicator
│   ├── SelectionCard.tsx      # Selection cards for onboarding
│   ├── SessionCard.tsx        # Training session cards
│   ├── PlanCard.tsx           # Training plan cards
│   ├── StatCard.tsx           # Statistics display cards
│   └── StepIndicator.tsx      # Progress steps indicator
├── constants/
│   └── theme.ts               # Design tokens (colors, spacing, typography)
├── hooks/
│   ├── useAppState.tsx        # Global app state context
│   ├── useLanguage.tsx        # Language/i18n context
│   └── useTheme.ts            # Theme hook
├── lib/
│   ├── storage.ts             # AsyncStorage utilities
│   ├── trainingData.ts        # Training plans, sessions, exercises
│   ├── translations.ts        # Multi-language translations (EN, DE, FR, IT)
│   └── query-client.ts        # React Query configuration
├── navigation/
│   ├── RootStackNavigator.tsx # Root navigation (onboarding vs main)
│   ├── MainTabNavigator.tsx   # Main tab bar navigation
│   └── OnboardingStackNavigator.tsx # Onboarding flow
└── screens/
    ├── OnboardingAgeGateScreen.tsx
    ├── OnboardingGoalsScreen.tsx
    ├── OnboardingExperienceScreen.tsx
    ├── OnboardingEducationScreen.tsx
    ├── DashboardScreen.tsx
    ├── LibraryScreen.tsx
    ├── ProgressScreen.tsx
    ├── SettingsScreen.tsx
    ├── SessionPlayerScreen.tsx
    ├── PlanDetailScreen.tsx
    └── PaywallScreen.tsx
```

## Key Features

### Training Programs
- **Beginner (14 days)**: Foundation building with proper technique
- **Intermediate (30 days)**: Progressive intensity and variety
- **Advanced (60 days)**: Elite-level training for maximum results

### Session Player
- Animated progress ring
- Contract/Relax phase indicators
- Pause/Resume/Skip controls
- Haptic feedback on phase changes
- Auto-progression through exercises

### Progress Tracking
- Streak counter with daily tracking
- Total minutes trained
- Sessions completed
- Calendar view of completed days
- Weekly goal progress

## User Flow

1. **Onboarding**: Age gate → Goals → Experience → Education
2. **Dashboard**: View stats, start recommended session
3. **Library**: Browse all training programs
4. **Session**: Interactive timer-based workout
5. **Progress**: Track achievements and history
6. **Settings**: Manage preferences

## Development

### Running the App
The app runs on port 8081 (Expo) with the backend on port 5000.

### Testing on Device
Scan QR code from Replit's URL bar to test on physical device via Expo Go.

## Notes

- Paywall is simulated (no real Stripe integration yet)
- All data persisted locally with AsyncStorage
- Dark mode supported automatically
- Multi-language: All UI text translated to EN, DE, FR, IT (change in Settings)
