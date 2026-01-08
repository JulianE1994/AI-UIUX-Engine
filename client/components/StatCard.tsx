import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Feather.glyphMap;
  color?: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: (color || theme.primary) + "20" },
        ]}
      >
        <Feather name={icon} size={20} color={color || theme.primary} />
      </View>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.small,
    textAlign: "center",
  },
});
