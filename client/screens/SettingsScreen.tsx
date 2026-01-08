import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  destructive,
}: SettingRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.settingRow,
        { opacity: pressed && onPress ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: destructive
              ? theme.error + "20"
              : theme.backgroundSecondary,
          },
        ]}
      >
        <Feather
          name={icon}
          size={18}
          color={destructive ? theme.error : theme.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <ThemedText
          style={[styles.settingTitle, destructive && { color: theme.error }]}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {rightElement ? (
        rightElement
      ) : onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { isSubscribed, settings, updateSettings, resetProgress, resetAll } =
    useAppState();

  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState(
    settings.vibrationEnabled
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    settings.reminderEnabled
  );

  const handleSoundToggle = async (value: boolean) => {
    setSoundEnabled(value);
    await updateSettings({ ...settings, soundEnabled: value });
  };

  const handleVibrationToggle = async (value: boolean) => {
    setVibrationEnabled(value);
    await updateSettings({ ...settings, vibrationEnabled: value });
  };

  const handleReminderToggle = async (value: boolean) => {
    setReminderEnabled(value);
    await updateSettings({ ...settings, reminderEnabled: value });
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "This will clear all your training history, streaks, and statistics. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetProgress(),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete All Data",
      "This will delete all your data including settings, progress, and preferences. You will need to complete onboarding again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => resetAll(),
        },
      ]
    );
  };

  const handleManageSubscription = () => {
    navigation.navigate("Paywall");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText style={styles.title}>Settings</ThemedText>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Subscription
        </ThemedText>
        <SettingRow
          icon="credit-card"
          title={isSubscribed ? "Premium Active" : "Free Plan"}
          subtitle={
            isSubscribed
              ? "You have full access to all features"
              : "Upgrade to unlock all training programs"
          }
          onPress={handleManageSubscription}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Session Preferences
        </ThemedText>
        <SettingRow
          icon="volume-2"
          title="Sound Effects"
          subtitle="Play sounds during exercises"
          rightElement={
            <Switch
              value={soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={soundEnabled ? theme.primary : theme.backgroundTertiary}
            />
          }
        />
        <SettingRow
          icon="smartphone"
          title="Vibration"
          subtitle="Haptic feedback on phase changes"
          rightElement={
            <Switch
              value={vibrationEnabled}
              onValueChange={handleVibrationToggle}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={vibrationEnabled ? theme.primary : theme.backgroundTertiary}
            />
          }
        />
        <SettingRow
          icon="bell"
          title="Daily Reminders"
          subtitle="Get reminded to train"
          rightElement={
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={reminderEnabled ? theme.primary : theme.backgroundTertiary}
            />
          }
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          About
        </ThemedText>
        <SettingRow
          icon="info"
          title="About Kegel Coach"
          subtitle="Version 1.0.0"
        />
        <SettingRow
          icon="shield"
          title="Privacy Policy"
          onPress={() => Alert.alert("Privacy Policy", "Privacy policy would open here.")}
        />
        <SettingRow
          icon="file-text"
          title="Terms of Service"
          onPress={() => Alert.alert("Terms of Service", "Terms of service would open here.")}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Data Management
        </ThemedText>
        <SettingRow
          icon="refresh-cw"
          title="Reset Progress"
          subtitle="Clear all training history"
          onPress={handleResetProgress}
          destructive
        />
        <SettingRow
          icon="trash-2"
          title="Delete All Data"
          subtitle="Remove all data and start fresh"
          onPress={handleDeleteAccount}
          destructive
        />
      </View>

      <View style={styles.disclaimerContainer}>
        <ThemedText style={[styles.disclaimer, { color: theme.textSecondary }]}>
          This app is for wellness education purposes only. Not medical advice.
          Consult a doctor or physiotherapist if you experience pain or issues.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing["2xl"],
  },
  section: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    overflow: "hidden",
  },
  sectionTitle: {
    ...Typography.smallMedium,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.bodyMedium,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Typography.small,
  },
  disclaimerContainer: {
    padding: Spacing.lg,
  },
  disclaimer: {
    ...Typography.small,
    textAlign: "center",
    fontStyle: "italic",
  },
});
