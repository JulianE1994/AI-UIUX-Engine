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

type NavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  "Experience"
>;

export default function OnboardingExperienceScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { setUserExperience } = useAppState();

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleContinue = async () => {
    if (selectedLevel) {
      await setUserExperience(selectedLevel);
      navigation.navigate("Education");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <StepIndicator currentStep={3} totalSteps={4} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>Your experience level</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          This helps us recommend the right training program for you
        </ThemedText>

        <View style={styles.cards}>
          <SelectionCard
            title="Beginner"
            description="New to pelvic floor training or looking to start fresh"
            icon="star"
            selected={selectedLevel === "beginner"}
            onPress={() => setSelectedLevel("beginner")}
          />
          <SelectionCard
            title="Intermediate"
            description="Some experience with Kegel exercises, ready to progress"
            icon="award"
            selected={selectedLevel === "intermediate"}
            onPress={() => setSelectedLevel("intermediate")}
          />
          <SelectionCard
            title="Advanced"
            description="Experienced practitioner seeking challenge and refinement"
            icon="zap"
            selected={selectedLevel === "advanced"}
            onPress={() => setSelectedLevel("advanced")}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedLevel}
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
