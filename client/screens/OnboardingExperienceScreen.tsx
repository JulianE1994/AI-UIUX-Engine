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
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography } from "@/constants/theme";
import { OnboardingStackParamList } from "@/navigation/OnboardingStackNavigator";

type NavigationProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  "Experience"
>;

export default function OnboardingExperienceScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
        <ThemedText style={styles.title}>{t.onboarding.experienceTitle}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t.onboarding.experienceSubtitle}
        </ThemedText>

        <View style={styles.cards}>
          <SelectionCard
            title={t.onboarding.beginner}
            description={t.onboarding.beginnerDesc}
            icon="star"
            selected={selectedLevel === "beginner"}
            onPress={() => setSelectedLevel("beginner")}
          />
          <SelectionCard
            title={t.onboarding.intermediate}
            description={t.onboarding.intermediateDesc}
            icon="award"
            selected={selectedLevel === "intermediate"}
            onPress={() => setSelectedLevel("intermediate")}
          />
          <SelectionCard
            title={t.onboarding.advanced}
            description={t.onboarding.advancedDesc}
            icon="zap"
            selected={selectedLevel === "advanced"}
            onPress={() => setSelectedLevel("advanced")}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <PrimaryButton
          title={t.common.continue}
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
