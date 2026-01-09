import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert, Modal, Platform } from "react-native";
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
import { PrimaryButton } from "@/components/PrimaryButton";
import { requestNotificationPermission, scheduleDailyReminder, cancelAllReminders } from "@/lib/notifications";

type ModalType = 'language' | 'resetProgress' | 'deleteData' | 'privacy' | 'terms' | null;

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
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
    setActiveModal(null);
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
    if (Platform.OS === "web") {
      Alert.alert(
        t.settings.notificationPermissionTitle || "Notifications Required",
        t.settings.webNotificationsUnavailable || "Daily reminders are only available on mobile devices. Please use the Expo Go app to enable this feature.",
        [{ text: t.common.ok || "OK" }]
      );
      return;
    }

    if (value) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        Alert.alert(
          t.settings.notificationPermissionTitle || "Notifications Required",
          t.settings.notificationPermissionMessage || "Please enable notifications in your device settings to receive daily reminders.",
          [{ text: t.common.ok || "OK" }]
        );
        setReminderEnabled(false);
        await updateSettings({ ...settings, reminderEnabled: false });
        return;
      }
      
      const scheduled = await scheduleDailyReminder(
        t.settings.reminderNotificationTitle || "Time for your Kegel exercises!",
        t.settings.reminderNotificationBody || "Keep up your streak with a quick training session.",
        9,
        0
      );
      
      if (scheduled) {
        setReminderEnabled(true);
        await updateSettings({ ...settings, reminderEnabled: true });
      } else {
        setReminderEnabled(false);
        await updateSettings({ ...settings, reminderEnabled: false });
      }
    } else {
      await cancelAllReminders();
      setReminderEnabled(false);
      await updateSettings({ ...settings, reminderEnabled: false });
    }
  };

  const handleResetProgress = () => {
    setActiveModal('resetProgress');
  };

  const handleDeleteAccount = () => {
    setActiveModal('deleteData');
  };

  const confirmResetProgress = async () => {
    await resetProgress();
    setActiveModal(null);
  };

  const confirmDeleteData = async () => {
    await resetAll();
    setActiveModal(null);
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
          subtitle={Platform.OS === "web" ? t.settings.mobileOnlyFeature : t.settings.dailyRemindersDesc}
          rightElement={
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              disabled={Platform.OS === "web"}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={reminderEnabled ? theme.primary : theme.backgroundTertiary}
            />
          }
        />
        <SettingRow
          icon="globe"
          title={t.settings.language}
          subtitle={languageNames[language]}
          onPress={() => setActiveModal('language')}
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
          onPress={() => setActiveModal('privacy')}
        />
        <SettingRow
          icon="file-text"
          title={t.settings.termsOfService}
          onPress={() => setActiveModal('terms')}
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
        visible={activeModal === 'language'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
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
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={activeModal === 'resetProgress'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <ThemedText style={styles.modalTitle}>{t.settings.resetProgress}</ThemedText>
            <ThemedText style={[styles.modalText, { color: theme.textSecondary }]}>
              {t.settings.resetProgressAlert}
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => setActiveModal(null)}
              >
                <ThemedText>{t.common.cancel}</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, { backgroundColor: theme.error }]}
                onPress={confirmResetProgress}
              >
                <ThemedText style={{ color: '#fff' }}>{t.common.reset}</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={activeModal === 'deleteData'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <ThemedText style={styles.modalTitle}>{t.settings.deleteAllData}</ThemedText>
            <ThemedText style={[styles.modalText, { color: theme.textSecondary }]}>
              {t.settings.deleteDataAlert}
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => setActiveModal(null)}
              >
                <ThemedText>{t.common.cancel}</ThemedText>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, { backgroundColor: theme.error }]}
                onPress={confirmDeleteData}
              >
                <ThemedText style={{ color: '#fff' }}>{t.common.delete}</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={activeModal === 'privacy'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={[styles.modalContentLarge, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>{t.settings.privacyPolicy}</ThemedText>
              <Pressable onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <ThemedText style={[styles.modalText, { color: theme.textSecondary }]}>
                {`Last Updated: January 2025

1. Information We Collect
Kegel Coach collects minimal data to provide you with the best experience:
- Training progress and statistics
- App preferences and settings
- Device information for app functionality

2. How We Use Your Data
Your data is used exclusively to:
- Track your training progress
- Personalize your experience
- Improve app functionality

3. Data Storage
All your personal data is stored locally on your device. We do not transmit or store your training data on external servers.

4. Third-Party Services
We may use third-party services for:
- Payment processing (for premium subscriptions)
- Analytics (anonymized usage data)

5. Your Rights
You can:
- Delete all your data at any time through Settings
- Export your training data
- Contact us for any privacy concerns

6. Contact
For privacy questions, contact us at privacy@kegelcoach.app`}
              </ThemedText>
            </ScrollView>
            <PrimaryButton 
              title={t.common.done} 
              onPress={() => setActiveModal(null)}
              style={{ marginTop: Spacing.md }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={activeModal === 'terms'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setActiveModal(null)}
        >
          <Pressable style={[styles.modalContentLarge, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>{t.settings.termsOfService}</ThemedText>
              <Pressable onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <ThemedText style={[styles.modalText, { color: theme.textSecondary }]}>
                {`Last Updated: January 2025

1. Acceptance of Terms
By using Kegel Coach, you agree to these Terms of Service. If you do not agree, please do not use the app.

2. Description of Service
Kegel Coach is a wellness app designed to help users with pelvic floor exercises. The app provides:
- Guided training sessions
- Progress tracking
- Educational content

3. Health Disclaimer
Kegel Coach is for general wellness purposes only and is NOT a substitute for professional medical advice. Consult a healthcare provider before starting any exercise program, especially if you:
- Are pregnant or postpartum
- Have had recent pelvic surgery
- Experience pain during exercises
- Have any medical conditions

4. User Responsibilities
You agree to:
- Use the app responsibly
- Provide accurate information
- Not misuse the service

5. Subscription Terms
Premium features require a subscription:
- Subscriptions auto-renew unless cancelled
- Refunds are subject to platform policies
- Prices may change with notice

6. Intellectual Property
All content, designs, and features are owned by Kegel Coach and protected by copyright.

7. Limitation of Liability
Kegel Coach is provided "as is" without warranties. We are not liable for any damages arising from app use.

8. Changes to Terms
We may update these terms. Continued use constitutes acceptance of changes.

9. Contact
For questions, contact us at support@kegelcoach.app`}
              </ThemedText>
            </ScrollView>
            <PrimaryButton 
              title={t.common.done} 
              onPress={() => setActiveModal(null)}
              style={{ marginTop: Spacing.md }}
            />
          </Pressable>
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
  modalText: {
    ...Typography.body,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  modalContentLarge: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalScroll: {
    maxHeight: 400,
  },
});
