import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { SessionCard } from "@/components/SessionCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getPlanById } from "@/lib/trainingData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PlanDetail">;
type RouteProps = RouteProp<RootStackParamList, "PlanDetail">;

export default function PlanDetailScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { isSubscribed, progressData, sessionsCompleted } = useAppState();

  const plan = getPlanById(route.params.planId);

  const getTranslatedLevel = (level: string) => {
    switch (level) {
      case "beginner":
        return t.levels.beginner;
      case "intermediate":
        return t.levels.intermediate;
      case "advanced":
        return t.levels.advanced;
      default:
        return level;
    }
  };

  const getTranslatedPlanName = () => {
    if (!plan) return "";
    switch (plan.id) {
      case "beginner":
        return t.plans.beginnerName;
      case "intermediate":
        return t.plans.intermediateName;
      case "advanced":
        return t.plans.advancedName;
      default:
        return plan.name;
    }
  };

  const getTranslatedPlanDesc = () => {
    if (!plan) return "";
    switch (plan.id) {
      case "beginner":
        return t.plans.beginnerDesc;
      case "intermediate":
        return t.plans.intermediateDesc;
      case "advanced":
        return t.plans.advancedDesc;
      default:
        return plan.description;
    }
  };

  if (!plan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>{t.plans.planNotFound}</ThemedText>
      </View>
    );
  }

  const completedSessionIds = progressData.completedSessions;
  const firstIncompleteSession = plan.sessions.find(
    (s) => !completedSessionIds.includes(s.id)
  );

  const getLevelColor = () => {
    switch (plan.level) {
      case "beginner":
        return theme.success;
      case "intermediate":
        return theme.accent;
      case "advanced":
        return theme.error;
      default:
        return theme.primary;
    }
  };

  const handleSessionPress = (sessionId: string) => {
    if (!isSubscribed && sessionsCompleted >= 1) {
      navigation.navigate("Paywall");
      return;
    }
    navigation.navigate("SessionPlayer", { sessionId });
  };

  const handleStartPlan = () => {
    if (!isSubscribed && sessionsCompleted >= 1) {
      navigation.navigate("Paywall");
      return;
    }
    if (firstIncompleteSession) {
      navigation.navigate("SessionPlayer", { sessionId: firstIncompleteSession.id });
    }
  };

  const progress =
    (completedSessionIds.filter((id) =>
      plan.sessions.some((s) => s.id === id)
    ).length /
      plan.sessions.length) *
    100;

  const isLocked = !isSubscribed && sessionsCompleted >= 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.planHeader}>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: getLevelColor() + "20" },
            ]}
          >
            <Feather
              name={
                plan.level === "beginner"
                  ? "star"
                  : plan.level === "intermediate"
                    ? "award"
                    : "zap"
              }
              size={16}
              color={getLevelColor()}
            />
            <ThemedText style={[styles.levelText, { color: getLevelColor() }]}>
              {getTranslatedLevel(plan.level)}
            </ThemedText>
          </View>

          <ThemedText style={styles.planTitle}>{getTranslatedPlanName()}</ThemedText>
          <ThemedText style={[styles.planDescription, { color: theme.textSecondary }]}>
            {getTranslatedPlanDesc()}
          </ThemedText>

          <View style={styles.planMeta}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
                {plan.durationDays} {t.plans.daysCount}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Feather name="layers" size={16} color={theme.textSecondary} />
              <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
                {plan.sessions.length} {t.plans.sessionsCount}
              </ThemedText>
            </View>
          </View>

          {progress > 0 ? (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <ThemedText style={[styles.progressLabel, { color: theme.textSecondary }]}>
                  {t.plans.yourProgress}
                </ThemedText>
                <ThemedText style={[styles.progressValue, { color: theme.primary }]}>
                  {Math.round(progress)}%
                </ThemedText>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.primary, width: `${progress}%` },
                  ]}
                />
              </View>
            </View>
          ) : null}
        </View>

        <ThemedText style={styles.sessionsTitle}>{t.plans.sessionsTitle}</ThemedText>

        {plan.sessions.map((session, index) => {
          const isCompleted = completedSessionIds.includes(session.id);
          const isCurrent = session.id === firstIncompleteSession?.id;
          const isSessionLocked = isLocked && index > 0;

          return (
            <SessionCard
              key={session.id}
              session={session}
              onPress={() => handleSessionPress(session.id)}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isLocked={isSessionLocked}
            />
          );
        })}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.xl,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        {isLocked ? (
          <PrimaryButton
            title={t.paywall.unlockFullAccess}
            onPress={() => navigation.navigate("Paywall")}
            icon="unlock"
            size="large"
          />
        ) : (
          <PrimaryButton
            title={progress > 0 ? t.plans.continueTraining : t.plans.startPlan}
            onPress={handleStartPlan}
            icon="play"
            size="large"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  planHeader: {
    marginBottom: Spacing["2xl"],
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  levelText: {
    ...Typography.smallMedium,
  },
  planTitle: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  planDescription: {
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  planMeta: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    ...Typography.body,
  },
  progressContainer: {
    marginTop: Spacing.xl,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    ...Typography.body,
  },
  progressValue: {
    ...Typography.bodyMedium,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  sessionsTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
});
