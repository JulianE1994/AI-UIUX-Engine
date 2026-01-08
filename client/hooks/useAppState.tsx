import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { storage, UserGoals, ProgressData, Settings } from "@/lib/storage";

interface AppState {
  isLoading: boolean;
  onboardingComplete: boolean;
  isSubscribed: boolean;
  userGoals: UserGoals | null;
  userExperience: string | null;
  currentStreak: number;
  totalMinutes: number;
  sessionsCompleted: number;
  progressData: ProgressData;
  settings: Settings;
  completeOnboarding: () => Promise<void>;
  setUserGoals: (goals: UserGoals) => Promise<void>;
  setUserExperience: (experience: string) => Promise<void>;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  recordSessionComplete: (
    sessionId: string,
    durationMinutes: number
  ) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  resetProgress: () => Promise<void>;
  resetAll: () => Promise<void>;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userGoals, setUserGoalsState] = useState<UserGoals | null>(null);
  const [userExperience, setUserExperienceState] = useState<string | null>(
    null
  );
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [progressData, setProgressData] = useState<ProgressData>({
    completedSessions: [],
    completedDates: [],
    currentDayIndex: 1,
  });
  const [settings, setSettingsState] = useState<Settings>({
    soundEnabled: true,
    vibrationEnabled: true,
    reminderEnabled: false,
  });

  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    try {
      const [
        onboarding,
        subscribed,
        goals,
        experience,
        streak,
        minutes,
        sessions,
        progress,
        savedSettings,
      ] = await Promise.all([
        storage.getOnboardingComplete(),
        storage.getIsSubscribed(),
        storage.getUserGoals(),
        storage.getUserExperience(),
        storage.getCurrentStreak(),
        storage.getTotalMinutes(),
        storage.getSessionsCompleted(),
        storage.getProgressData(),
        storage.getSettings(),
      ]);

      setOnboardingComplete(onboarding);
      setIsSubscribed(subscribed);
      setUserGoalsState(goals);
      setUserExperienceState(experience);
      setCurrentStreak(streak);
      setTotalMinutes(minutes);
      setSessionsCompleted(sessions);
      setProgressData(progress);
      setSettingsState(savedSettings);
    } catch (error) {
      console.error("Error loading app state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = useCallback(async () => {
    await storage.setOnboardingComplete(true);
    setOnboardingComplete(true);
  }, []);

  const setUserGoals = useCallback(async (goals: UserGoals) => {
    await storage.setUserGoals(goals);
    setUserGoalsState(goals);
  }, []);

  const setUserExperience = useCallback(async (experience: string) => {
    await storage.setUserExperience(experience);
    setUserExperienceState(experience);
  }, []);

  const subscribe = useCallback(async () => {
    await storage.setIsSubscribed(true);
    setIsSubscribed(true);
  }, []);

  const unsubscribe = useCallback(async () => {
    await storage.setIsSubscribed(false);
    setIsSubscribed(false);
  }, []);

  const recordSessionComplete = useCallback(
    async (sessionId: string, durationMinutes: number) => {
      const today = new Date().toISOString().split("T")[0];
      const lastDate = await storage.getLastSessionDate();

      const isAlreadyCompleted = progressData.completedSessions.includes(sessionId);

      let newStreak = currentStreak;
      if (lastDate) {
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const diffDays = Math.floor(
          (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
          newStreak = currentStreak;
        } else if (diffDays === 1) {
          newStreak = currentStreak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newTotalMinutes = totalMinutes + Math.max(durationMinutes, 1);
      const newSessionsCompleted = isAlreadyCompleted ? sessionsCompleted : sessionsCompleted + 1;
      const newProgressData = {
        ...progressData,
        completedSessions: isAlreadyCompleted
          ? progressData.completedSessions
          : [...progressData.completedSessions, sessionId],
        completedDates: progressData.completedDates.includes(today)
          ? progressData.completedDates
          : [...progressData.completedDates, today],
        currentDayIndex: (progressData.currentDayIndex || 1) + (isAlreadyCompleted ? 0 : 1),
      };

      await Promise.all([
        storage.setCurrentStreak(newStreak),
        storage.setTotalMinutes(newTotalMinutes),
        storage.setSessionsCompleted(newSessionsCompleted),
        storage.setProgressData(newProgressData),
        storage.setLastSessionDate(today),
      ]);

      setCurrentStreak(newStreak);
      setTotalMinutes(newTotalMinutes);
      setSessionsCompleted(newSessionsCompleted);
      setProgressData(newProgressData);
    },
    [currentStreak, totalMinutes, sessionsCompleted, progressData]
  );

  const updateSettings = useCallback(async (newSettings: Settings) => {
    await storage.setSettings(newSettings);
    setSettingsState(newSettings);
  }, []);

  const resetProgress = useCallback(async () => {
    await Promise.all([
      storage.setCurrentStreak(0),
      storage.setTotalMinutes(0),
      storage.setSessionsCompleted(0),
      storage.setProgressData({ completedSessions: [], completedDates: [], currentDayIndex: 1 }),
    ]);

    setCurrentStreak(0);
    setTotalMinutes(0);
    setSessionsCompleted(0);
    setProgressData({ completedSessions: [], completedDates: [], currentDayIndex: 1 });
  }, []);

  const resetAll = useCallback(async () => {
    await storage.clearAllData();
    setOnboardingComplete(false);
    setIsSubscribed(false);
    setUserGoalsState(null);
    setUserExperienceState(null);
    setCurrentStreak(0);
    setTotalMinutes(0);
    setSessionsCompleted(0);
    setProgressData({ completedSessions: [], completedDates: [], currentDayIndex: 1 });
    setSettingsState({
      soundEnabled: true,
      vibrationEnabled: true,
      reminderEnabled: false,
    });
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        isLoading,
        onboardingComplete,
        isSubscribed,
        userGoals,
        userExperience,
        currentStreak,
        totalMinutes,
        sessionsCompleted,
        progressData,
        settings,
        completeOnboarding,
        setUserGoals,
        setUserExperience,
        subscribe,
        unsubscribe,
        recordSessionComplete,
        updateSettings,
        resetProgress,
        resetAll,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
