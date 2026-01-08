import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "@/components/StatCard";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";

export default function ProgressScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { currentStreak, totalMinutes, sessionsCompleted, progressData, isSubscribed } =
    useAppState();

  const calendarDays = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const startDay = startOfMonth.getDay();

    const days: Array<{ date: string; day: number | null; isCompleted: boolean; isToday: boolean }> = [];

    for (let i = 0; i < startDay; i++) {
      days.push({ date: "", day: null, isCompleted: false, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dateString = date.toISOString().split("T")[0];
      const isCompleted = progressData.completedDates.includes(dateString);
      const isToday = date.toDateString() === today.toDateString();
      days.push({ date: dateString, day, isCompleted, isToday });
    }

    return days;
  }, [progressData.completedDates]);

  const monthName = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weeklyGoal = 5;
  const completedThisWeek = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return progressData.completedDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startOfWeek;
    }).length;
  }, [progressData.completedDates]);

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
      <ThemedText style={styles.title}>Your Progress</ThemedText>
      <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
        Track your pelvic floor training journey
      </ThemedText>

      <View style={styles.statsRow}>
        <StatCard
          title="Current Streak"
          value={`${currentStreak}`}
          icon="zap"
          color={theme.accent}
        />
        <StatCard
          title="Total Minutes"
          value={`${totalMinutes}`}
          icon="clock"
          color={theme.primary}
        />
        <StatCard
          title="Sessions"
          value={`${sessionsCompleted}`}
          icon="check-circle"
          color={theme.success}
        />
      </View>

      <View
        style={[styles.weeklyGoalCard, { backgroundColor: theme.cardBackground }]}
      >
        <View style={styles.weeklyGoalHeader}>
          <ThemedText style={styles.weeklyGoalTitle}>Weekly Goal</ThemedText>
          <ThemedText style={[styles.weeklyGoalProgress, { color: theme.primary }]}>
            {completedThisWeek}/{weeklyGoal}
          </ThemedText>
        </View>
        <View style={[styles.weeklyGoalTrack, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.weeklyGoalBar,
              {
                backgroundColor: theme.primary,
                width: `${Math.min((completedThisWeek / weeklyGoal) * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <ThemedText style={[styles.weeklyGoalHint, { color: theme.textSecondary }]}>
          {completedThisWeek >= weeklyGoal
            ? "Goal achieved this week!"
            : `${weeklyGoal - completedThisWeek} more sessions to reach your goal`}
        </ThemedText>
      </View>

      <View style={[styles.calendarCard, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={styles.calendarTitle}>{monthName}</ThemedText>
        <View style={styles.weekDays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <ThemedText
              key={i}
              style={[styles.weekDay, { color: theme.textSecondary }]}
            >
              {day}
            </ThemedText>
          ))}
        </View>
        <View style={styles.calendar}>
          {calendarDays.map((item, index) => (
            <View
              key={index}
              style={[
                styles.dayCell,
                item.isToday && { borderColor: theme.primary, borderWidth: 2 },
                item.isCompleted && { backgroundColor: theme.primary + "30" },
              ]}
            >
              {item.day !== null ? (
                <>
                  <ThemedText
                    style={[
                      styles.dayNumber,
                      item.isCompleted && { color: theme.primary },
                    ]}
                  >
                    {item.day}
                  </ThemedText>
                  {item.isCompleted ? (
                    <View
                      style={[
                        styles.completedDot,
                        { backgroundColor: theme.primary },
                      ]}
                    />
                  ) : null}
                </>
              ) : null}
            </View>
          ))}
        </View>
      </View>

      {!isSubscribed ? (
        <View
          style={[
            styles.lockedCard,
            { backgroundColor: theme.locked + "15", borderColor: theme.locked },
          ]}
        >
          <Feather name="lock" size={20} color={theme.locked} />
          <ThemedText style={[styles.lockedText, { color: theme.text }]}>
            Unlock full progress tracking with a subscription
          </ThemedText>
        </View>
      ) : null}

      <View
        style={[styles.achievementsCard, { backgroundColor: theme.cardBackground }]}
      >
        <ThemedText style={styles.achievementsTitle}>Milestones</ThemedText>
        <View style={styles.milestones}>
          <View style={styles.milestone}>
            <View
              style={[
                styles.milestoneIcon,
                {
                  backgroundColor:
                    sessionsCompleted >= 1 ? theme.success + "20" : theme.backgroundSecondary,
                },
              ]}
            >
              <Feather
                name="play"
                size={16}
                color={sessionsCompleted >= 1 ? theme.success : theme.textSecondary}
              />
            </View>
            <ThemedText
              style={[
                styles.milestoneText,
                { color: sessionsCompleted >= 1 ? theme.text : theme.textSecondary },
              ]}
            >
              First Session
            </ThemedText>
          </View>
          <View style={styles.milestone}>
            <View
              style={[
                styles.milestoneIcon,
                {
                  backgroundColor:
                    currentStreak >= 7 ? theme.success + "20" : theme.backgroundSecondary,
                },
              ]}
            >
              <Feather
                name="calendar"
                size={16}
                color={currentStreak >= 7 ? theme.success : theme.textSecondary}
              />
            </View>
            <ThemedText
              style={[
                styles.milestoneText,
                { color: currentStreak >= 7 ? theme.text : theme.textSecondary },
              ]}
            >
              7-Day Streak
            </ThemedText>
          </View>
          <View style={styles.milestone}>
            <View
              style={[
                styles.milestoneIcon,
                {
                  backgroundColor:
                    sessionsCompleted >= 30 ? theme.success + "20" : theme.backgroundSecondary,
                },
              ]}
            >
              <Feather
                name="award"
                size={16}
                color={sessionsCompleted >= 30 ? theme.success : theme.textSecondary}
              />
            </View>
            <ThemedText
              style={[
                styles.milestoneText,
                { color: sessionsCompleted >= 30 ? theme.text : theme.textSecondary },
              ]}
            >
              30 Sessions
            </ThemedText>
          </View>
        </View>
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
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing["2xl"],
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  weeklyGoalCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  weeklyGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  weeklyGoalTitle: {
    ...Typography.bodyMedium,
  },
  weeklyGoalProgress: {
    ...Typography.bodyMedium,
  },
  weeklyGoalTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  weeklyGoalBar: {
    height: "100%",
    borderRadius: 4,
  },
  weeklyGoalHint: {
    ...Typography.small,
  },
  calendarCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  calendarTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    ...Typography.small,
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BorderRadius.xs,
  },
  dayNumber: {
    ...Typography.small,
  },
  completedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  lockedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  lockedText: {
    ...Typography.body,
    flex: 1,
  },
  achievementsCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  achievementsTitle: {
    ...Typography.h4,
    marginBottom: Spacing.lg,
  },
  milestones: {
    gap: Spacing.md,
  },
  milestone: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  milestoneIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  milestoneText: {
    ...Typography.body,
  },
});
