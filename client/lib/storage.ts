import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ONBOARDING_COMPLETE: "@kegel_coach:onboarding_complete",
  USER_GOALS: "@kegel_coach:user_goals",
  USER_EXPERIENCE: "@kegel_coach:user_experience",
  IS_SUBSCRIBED: "@kegel_coach:is_subscribed",
  PROGRESS_DATA: "@kegel_coach:progress_data",
  CURRENT_STREAK: "@kegel_coach:current_streak",
  TOTAL_MINUTES: "@kegel_coach:total_minutes",
  SESSIONS_COMPLETED: "@kegel_coach:sessions_completed",
  LAST_SESSION_DATE: "@kegel_coach:last_session_date",
  SETTINGS: "@kegel_coach:settings",
};

export interface UserGoals {
  endurance: boolean;
  control: boolean;
  recovery: boolean;
}

export interface ProgressData {
  completedSessions: string[];
  completedDates: string[];
  currentPlanId?: string;
  currentDayIndex?: number;
}

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime?: string;
}

export const storage = {
  async getOnboardingComplete(): Promise<boolean> {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
    return value === "true";
  },

  async setOnboardingComplete(complete: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, String(complete));
  },

  async getUserGoals(): Promise<UserGoals | null> {
    const value = await AsyncStorage.getItem(KEYS.USER_GOALS);
    return value ? JSON.parse(value) : null;
  },

  async setUserGoals(goals: UserGoals): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_GOALS, JSON.stringify(goals));
  },

  async getUserExperience(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.USER_EXPERIENCE);
  },

  async setUserExperience(experience: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_EXPERIENCE, experience);
  },

  async getIsSubscribed(): Promise<boolean> {
    const value = await AsyncStorage.getItem(KEYS.IS_SUBSCRIBED);
    return value === "true";
  },

  async setIsSubscribed(subscribed: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.IS_SUBSCRIBED, String(subscribed));
  },

  async getProgressData(): Promise<ProgressData> {
    const value = await AsyncStorage.getItem(KEYS.PROGRESS_DATA);
    return value
      ? JSON.parse(value)
      : { completedSessions: [], completedDates: [], currentDayIndex: 1 };
  },

  async setProgressData(data: ProgressData): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROGRESS_DATA, JSON.stringify(data));
  },

  async getCurrentStreak(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.CURRENT_STREAK);
    return value ? parseInt(value, 10) : 0;
  },

  async setCurrentStreak(streak: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.CURRENT_STREAK, String(streak));
  },

  async getTotalMinutes(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.TOTAL_MINUTES);
    return value ? parseInt(value, 10) : 0;
  },

  async setTotalMinutes(minutes: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.TOTAL_MINUTES, String(minutes));
  },

  async getSessionsCompleted(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.SESSIONS_COMPLETED);
    return value ? parseInt(value, 10) : 0;
  },

  async setSessionsCompleted(count: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.SESSIONS_COMPLETED, String(count));
  },

  async getLastSessionDate(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.LAST_SESSION_DATE);
  },

  async setLastSessionDate(date: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_SESSION_DATE, date);
  },

  async getSettings(): Promise<Settings> {
    const value = await AsyncStorage.getItem(KEYS.SETTINGS);
    return value
      ? JSON.parse(value)
      : {
          soundEnabled: true,
          vibrationEnabled: true,
          reminderEnabled: false,
        };
  },

  async setSettings(settings: Settings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  async clearAllData(): Promise<void> {
    const keys = Object.values(KEYS);
    await AsyncStorage.multiRemove(keys);
  },
};
