import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingAgeGateScreen from "@/screens/OnboardingAgeGateScreen";
import OnboardingGoalsScreen from "@/screens/OnboardingGoalsScreen";
import OnboardingExperienceScreen from "@/screens/OnboardingExperienceScreen";
import OnboardingEducationScreen from "@/screens/OnboardingEducationScreen";
import { useTheme } from "@/hooks/useTheme";

export type OnboardingStackParamList = {
  AgeGate: undefined;
  Goals: undefined;
  Experience: undefined;
  Education: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStackNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.backgroundRoot },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="AgeGate" component={OnboardingAgeGateScreen} />
      <Stack.Screen name="Goals" component={OnboardingGoalsScreen} />
      <Stack.Screen name="Experience" component={OnboardingExperienceScreen} />
      <Stack.Screen name="Education" component={OnboardingEducationScreen} />
    </Stack.Navigator>
  );
}
