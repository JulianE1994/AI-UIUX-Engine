export interface Exercise {
  id: string;
  name: string;
  description: string;
  techniqueCues: string[];
  commonMistakes: string[];
  safetyNotes: string;
  intensity: "low" | "medium" | "high";
}

export interface SessionStep {
  id: string;
  exerciseId: string;
  stepType: "warmup" | "main" | "cooldown";
  workSeconds: number;
  restSeconds: number;
  sets: number;
  reps?: number;
  instruction: string;
}

export interface Session {
  id: string;
  planId: string;
  dayIndex: number;
  title: string;
  description: string;
  totalSeconds: number;
  steps: SessionStep[];
}

export interface Plan {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  durationDays: number;
  description: string;
  sessions: Session[];
}

export const exercises: Exercise[] = [
  {
    id: "gentle-hold",
    name: "Gentle Hold",
    description:
      "A basic pelvic floor contraction held for a moderate duration to build foundational strength.",
    techniqueCues: [
      "Imagine stopping the flow of urine",
      "Lift and squeeze gently",
      "Keep breathing normally",
      "Relax your abdomen and thighs",
    ],
    commonMistakes: [
      "Holding your breath",
      "Squeezing too hard",
      "Tensing abdominal muscles",
      "Forgetting to fully relax",
    ],
    safetyNotes:
      "Stop if you feel pain. Do not practice while urinating as this can lead to incomplete bladder emptying.",
    intensity: "low",
  },
  {
    id: "pulsed-contractions",
    name: "Pulsed Contractions",
    description:
      "Quick, rhythmic contractions that build fast-twitch muscle fibers for improved control.",
    techniqueCues: [
      "Contract quickly and release",
      "Maintain a steady rhythm",
      "Keep contractions light and quick",
      "Focus on the release as much as the squeeze",
    ],
    commonMistakes: [
      "Making contractions too forceful",
      "Losing rhythm over time",
      "Not fully releasing between pulses",
      "Tensing surrounding muscles",
    ],
    safetyNotes:
      "If you feel fatigued, rest before continuing. Quality over quantity.",
    intensity: "medium",
  },
  {
    id: "stair-step-holds",
    name: "Stair-Step Holds",
    description:
      "Progressive contraction intensity that builds strength through graduated effort levels.",
    techniqueCues: [
      "Start with light contraction (25%)",
      "Increase to medium (50%)",
      "Build to strong (75%)",
      "Reach maximum effort (100%)",
      "Step back down gradually",
    ],
    commonMistakes: [
      "Jumping to maximum too quickly",
      "Skipping intensity levels",
      "Not maintaining each level",
      "Rushing through the exercise",
    ],
    safetyNotes:
      "Listen to your body and adjust intensity as needed. Maximum effort should still feel controlled.",
    intensity: "high",
  },
  {
    id: "reverse-kegel",
    name: "Relaxation / Reverse Kegel",
    description:
      "Gentle release and lengthening of pelvic floor muscles to prevent tension and improve flexibility.",
    techniqueCues: [
      "Gently bear down as if releasing gas",
      "Feel the pelvic floor drop and expand",
      "Breathe deeply into your belly",
      "Maintain relaxation without pushing hard",
    ],
    commonMistakes: [
      "Pushing too forcefully",
      "Holding breath while bearing down",
      "Tensing instead of relaxing",
      "Rushing the relaxation phase",
    ],
    safetyNotes:
      "This should feel gentle and relieving. Stop if you experience discomfort.",
    intensity: "low",
  },
  {
    id: "breathing-coordination",
    name: "Breathing & Pelvic Coordination",
    description:
      "Synchronizing breath with pelvic floor movement for enhanced mind-body connection.",
    techniqueCues: [
      "Inhale deeply, relax the pelvic floor",
      "Exhale slowly, gently contract",
      "Maintain smooth, flowing breath",
      "Feel the natural rhythm",
    ],
    commonMistakes: [
      "Reversing breath and contraction",
      "Shallow breathing",
      "Forcing the coordination",
      "Losing focus on the breath",
    ],
    safetyNotes:
      "If you feel dizzy, return to normal breathing. Take breaks as needed.",
    intensity: "low",
  },
  {
    id: "core-integration",
    name: "Light Core Integration",
    description:
      "Combining gentle core activation with pelvic floor work for functional strength.",
    techniqueCues: [
      "Engage pelvic floor first",
      "Gently draw navel toward spine",
      "Keep shoulders relaxed",
      "Maintain natural spine position",
    ],
    commonMistakes: [
      "Over-engaging abdominals",
      "Holding breath during engagement",
      "Losing pelvic floor connection",
      "Tensing neck and shoulders",
    ],
    safetyNotes:
      "Keep engagement subtle. This should not cause strain or discomfort.",
    intensity: "medium",
  },
  {
    id: "endurance-hold",
    name: "Endurance Hold",
    description:
      "Extended duration holds that build stamina and sustained muscle engagement.",
    techniqueCues: [
      "Find a sustainable contraction level (50-70%)",
      "Breathe normally throughout",
      "Maintain steady engagement",
      "Release completely when done",
    ],
    commonMistakes: [
      "Starting too strong",
      "Holding breath",
      "Letting engagement fade early",
      "Tensing other muscle groups",
    ],
    safetyNotes:
      "If you cannot maintain the hold, reduce intensity rather than stopping completely.",
    intensity: "high",
  },
  {
    id: "quick-flicks",
    name: "Quick Flicks",
    description:
      "Ultra-rapid contractions for developing fast-twitch muscle response and reflexive control.",
    techniqueCues: [
      "Contract and release as fast as possible",
      "Keep movements small and precise",
      "Maintain control even at speed",
      "Breathe naturally",
    ],
    commonMistakes: [
      "Sacrificing control for speed",
      "Not fully releasing",
      "Tensing thighs or buttocks",
      "Holding breath",
    ],
    safetyNotes:
      "Quality is more important than speed. Build up gradually.",
    intensity: "medium",
  },
  {
    id: "release-relax",
    name: "Release & Relax",
    description:
      "Focused relaxation technique to release tension and restore natural muscle tone.",
    techniqueCues: [
      "Take a deep breath in",
      "As you exhale, let go of all tension",
      "Feel heaviness in your pelvis",
      "Allow complete surrender",
    ],
    commonMistakes: [
      "Actively pushing down",
      "Not allowing enough time",
      "Maintaining background tension",
      "Rushing to the next exercise",
    ],
    safetyNotes:
      "Relaxation is as important as contraction. Give yourself full permission to rest.",
    intensity: "low",
  },
  {
    id: "body-scan-cooldown",
    name: "Body Scan Cooldown",
    description:
      "Progressive relaxation from head to toe to fully release and restore the body.",
    techniqueCues: [
      "Close your eyes if comfortable",
      "Scan from head to feet",
      "Release tension in each area",
      "Breathe into tight spots",
    ],
    commonMistakes: [
      "Rushing through body parts",
      "Not noticing held tension",
      "Skipping the exercise",
      "Not breathing deeply",
    ],
    safetyNotes:
      "Take your time. This is your moment to integrate the practice.",
    intensity: "low",
  },
];

const createBeginnerSessions = (): Session[] => {
  return Array.from({ length: 14 }, (_, i) => ({
    id: `beginner-day-${i + 1}`,
    planId: "beginner",
    dayIndex: i + 1,
    title: `Day ${i + 1}: ${i < 5 ? "Foundation" : i < 10 ? "Building" : "Strengthening"}`,
    description:
      i < 5
        ? "Focus on proper technique and awareness"
        : i < 10
          ? "Increase duration and add variety"
          : "Build endurance and control",
    totalSeconds: 180 + i * 15,
    steps: [
      {
        id: `beginner-${i + 1}-warmup`,
        exerciseId: "breathing-coordination",
        stepType: "warmup",
        workSeconds: 30,
        restSeconds: 10,
        sets: 2,
        instruction: "Breathe deeply and connect with your pelvic floor",
      },
      {
        id: `beginner-${i + 1}-main-1`,
        exerciseId: "gentle-hold",
        stepType: "main",
        workSeconds: 5 + Math.floor(i / 3),
        restSeconds: 10,
        sets: 5 + Math.floor(i / 5),
        instruction: "Hold gently, then fully release",
      },
      {
        id: `beginner-${i + 1}-main-2`,
        exerciseId: i < 7 ? "pulsed-contractions" : "quick-flicks",
        stepType: "main",
        workSeconds: 1,
        restSeconds: 1,
        sets: 1,
        reps: 10 + i,
        instruction: "Quick pulses with full relaxation between each",
      },
      {
        id: `beginner-${i + 1}-cooldown`,
        exerciseId: "release-relax",
        stepType: "cooldown",
        workSeconds: 30,
        restSeconds: 0,
        sets: 1,
        instruction: "Release all tension and breathe deeply",
      },
    ],
  }));
};

const createIntermediateSessions = (): Session[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `intermediate-day-${i + 1}`,
    planId: "intermediate",
    dayIndex: i + 1,
    title: `Day ${i + 1}: ${i < 10 ? "Progression" : i < 20 ? "Intensity" : "Mastery"}`,
    description:
      i < 10
        ? "Build on foundations with longer holds"
        : i < 20
          ? "Add intensity and complexity"
          : "Develop advanced control",
    totalSeconds: 240 + i * 10,
    steps: [
      {
        id: `intermediate-${i + 1}-warmup`,
        exerciseId: "breathing-coordination",
        stepType: "warmup",
        workSeconds: 30,
        restSeconds: 10,
        sets: 2,
        instruction: "Center yourself with breath awareness",
      },
      {
        id: `intermediate-${i + 1}-main-1`,
        exerciseId: "stair-step-holds",
        stepType: "main",
        workSeconds: 20 + Math.floor(i / 5),
        restSeconds: 15,
        sets: 3,
        instruction: "Build through intensity levels",
      },
      {
        id: `intermediate-${i + 1}-main-2`,
        exerciseId: "endurance-hold",
        stepType: "main",
        workSeconds: 15 + Math.floor(i / 3),
        restSeconds: 20,
        sets: 4,
        instruction: "Maintain steady engagement",
      },
      {
        id: `intermediate-${i + 1}-main-3`,
        exerciseId: "core-integration",
        stepType: "main",
        workSeconds: 10,
        restSeconds: 10,
        sets: 5,
        instruction: "Connect pelvic floor with core",
      },
      {
        id: `intermediate-${i + 1}-cooldown`,
        exerciseId: "body-scan-cooldown",
        stepType: "cooldown",
        workSeconds: 60,
        restSeconds: 0,
        sets: 1,
        instruction: "Full body relaxation and integration",
      },
    ],
  }));
};

const createAdvancedSessions = (): Session[] => {
  return Array.from({ length: 60 }, (_, i) => ({
    id: `advanced-day-${i + 1}`,
    planId: "advanced",
    dayIndex: i + 1,
    title: `Day ${i + 1}: ${i < 20 ? "Elite Foundation" : i < 40 ? "Peak Performance" : "Mastery Integration"}`,
    description:
      i < 20
        ? "High-intensity foundational work"
        : i < 40
          ? "Maximum control and endurance"
          : "Integration and sustained excellence",
    totalSeconds: 360 + i * 5,
    steps: [
      {
        id: `advanced-${i + 1}-warmup-1`,
        exerciseId: "breathing-coordination",
        stepType: "warmup",
        workSeconds: 30,
        restSeconds: 5,
        sets: 2,
        instruction: "Deep breath awareness",
      },
      {
        id: `advanced-${i + 1}-warmup-2`,
        exerciseId: "gentle-hold",
        stepType: "warmup",
        workSeconds: 10,
        restSeconds: 5,
        sets: 3,
        instruction: "Activate and prepare",
      },
      {
        id: `advanced-${i + 1}-main-1`,
        exerciseId: "stair-step-holds",
        stepType: "main",
        workSeconds: 30 + Math.floor(i / 10),
        restSeconds: 15,
        sets: 4,
        instruction: "Full intensity progression",
      },
      {
        id: `advanced-${i + 1}-main-2`,
        exerciseId: "endurance-hold",
        stepType: "main",
        workSeconds: 30 + Math.floor(i / 5),
        restSeconds: 20,
        sets: 5,
        instruction: "Extended stamina challenge",
      },
      {
        id: `advanced-${i + 1}-main-3`,
        exerciseId: "quick-flicks",
        stepType: "main",
        workSeconds: 1,
        restSeconds: 1,
        sets: 1,
        reps: 20 + Math.floor(i / 3),
        instruction: "Speed and precision work",
      },
      {
        id: `advanced-${i + 1}-main-4`,
        exerciseId: "core-integration",
        stepType: "main",
        workSeconds: 15,
        restSeconds: 10,
        sets: 6,
        instruction: "Full-body coordination",
      },
      {
        id: `advanced-${i + 1}-cooldown-1`,
        exerciseId: "reverse-kegel",
        stepType: "cooldown",
        workSeconds: 30,
        restSeconds: 10,
        sets: 2,
        instruction: "Release and lengthen",
      },
      {
        id: `advanced-${i + 1}-cooldown-2`,
        exerciseId: "body-scan-cooldown",
        stepType: "cooldown",
        workSeconds: 90,
        restSeconds: 0,
        sets: 1,
        instruction: "Complete restoration",
      },
    ],
  }));
};

export const plans: Plan[] = [
  {
    id: "beginner",
    name: "Beginner Program",
    level: "beginner",
    durationDays: 14,
    description:
      "Perfect for those new to pelvic floor training. Build proper technique and foundational strength over 14 days.",
    sessions: createBeginnerSessions(),
  },
  {
    id: "intermediate",
    name: "Intermediate Program",
    level: "intermediate",
    durationDays: 30,
    description:
      "Take your training to the next level with increased intensity and duration. Build real endurance and control.",
    sessions: createIntermediateSessions(),
  },
  {
    id: "advanced",
    name: "Advanced Program",
    level: "advanced",
    durationDays: 60,
    description:
      "Elite-level training for maximum strength, endurance, and control. A comprehensive 60-day transformation.",
    sessions: createAdvancedSessions(),
  },
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find((e) => e.id === id);
};

export const getPlanById = (id: string): Plan | undefined => {
  return plans.find((p) => p.id === id);
};

export const getSessionById = (id: string): Session | undefined => {
  for (const plan of plans) {
    const session = plan.sessions.find((s) => s.id === id);
    if (session) return session;
  }
  return undefined;
};

export const getDemoSession = (): Session => {
  return {
    id: "demo-session",
    planId: "demo",
    dayIndex: 0,
    title: "Demo Session",
    description: "Try a short sample of what Kegel Coach offers",
    totalSeconds: 120,
    steps: [
      {
        id: "demo-warmup",
        exerciseId: "breathing-coordination",
        stepType: "warmup",
        workSeconds: 20,
        restSeconds: 5,
        sets: 1,
        instruction: "Breathe deeply and connect with your body",
      },
      {
        id: "demo-main",
        exerciseId: "gentle-hold",
        stepType: "main",
        workSeconds: 5,
        restSeconds: 5,
        sets: 5,
        instruction: "Gentle contraction, then full release",
      },
      {
        id: "demo-cooldown",
        exerciseId: "release-relax",
        stepType: "cooldown",
        workSeconds: 20,
        restSeconds: 0,
        sets: 1,
        instruction: "Release and relax completely",
      },
    ],
  };
};

type SessionTranslations = {
  day: string;
  foundation: string;
  building: string;
  strengthening: string;
  progression: string;
  intensity: string;
  mastery: string;
  eliteFoundation: string;
  peakPerformance: string;
  masteryIntegration: string;
  focusTechnique: string;
  increaseDuration: string;
  buildEndurance: string;
  buildFoundations: string;
  addIntensity: string;
  developControl: string;
  highIntensity: string;
  maxControl: string;
  integration: string;
};

export const getTranslatedSessionTitle = (
  session: Session,
  t: SessionTranslations
): string => {
  const { planId, dayIndex } = session;
  
  if (planId === "beginner") {
    const phase = dayIndex <= 5 ? t.foundation : dayIndex <= 10 ? t.building : t.strengthening;
    return `${t.day} ${dayIndex}: ${phase}`;
  }
  
  if (planId === "intermediate") {
    const phase = dayIndex <= 10 ? t.progression : dayIndex <= 20 ? t.intensity : t.mastery;
    return `${t.day} ${dayIndex}: ${phase}`;
  }
  
  if (planId === "advanced") {
    const phase = dayIndex <= 20 ? t.eliteFoundation : dayIndex <= 40 ? t.peakPerformance : t.masteryIntegration;
    return `${t.day} ${dayIndex}: ${phase}`;
  }
  
  return session.title;
};

export const getTranslatedSessionDescription = (
  session: Session,
  t: SessionTranslations
): string => {
  const { planId, dayIndex } = session;
  
  if (planId === "beginner") {
    if (dayIndex <= 5) return t.focusTechnique;
    if (dayIndex <= 10) return t.increaseDuration;
    return t.buildEndurance;
  }
  
  if (planId === "intermediate") {
    if (dayIndex <= 10) return t.buildFoundations;
    if (dayIndex <= 20) return t.addIntensity;
    return t.developControl;
  }
  
  if (planId === "advanced") {
    if (dayIndex <= 20) return t.highIntensity;
    if (dayIndex <= 40) return t.maxControl;
    return t.integration;
  }
  
  return session.description;
};
