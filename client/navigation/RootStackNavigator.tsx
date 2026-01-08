import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingStackNavigator from "@/navigation/OnboardingStackNavigator";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import SessionPlayerScreen from "@/screens/SessionPlayerScreen";
import PlanDetailScreen from "@/screens/PlanDetailScreen";
import PaywallScreen from "@/screens/PaywallScreen";
import { useAppState } from "@/hooks/useAppState";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  SessionPlayer: { sessionId: string };
  PlanDetail: { planId: string };
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { isLoading, onboardingComplete } = useAppState();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View
        style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.backgroundRoot },
      }}
    >
      {!onboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingStackNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="SessionPlayer"
            component={SessionPlayerScreen}
            options={{
              animation: "slide_from_bottom",
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="PlanDetail"
            component={PlanDetailScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
