import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: keyof typeof Feather.glyphMap;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function SelectionCard({
  title,
  description,
  icon,
  selected = false,
  onPress,
  disabled = false,
}: SelectionCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected
            ? theme.backgroundSecondary
            : theme.cardBackground,
          borderColor: selected ? theme.primary : theme.border,
          borderWidth: 2,
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
        },
      ]}
    >
      {icon ? (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: selected ? theme.primary : theme.backgroundSecondary },
          ]}
        >
          <Feather
            name={icon}
            size={24}
            color={selected ? theme.buttonText : theme.primary}
          />
        </View>
      ) : null}
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description ? (
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            {description}
          </ThemedText>
        ) : null}
      </View>
      {selected ? (
        <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
          <Feather name="check" size={16} color={theme.buttonText} />
        </View>
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
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
});
