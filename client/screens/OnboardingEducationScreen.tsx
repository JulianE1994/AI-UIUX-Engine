import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepIndicator } from "@/components/StepIndicator";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";

export default function OnboardingEducationScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppState();

  const [expandedCard, setExpandedCard] = useState<string | null>("what");

  const educationCards = [
    {
      id: "what",
      title: t.onboarding.whatAreKegels,
      icon: "help-circle" as const,
      content: t.onboarding.kegelsExplanation,
    },
    {
      id: "benefits",
      title: t.onboarding.howToPerform,
      icon: "award" as const,
      content: `${t.onboarding.howToStep1}. ${t.onboarding.howToStep2}. ${t.onboarding.howToStep3}. ${t.onboarding.howToStep4}.`,
    },
    {
      id: "technique",
      title: t.onboarding.howToPerform,
      icon: "check-circle" as const,
      content: t.onboarding.kegelsExplanation,
    },
    {
      id: "mistakes",
      title: t.onboarding.howToPerform,
      icon: "alert-triangle" as const,
      content: t.onboarding.kegelsExplanation,
    },
  ];

  const handleComplete = async () => {
    await completeOnboarding();
  };

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <StepIndicator currentStep={4} totalSteps={4} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>{t.onboarding.educationTitle}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t.onboarding.educationSubtitle}
        </ThemedText>

        <View style={styles.cards}>
          {educationCards.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => toggleCard(card.id)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor:
                    expandedCard === card.id ? theme.primary : theme.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor:
                        expandedCard === card.id
                          ? theme.primary
                          : theme.backgroundSecondary,
                    },
                  ]}
                >
                  <Feather
                    name={card.icon}
                    size={20}
                    color={
                      expandedCard === card.id ? theme.buttonText : theme.primary
                    }
                  />
                </View>
                <ThemedText style={styles.cardTitle}>{card.title}</ThemedText>
                <Feather
                  name={expandedCard === card.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
              {expandedCard === card.id ? (
                <ThemedText
                  style={[styles.cardContent, { color: theme.textSecondary }]}
                >
                  {card.content}
                </ThemedText>
              ) : null}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <PrimaryButton
          title={t.onboarding.readyToStart}
          onPress={handleComplete}
          icon="play"
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
    marginBottom: Spacing["2xl"],
  },
  cards: {
    gap: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardTitle: {
    ...Typography.bodyMedium,
    flex: 1,
  },
  cardContent: {
    ...Typography.body,
    marginTop: Spacing.md,
    paddingLeft: Spacing["5xl"],
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
});
