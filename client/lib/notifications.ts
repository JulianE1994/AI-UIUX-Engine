import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DAILY_REMINDER_ID = "daily-kegel-reminder";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus === "granted") {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(
  title: string,
  body: string,
  hour: number = 9,
  minute: number = 0
): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    await cancelAllReminders();

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
      identifier: DAILY_REMINDER_ID,
    });

    return true;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return false;
  }
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling notifications:", error);
  }
}

export async function getNotificationPermissionStatus(): Promise<string> {
  if (Platform.OS === "web") {
    return "unavailable";
  }

  const { status } = await Notifications.getPermissionsAsync();
  return status;
}
