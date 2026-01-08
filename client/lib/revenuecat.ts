import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

let isInitialized = false;

export async function initializeRevenueCat(): Promise<boolean> {
  if (isInitialized) {
    return true;
  }

  const apiKey = Platform.select({
    ios: IOS_API_KEY,
    android: ANDROID_API_KEY,
    default: undefined,
  });

  if (!apiKey) {
    if (__DEV__) {
      console.warn(
        "[RevenueCat] No API key found. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY or EXPO_PUBLIC_REVENUECAT_ANDROID_KEY environment variable."
      );
    }
    return false;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    await Purchases.configure({ apiKey });
    isInitialized = true;

    if (__DEV__) {
      console.log("[RevenueCat] Initialized successfully");
    }

    return true;
  } catch (error) {
    if (__DEV__) {
      console.error("[RevenueCat] Initialization failed:", error);
    }
    return false;
  }
}

export function isRevenueCatInitialized(): boolean {
  return isInitialized;
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!isInitialized) {
    console.warn("[RevenueCat] Not initialized. Call initializeRevenueCat first.");
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    if (__DEV__) {
      console.error("[RevenueCat] Failed to get offerings:", error);
    }
    return null;
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (!isInitialized) {
    return { success: false, error: "RevenueCat not initialized" };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, error: "Purchase cancelled" };
    }
    return { success: false, error: error.message || "Purchase failed" };
  }
}

export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!isInitialized) {
    return { success: false, error: "RevenueCat not initialized" };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, customerInfo };
  } catch (error: any) {
    return { success: false, error: error.message || "Restore failed" };
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isInitialized) {
    return null;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    if (__DEV__) {
      console.error("[RevenueCat] Failed to get customer info:", error);
    }
    return null;
  }
}

export function checkEntitlement(
  customerInfo: CustomerInfo,
  entitlementId: string
): boolean {
  return (
    customerInfo.entitlements.active[entitlementId] !== undefined
  );
}

export const ENTITLEMENT_IDS = {
  PREMIUM: "premium",
} as const;
