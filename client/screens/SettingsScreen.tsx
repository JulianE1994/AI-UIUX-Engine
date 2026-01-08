import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { languageNames, Language } from "@/lib/translations";
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
  const { language, setLanguage, t } = useLanguage();

  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState(
    settings.vibrationEnabled
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    settings.reminderEnabled
  );
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
    setShowLanguagePicker(false);
  };

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
      t.settings.resetProgress,
      t.settings.resetProgressAlert,
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.common.reset,
          style: "destructive",
          onPress: () => resetProgress(),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t.settings.deleteAllData,
      t.settings.deleteDataAlert,
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.common.delete,
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
      <ThemedText style={styles.title}>{t.settings.title}</ThemedText>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t.settings.subscription}
        </ThemedText>
        <SettingRow
          icon="credit-card"
          title={isSubscribed ? t.settings.premiumActive : t.settings.freePlan}
          subtitle={
            isSubscribed
              ? t.settings.fullAccess
              : t.settings.upgradeToUnlock
          }
          onPress={handleManageSubscription}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t.settings.sessionPreferences}
        </ThemedText>
        <SettingRow
          icon="volume-2"
          title={t.settings.soundEffects}
          subtitle={t.settings.soundEffectsDesc}
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
          title={t.settings.vibration}
          subtitle={t.settings.vibrationDesc}
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
          title={t.settings.dailyReminders}
          subtitle={t.settings.dailyRemindersDesc}
          rightElement={
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={reminderEnabled ? theme.primary : theme.backgroundTertiary}
            />
          }
        />
        <SettingRow
          icon="globe"
          title={t.settings.language}
          subtitle={languageNames[language]}
          onPress={() => setShowLanguagePicker(true)}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t.settings.about}
        </ThemedText>
        <SettingRow
          icon="info"
          title={t.settings.aboutKegelCoach}
          subtitle={`${t.settings.version} 1.0.0`}
        />
        <SettingRow
          icon="shield"
          title={t.settings.privacyPolicy}
          onPress={() => Alert.alert(t.settings.privacyPolicy, "Privacy policy would open here.")}
        />
        <SettingRow
          icon="file-text"
          title={t.settings.termsOfService}
          onPress={() => Alert.alert(t.settings.termsOfService, "Terms of service would open here.")}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t.settings.dataManagement}
        </ThemedText>
        <SettingRow
          icon="refresh-cw"
          title={t.settings.resetProgress}
          subtitle={t.settings.resetProgressDesc}
          onPress={handleResetProgress}
          destructive
        />
        <SettingRow
          icon="trash-2"
          title={t.settings.deleteAllData}
          subtitle={t.settings.deleteAllDataDesc}
          onPress={handleDeleteAccount}
          destructive
        />
      </View>

      <View style={styles.disclaimerContainer}>
        <ThemedText style={[styles.disclaimer, { color: theme.textSecondary }]}>
          {t.settings.disclaimer}
        </ThemedText>
      </View>

      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowLanguagePicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <ThemedText style={styles.modalTitle}>{t.settings.language}</ThemedText>
            {(['en', 'de', 'fr', 'it'] as Language[]).map((lang) => (
              <Pressable
                key={lang}
                style={[
                  styles.languageOption,
                  language === lang && { backgroundColor: theme.primary + '20' }
                ]}
                onPress={() => handleLanguageSelect(lang)}
              >
                <ThemedText style={styles.languageText}>{languageNames[lang]}</ThemedText>
                {language === lang ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  languageText: {
    ...Typography.bodyMedium,
  },
});
