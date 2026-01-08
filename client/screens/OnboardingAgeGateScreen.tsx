import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StepIndicator } from "@/components/StepIndicator";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { OnboardingStackParamList } from "@/navigation/OnboardingStackNavigator";

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, "AgeGate">;

export default function OnboardingAgeGateScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const handleConfirm = () => {
    navigation.navigate("Goals");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <StepIndicator currentStep={1} totalSteps={4} />
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <ThemedText style={styles.title}>Welcome to Kegel Coach</ThemedText>

        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Your personal guide to pelvic floor wellness
        </ThemedText>

        <View
          style={[
            styles.disclaimerCard,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText style={[styles.disclaimerTitle, { color: theme.primary }]}>
            Age Verification Required
          </ThemedText>
          <ThemedText style={[styles.disclaimerText, { color: theme.textSecondary }]}>
            This app is designed for adults (18+) and focuses on pelvic floor
            fitness and wellness education.
          </ThemedText>
        </View>

        <View
          style={[
            styles.warningCard,
            { backgroundColor: theme.warningLight + "20" },
          ]}
        >
          <ThemedText style={[styles.warningText, { color: theme.text }]}>
            Not medical advice. Consult a doctor or physiotherapist if you
            experience pain or issues.
          </ThemedText>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <PrimaryButton
          title="I am 18 or older"
          onPress={handleConfirm}
          icon="check"
          size="large"
        />
        <ThemedText style={[styles.footerText, { color: theme.textSecondary }]}>
          By continuing, you confirm you are at least 18 years old
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
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
    overflow: "hidden",
  },
  icon: {
    width: 80,
    height: 80,
  },
  title: {
    ...Typography.h2,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  disclaimerCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    width: "100%",
    marginBottom: Spacing.lg,
  },
  disclaimerTitle: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  disclaimerText: {
    ...Typography.body,
    textAlign: "center",
  },
  warningCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    width: "100%",
  },
  warningText: {
    ...Typography.small,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  footerText: {
    ...Typography.small,
    textAlign: "center",
  },
});
