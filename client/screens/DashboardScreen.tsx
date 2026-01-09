import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "@/components/StatCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { plans, getDemoSession, getTranslatedSessionTitle, getTranslatedSessionDescription } from "@/lib/trainingData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { currentStreak, totalMinutes, sessionsCompleted, isSubscribed, progressData, userExperience } =
    useAppState();

  const getTranslatedPlanName = (planId: string) => {
    switch (planId) {
      case "beginner":
        return t.plans.beginnerName;
      case "intermediate":
        return t.plans.intermediateName;
      case "advanced":
        return t.plans.advancedName;
      default:
        return planId;
    }
  };

  const getRecommendedPlan = () => {
    if (userExperience === "advanced") return plans[2];
    if (userExperience === "intermediate") return plans[1];
    return plans[0];
  };

  const recommendedPlan = getRecommendedPlan();
  const currentDayIndex = progressData.currentDayIndex || 1;
  const nextSession = recommendedPlan.sessions.find(
    (s) => s.dayIndex === currentDayIndex
  );

  const handleStartSession = () => {
    if (!isSubscribed && sessionsCompleted >= 1) {
      navigation.navigate("Paywall");
      return;
    }

    if (nextSession) {
      navigation.navigate("SessionPlayer", { sessionId: nextSession.id });
    } else {
      const demoSession = getDemoSession();
      navigation.navigate("SessionPlayer", { sessionId: demoSession.id });
    }
  };

  const handleViewLibrary = () => {
    const tabNav = navigation.getParent();
    if (tabNav) {
      tabNav.navigate("Library");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.greeting}>{t.dashboard.welcomeBack}</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t.dashboard.readyForWorkout}
          </ThemedText>
        </View>
        {currentStreak > 0 ? (
          <View style={[styles.streakBadge, { backgroundColor: theme.accent + "20" }]}>
            <Feather name="zap" size={16} color={theme.accent} />
            <ThemedText style={[styles.streakText, { color: theme.accent }]}>
              {currentStreak} {currentStreak === 1 ? t.dashboard.day : t.dashboard.days} {t.plans.streak}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title={t.progress.streak}
          value={`${currentStreak} ${t.dashboard.days}`}
          icon="zap"
          color={theme.accent}
        />
        <StatCard
          title={t.dashboard.totalTime}
          value={`${totalMinutes} ${t.dashboard.mins}`}
          icon="clock"
          color={theme.primary}
        />
        <StatCard
          title={t.dashboard.sessions}
          value={sessionsCompleted}
          icon="check-circle"
          color={theme.success}
        />
      </View>

      <View
        style={[
          styles.recommendedCard,
          { backgroundColor: theme.primary + "10", borderColor: theme.primary },
        ]}
      >
        <View style={styles.recommendedHeader}>
          <View>
            <ThemedText
              style={[styles.recommendedLabel, { color: theme.primary }]}
            >
              {t.dashboard.recommendedSession}
            </ThemedText>
            <ThemedText style={styles.recommendedTitle}>
              {nextSession ? getTranslatedSessionTitle(nextSession, t.sessions) : t.plans.demoSession}
            </ThemedText>
          </View>
          <View
            style={[styles.dayBadge, { backgroundColor: theme.primary + "20" }]}
          >
            <ThemedText style={[styles.dayText, { color: theme.primary }]}>
              {t.library.day} {currentDayIndex}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.recommendedDesc, { color: theme.textSecondary }]}>
          {nextSession ? getTranslatedSessionDescription(nextSession, t.sessions) : t.plans.demoDescription}
        </ThemedText>
        <View style={styles.recommendedMeta}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {Math.floor((nextSession?.totalSeconds || 120) / 60)} {t.plans.min}
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Feather name="list" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {nextSession?.steps.length || 3} {t.plans.exercises}
            </ThemedText>
          </View>
        </View>
        <PrimaryButton
          title={t.dashboard.startSession}
          onPress={handleStartSession}
          icon="play"
          size="large"
          style={{ marginTop: Spacing.lg }}
        />
      </View>

      {!isSubscribed ? (
        <Pressable
          onPress={() => navigation.navigate("Paywall")}
          style={({ pressed }) => [
            styles.upgradeCard,
            {
              backgroundColor: theme.accent + "15",
              borderColor: theme.accent,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View style={styles.upgradeContent}>
            <Feather name="unlock" size={24} color={theme.accent} />
            <View style={styles.upgradeText}>
              <ThemedText style={styles.upgradeTitle}>
                {t.paywall.unlockFullAccess}
              </ThemedText>
              <ThemedText
                style={[styles.upgradeDesc, { color: theme.textSecondary }]}
              >
                {t.paywall.startJourney}
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.accent} />
        </Pressable>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t.dashboard.allPrograms}</ThemedText>
          <Pressable onPress={handleViewLibrary}>
            <ThemedText style={[styles.seeAll, { color: theme.primary }]}>
              {t.dashboard.viewLibrary}
            </ThemedText>
          </Pressable>
        </View>
        {plans.slice(0, 2).map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => navigation.navigate("PlanDetail", { planId: plan.id })}
            style={({ pressed }) => [
              styles.planPreview,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View style={styles.planContent}>
              <ThemedText style={styles.planName}>{getTranslatedPlanName(plan.id)}</ThemedText>
              <ThemedText
                style={[styles.planDuration, { color: theme.textSecondary }]}
              >
                {plan.durationDays} {t.plans.daysCount}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing["2xl"],
  },
  greeting: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  streakText: {
    ...Typography.smallMedium,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  recommendedCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  recommendedLabel: {
    ...Typography.smallMedium,
    marginBottom: Spacing.xs,
  },
  recommendedTitle: {
    ...Typography.h3,
  },
  dayBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  dayText: {
    ...Typography.smallMedium,
  },
  recommendedDesc: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  recommendedMeta: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    ...Typography.small,
  },
  upgradeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  upgradeContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    ...Typography.bodyMedium,
    marginBottom: 2,
  },
  upgradeDesc: {
    ...Typography.small,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
  },
  seeAll: {
    ...Typography.bodyMedium,
  },
  planPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  planContent: {
    flex: 1,
  },
  planName: {
    ...Typography.bodyMedium,
    marginBottom: 2,
  },
  planDuration: {
    ...Typography.small,
  },
});
