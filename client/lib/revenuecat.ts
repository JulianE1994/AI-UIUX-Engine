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

const REVENUECAT_DEBUG = true;

function rcLog(message: string, data?: any) {
  if (REVENUECAT_DEBUG) {
    if (data !== undefined) {
      console.log(`[RevenueCat] ${message}`, data);
    } else {
      console.log(`[RevenueCat] ${message}`);
    }
  }
}

function rcWarn(message: string, data?: any) {
  if (REVENUECAT_DEBUG) {
    if (data !== undefined) {
      console.warn(`[RevenueCat] ${message}`, data);
    } else {
      console.warn(`[RevenueCat] ${message}`);
    }
  }
}

export async function initializeRevenueCat(): Promise<boolean> {
  if (isInitialized) {
    rcLog("Already initialized, skipping");
    return true;
  }

  const platform = Platform.OS;
  const iosKeyExists = !!IOS_API_KEY;
  const androidKeyExists = !!ANDROID_API_KEY;
  
  rcLog(`Initializing - Platform: ${platform}, iOS key exists: ${iosKeyExists}, Android key exists: ${androidKeyExists}`);

  const apiKey = Platform.select({
    ios: IOS_API_KEY,
    android: ANDROID_API_KEY,
    default: undefined,
  });

  if (!apiKey) {
    rcWarn("No API key found for current platform. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY or EXPO_PUBLIC_REVENUECAT_ANDROID_KEY environment variable.");
    return false;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    await Purchases.configure({ apiKey });
    isInitialized = true;

    rcLog("Initialized successfully");

    return true;
  } catch (error) {
    rcWarn("Initialization failed:", error);
    return false;
  }
}

export function isRevenueCatInitialized(): boolean {
  return isInitialized;
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!isInitialized) {
    rcWarn("Not initialized. Call initializeRevenueCat first.");
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    rcLog(`Offerings fetched - Current: ${offerings.current?.identifier || "none"}, Packages: ${offerings.current?.availablePackages.length || 0}`);
    return offerings;
  } catch (error) {
    rcWarn("Failed to get offerings:", error);
    return null;
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (!isInitialized) {
    return { success: false, error: "RevenueCat not initialized" };
  }

  rcLog(`Attempting purchase - Package: ${pkg.identifier}`);

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    const hasPremium = Boolean(customerInfo.entitlements.active[ENTITLEMENT_IDS.PREMIUM]);
    rcLog(`Purchase successful - Active entitlements: [${activeEntitlements.join(", ")}], "${ENTITLEMENT_IDS.PREMIUM}" active: ${hasPremium}`);
    
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
      rcLog("Purchase cancelled by user");
      return { success: false, error: "Purchase cancelled" };
    }
    rcWarn("Purchase failed:", error.message || error);
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

  rcLog("Attempting to restore purchases");

  try {
    const customerInfo = await Purchases.restorePurchases();
    
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    const hasPremium = Boolean(customerInfo.entitlements.active[ENTITLEMENT_IDS.PREMIUM]);
    rcLog(`Restore successful - Active entitlements: [${activeEntitlements.join(", ")}], "${ENTITLEMENT_IDS.PREMIUM}" active: ${hasPremium}`);
    
    return { success: true, customerInfo };
  } catch (error: any) {
    rcWarn("Restore failed:", error.message || error);
    return { success: false, error: error.message || "Restore failed" };
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isInitialized) {
    rcWarn("Cannot get customer info - not initialized");
    return null;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    const hasPremium = Boolean(customerInfo.entitlements.active[ENTITLEMENT_IDS.PREMIUM]);
    rcLog(`Customer info fetched - Active entitlements: [${activeEntitlements.join(", ")}], "${ENTITLEMENT_IDS.PREMIUM}" active: ${hasPremium}`);
    
    return customerInfo;
  } catch (error) {
    rcWarn("Failed to get customer info:", error);
    return null;
  }
}

export function checkEntitlement(
  customerInfo: CustomerInfo,
  entitlementId: string
): boolean {
  const hasEntitlement = Boolean(customerInfo.entitlements.active[entitlementId]);
  
  if (!hasEntitlement && REVENUECAT_DEBUG) {
    rcLog(`Entitlement check - "${entitlementId}" is NOT active. Active: [${Object.keys(customerInfo.entitlements.active).join(", ")}]`);
  }
  
  return hasEntitlement;
}

export async function debugPrintSubscriptionStatus(): Promise<void> {
  rcLog("=== DEBUG: Subscription Status ===");
  rcLog(`Initialized: ${isInitialized}`);
  rcLog(`Platform: ${Platform.OS}`);
  rcLog(`iOS key exists: ${!!IOS_API_KEY}`);
  rcLog(`Android key exists: ${!!ANDROID_API_KEY}`);
  
  if (!isInitialized) {
    rcLog("Cannot fetch customer info - SDK not initialized");
    rcLog("=== END DEBUG ===");
    return;
  }
  
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    const allEntitlements = Object.keys(customerInfo.entitlements.all);
    const hasPremium = Boolean(customerInfo.entitlements.active[ENTITLEMENT_IDS.PREMIUM]);
    
    rcLog(`Active entitlements: [${activeEntitlements.join(", ")}]`);
    rcLog(`All entitlements: [${allEntitlements.join(", ")}]`);
    rcLog(`"${ENTITLEMENT_IDS.PREMIUM}" active: ${hasPremium}`);
    rcLog(`Original App User ID: ${customerInfo.originalAppUserId}`);
  } catch (error) {
    rcWarn("Failed to fetch customer info for debug:", error);
  }
  
  rcLog("=== END DEBUG ===");
}

export const ENTITLEMENT_IDS = {
  PREMIUM: "Kegel Coach Pro",
} as const;

export const REVENUECAT_DEBUG_ENABLED = REVENUECAT_DEBUG;
