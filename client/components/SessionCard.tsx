import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { Session, getTranslatedSessionTitle, getTranslatedSessionDescription } from "@/lib/trainingData";

interface SessionCardProps {
  session: Session;
  onPress: () => void;
  isCompleted?: boolean;
  isLocked?: boolean;
  isCurrent?: boolean;
}

export function SessionCard({
  session,
  onPress,
  isCompleted = false,
  isLocked = false,
  isCurrent = false,
}: SessionCardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${t.plans.min}`;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isCurrent
            ? theme.primary + "15"
            : theme.cardBackground,
          borderColor: isCurrent ? theme.primary : theme.border,
          opacity: pressed ? 0.9 : isLocked ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.dayBadge,
              {
                backgroundColor: isCompleted
                  ? theme.success + "20"
                  : isCurrent
                    ? theme.primary + "20"
                    : theme.backgroundSecondary,
              },
            ]}
          >
            {isCompleted ? (
              <Feather name="check" size={16} color={theme.success} />
            ) : isLocked ? (
              <Feather name="lock" size={16} color={theme.locked} />
            ) : (
              <ThemedText
                style={[
                  styles.dayText,
                  { color: isCurrent ? theme.primary : theme.text },
                ]}
              >
                {session.dayIndex}
              </ThemedText>
            )}
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {getTranslatedSessionTitle(session, t.sessions)}
            </ThemedText>
            <ThemedText
              style={[styles.description, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {getTranslatedSessionDescription(session, t.sessions)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.durationContainer}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.duration, { color: theme.textSecondary }]}>
              {formatDuration(session.totalSeconds)}
            </ThemedText>
          </View>
          <View style={styles.stepsContainer}>
            <Feather name="list" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.steps, { color: theme.textSecondary }]}>
              {session.steps.length} {t.plans.exercises}
            </ThemedText>
          </View>
        </View>
      </View>
      {!isLocked ? (
        <Feather
          name="chevron-right"
          size={20}
          color={isCurrent ? theme.primary : theme.textSecondary}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  dayText: {
    ...Typography.bodyMedium,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    marginBottom: 2,
  },
  description: {
    ...Typography.small,
  },
  footer: {
    flexDirection: "row",
    marginLeft: Spacing["5xl"],
    gap: Spacing.lg,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  duration: {
    ...Typography.small,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  steps: {
    ...Typography.small,
  },
});
