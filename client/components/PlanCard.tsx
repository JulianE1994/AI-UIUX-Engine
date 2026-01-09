import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { Plan } from "@/lib/trainingData";

interface PlanCardProps {
  plan: Plan;
  onPress: () => void;
  progress?: number;
  isLocked?: boolean;
}

export function PlanCard({
  plan,
  onPress,
  progress = 0,
  isLocked = false,
}: PlanCardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const getTranslatedLevel = () => {
    switch (plan.level) {
      case "beginner":
        return t.levels.beginner;
      case "intermediate":
        return t.levels.intermediate;
      case "advanced":
        return t.levels.advanced;
      default:
        return plan.level;
    }
  };

  const getTranslatedPlanName = () => {
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

  const getLevelIcon = (): keyof typeof Feather.glyphMap => {
    switch (plan.level) {
      case "beginner":
        return "star";
      case "intermediate":
        return "award";
      case "advanced":
        return "zap";
      default:
        return "star";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : isLocked ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: getLevelColor() + "20" },
          ]}
        >
          <Feather name={getLevelIcon()} size={16} color={getLevelColor()} />
          <ThemedText
            style={[styles.levelText, { color: getLevelColor() }]}
          >
            {getTranslatedLevel()}
          </ThemedText>
        </View>
        {isLocked ? (
          <View style={[styles.lockBadge, { backgroundColor: theme.locked + "20" }]}>
            <Feather name="lock" size={14} color={theme.locked} />
          </View>
        ) : null}
      </View>

      <ThemedText style={styles.title}>{getTranslatedPlanName()}</ThemedText>
      <ThemedText
        style={[styles.description, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {getTranslatedPlanDesc()}
      </ThemedText>

      <View style={styles.footer}>
        <View style={styles.infoContainer}>
          <Feather name="calendar" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {plan.durationDays} {t.plans.daysCount}
          </ThemedText>
        </View>
        <View style={styles.infoContainer}>
          <Feather name="layers" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {plan.sessions.length} {t.plans.sessionsCount}
          </ThemedText>
        </View>
      </View>

      {progress > 0 ? (
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressTrack, { backgroundColor: theme.border }]}
          >
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.primary,
                  width: `${Math.min(progress, 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText style={[styles.progressText, { color: theme.textSecondary }]}>
            {Math.round(progress)}%
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  levelText: {
    ...Typography.smallMedium,
  },
  lockBadge: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  title: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  infoText: {
    ...Typography.small,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    ...Typography.small,
    width: 40,
    textAlign: "right",
  },
});
