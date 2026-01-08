import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { PlanCard } from "@/components/PlanCard";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { plans, Plan } from "@/lib/trainingData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const levels = ["all", "beginner", "intermediate", "advanced"] as const;
type Level = (typeof levels)[number];

export default function LibraryScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { isSubscribed, progressData, sessionsCompleted } = useAppState();

  const [selectedLevel, setSelectedLevel] = useState<Level>("all");

  const levelLabels: Record<Level, string> = {
    all: t.library.all,
    beginner: t.library.beginner,
    intermediate: t.library.intermediate,
    advanced: t.library.advanced,
  };

  const filteredPlans =
    selectedLevel === "all"
      ? plans
      : plans.filter((p) => p.level === selectedLevel);

  const getPlanProgress = (plan: Plan) => {
    const completedInPlan = plan.sessions.filter((s) =>
      progressData.completedSessions.includes(s.id)
    ).length;
    return (completedInPlan / plan.sessions.length) * 100;
  };

  const handlePlanPress = (planId: string) => {
    if (!isSubscribed && sessionsCompleted >= 1) {
      navigation.navigate("Paywall");
      return;
    }
    navigation.navigate("PlanDetail", { planId });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xl }]}>
        <ThemedText style={styles.title}>{t.library.title}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t.library.subtitle}
        </ThemedText>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {levels.map((level) => (
            <Pressable
              key={level}
              onPress={() => setSelectedLevel(level)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedLevel === level
                      ? theme.primary
                      : theme.backgroundSecondary,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  {
                    color:
                      selectedLevel === level
                        ? theme.buttonText
                        : theme.text,
                  },
                ]}
              >
                {levelLabels[level]}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onPress={() => handlePlanPress(plan.id)}
            progress={getPlanProgress(plan)}
            isLocked={!isSubscribed && sessionsCompleted >= 1}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  filterContainer: {
    marginBottom: Spacing.lg,
  },
  filterScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  filterText: {
    ...Typography.smallMedium,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
});
