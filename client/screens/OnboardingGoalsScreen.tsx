import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SelectionCard } from "@/components/SelectionCard";
import { StepIndicator } from "@/components/StepIndicator";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { Spacing, Typography } from "@/constants/theme";
import { OnboardingStackParamList } from "@/navigation/OnboardingStackNavigator";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, "Goals">;

export default function OnboardingGoalsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { setUserGoals } = useAppState();

  const [selectedGoals, setSelectedGoals] = useState({
    endurance: false,
    control: false,
    recovery: false,
  });

  const toggleGoal = (goal: "endurance" | "control" | "recovery") => {
    setSelectedGoals((prev) => ({ ...prev, [goal]: !prev[goal] }));
  };

  const hasSelection = Object.values(selectedGoals).some(Boolean);

  const handleContinue = async () => {
    await setUserGoals(selectedGoals);
    navigation.navigate("Experience");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <StepIndicator currentStep={2} totalSteps={4} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>What are your goals?</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select all that apply to personalize your training
        </ThemedText>

        <View style={styles.cards}>
          <SelectionCard
            title="Build Endurance"
            description="Increase stamina and sustain engagement for longer periods"
            icon="activity"
            selected={selectedGoals.endurance}
            onPress={() => toggleGoal("endurance")}
          />
          <SelectionCard
            title="Improve Control"
            description="Better coordination and precise muscle activation"
            icon="target"
            selected={selectedGoals.control}
            onPress={() => toggleGoal("control")}
          />
          <SelectionCard
            title="Support Recovery"
            description="Restore strength and function after childbirth or surgery"
            icon="heart"
            selected={selectedGoals.recovery}
            onPress={() => toggleGoal("recovery")}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!hasSelection}
          icon="arrow-right"
          iconPosition="right"
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: Spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: Spacing["3xl"],
  },
  cards: {
    gap: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
});
