import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            {
              backgroundColor:
                i < currentStep ? theme.primary : theme.backgroundSecondary,
              flex: 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.xs,
    height: 4,
    paddingHorizontal: Spacing.xl,
  },
  step: {
    borderRadius: BorderRadius.full,
  },
});
