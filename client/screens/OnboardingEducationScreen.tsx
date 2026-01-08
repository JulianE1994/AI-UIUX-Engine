import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepIndicator } from "@/components/StepIndicator";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";

const educationCards = [
  {
    id: "what",
    title: "What are Kegel exercises?",
    icon: "help-circle" as const,
    content:
      "Kegel exercises strengthen your pelvic floor muscles - the muscles that support your bladder, bowel, and for women, the uterus. Named after Dr. Arnold Kegel, these exercises involve contracting and relaxing these muscles to build strength and endurance.",
  },
  {
    id: "benefits",
    title: "Benefits of training",
    icon: "award" as const,
    content:
      "Regular pelvic floor training can improve bladder control, enhance core stability, support postpartum recovery, and contribute to overall pelvic health. Consistent practice leads to better muscle awareness and control.",
  },
  {
    id: "technique",
    title: "Proper technique",
    icon: "check-circle" as const,
    content:
      "To engage your pelvic floor correctly, imagine you're trying to stop the flow of urine or prevent passing gas. You should feel a gentle squeeze and lift. Keep your abdomen, thighs, and buttocks relaxed. Breathe normally throughout.",
  },
  {
    id: "mistakes",
    title: "Common mistakes",
    icon: "alert-triangle" as const,
    content:
      "Avoid these common errors: holding your breath (breathe naturally), squeezing too hard (use gentle effort), pushing down instead of lifting up, tensing your abdomen or thighs, and skipping rest periods between contractions.",
  },
];

export default function OnboardingEducationScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppState();

  const [expandedCard, setExpandedCard] = useState<string | null>("what");

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
        <ThemedText style={styles.title}>Quick education</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Learn the basics before you begin your journey
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
          title="Start Training"
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
