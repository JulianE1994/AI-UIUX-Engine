import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";

type PlanType = "monthly" | "yearly" | "lifetime";

interface PricingPlan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

export default function PaywallScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { subscribe, isSubscribed } = useAppState();

  const pricingPlans: PricingPlan[] = [
    {
      id: "monthly",
      name: t.paywall.monthly,
      price: "$9.99",
      period: t.paywall.perMonth,
    },
    {
      id: "yearly",
      name: t.paywall.yearly,
      price: "$59.99",
      period: t.paywall.perYear,
      savings: t.paywall.bestValue,
      popular: true,
    },
    {
      id: "lifetime",
      name: t.paywall.lifetime,
      price: "$149.99",
      period: t.paywall.oneTime,
    },
  ];

  const benefits = t.paywall.benefits;

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await subscribe();
    setIsLoading(false);
    navigation.goBack();
  };

  const handleRestore = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  if (isSubscribed) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.closeButton, { backgroundColor: theme.backgroundSecondary }]}
          >
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.subscribedContent}>
          <View
            style={[styles.subscribedIcon, { backgroundColor: theme.success + "20" }]}
          >
            <Feather name="check" size={48} color={theme.success} />
          </View>
          <ThemedText style={styles.subscribedTitle}>{t.settings.premiumActive}</ThemedText>
          <ThemedText style={[styles.subscribedSubtitle, { color: theme.textSecondary }]}>
            {t.settings.fullAccess}
          </ThemedText>
          <PrimaryButton
            title={t.common.continue}
            onPress={() => navigation.goBack()}
            icon="play"
            size="large"
            style={{ marginTop: Spacing["3xl"] }}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: insets.top + Spacing.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.closeButton, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View
            style={[styles.heroIcon, { backgroundColor: theme.primary + "20" }]}
          >
            <Feather name="unlock" size={32} color={theme.primary} />
          </View>
          <ThemedText style={styles.heroTitle}>
            {t.paywall.unlockFullAccess}
          </ThemedText>
          <ThemedText style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            {t.paywall.startJourney}
          </ThemedText>
        </View>

        <View style={styles.benefitsSection}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View
                style={[styles.benefitIcon, { backgroundColor: theme.success + "20" }]}
              >
                <Feather name="check" size={14} color={theme.success} />
              </View>
              <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.plansSection}>
          {pricingPlans.map((plan) => (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={[
                styles.planCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor:
                    selectedPlan === plan.id ? theme.primary : theme.border,
                  borderWidth: selectedPlan === plan.id ? 2 : 1,
                },
              ]}
            >
              {plan.popular ? (
                <View
                  style={[styles.popularBadge, { backgroundColor: theme.primary }]}
                >
                  <ThemedText style={[styles.popularText, { color: theme.buttonText }]}>
                    {t.paywall.mostPopular}
                  </ThemedText>
                </View>
              ) : null}
              <View style={styles.planContent}>
                <View style={styles.planHeader}>
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        borderColor:
                          selectedPlan === plan.id ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    {selectedPlan === plan.id ? (
                      <View
                        style={[styles.radioInner, { backgroundColor: theme.primary }]}
                      />
                    ) : null}
                  </View>
                  <View style={styles.planInfo}>
                    <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                    {plan.savings ? (
                      <View
                        style={[
                          styles.savingsBadge,
                          { backgroundColor: theme.success + "20" },
                        ]}
                      >
                        <ThemedText
                          style={[styles.savingsText, { color: theme.success }]}
                        >
                          {plan.savings}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={styles.planPricing}>
                  <ThemedText style={styles.planPrice}>{plan.price}</ThemedText>
                  <ThemedText
                    style={[styles.planPeriod, { color: theme.textSecondary }]}
                  >
                    {plan.period}
                  </ThemedText>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleRestore} style={styles.restoreButton}>
          <ThemedText style={[styles.restoreText, { color: theme.textSecondary }]}>
            {t.paywall.restorePurchases}
          </ThemedText>
        </Pressable>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.xl,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <PrimaryButton
          title={`${t.paywall.subscribe} - ${pricingPlans.find((p) => p.id === selectedPlan)?.price}`}
          onPress={handleSubscribe}
          loading={isLoading}
          size="large"
        />
        <ThemedText style={[styles.disclaimer, { color: theme.textSecondary }]}>
          {t.paywall.termsNote}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    ...Typography.h2,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    ...Typography.body,
    textAlign: "center",
  },
  benefitsSection: {
    marginBottom: Spacing["3xl"],
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  benefitText: {
    ...Typography.body,
    flex: 1,
  },
  plansSection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  planCard: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  popularBadge: {
    paddingVertical: Spacing.xs,
    alignItems: "center",
  },
  popularText: {
    ...Typography.smallMedium,
  },
  planContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  planName: {
    ...Typography.bodyMedium,
  },
  savingsBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  savingsText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  planPricing: {
    alignItems: "flex-end",
  },
  planPrice: {
    ...Typography.h4,
  },
  planPeriod: {
    ...Typography.small,
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  restoreText: {
    ...Typography.body,
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  disclaimer: {
    ...Typography.small,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  subscribedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  subscribedIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  subscribedTitle: {
    ...Typography.h2,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  subscribedSubtitle: {
    ...Typography.body,
    textAlign: "center",
  },
});
