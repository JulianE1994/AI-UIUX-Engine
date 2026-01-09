import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Pressable, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ProgressRing } from "@/components/ProgressRing";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTheme } from "@/hooks/useTheme";
import { useAppState } from "@/hooks/useAppState";
import { useLanguage } from "@/hooks/useLanguage";
import { Spacing, Typography, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getSessionById, getDemoSession, getExerciseById, SessionStep, getTranslatedStepType, getTranslatedExerciseName, getTranslatedInstruction } from "@/lib/trainingData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "SessionPlayer">;
type RouteProps = RouteProp<RootStackParamList, "SessionPlayer">;

type Phase = "work" | "rest" | "countdown" | "completed";

export default function SessionPlayerScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { recordSessionComplete, settings } = useAppState();

  const session =
    route.params.sessionId === "demo-session"
      ? getDemoSession()
      : getSessionById(route.params.sessionId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [phase, setPhase] = useState<Phase>("countdown");
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentStep = session?.steps[currentStepIndex];
  const exercise = currentStep ? getExerciseById(currentStep.exerciseId) : null;

  const totalSteps = session?.steps.length || 0;

  const triggerHaptic = useCallback(() => {
    if (settings.vibrationEnabled && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [settings.vibrationEnabled]);

  const moveToNextPhase = useCallback(() => {
    if (!currentStep || !session) return;

    triggerHaptic();

    if (phase === "countdown") {
      setPhase("work");
      setTimeRemaining(currentStep.workSeconds);
      return;
    }

    if (phase === "work") {
      if (currentStep.reps && currentRep < currentStep.reps) {
        setCurrentRep((prev) => prev + 1);
        setPhase("rest");
        setTimeRemaining(currentStep.restSeconds);
        return;
      }

      if (currentStep.restSeconds > 0 && currentSet <= currentStep.sets) {
        setPhase("rest");
        setTimeRemaining(currentStep.restSeconds);
        return;
      }

      if (currentSet < currentStep.sets) {
        setCurrentSet((prev) => prev + 1);
        setCurrentRep(1);
        setPhase("work");
        setTimeRemaining(currentStep.workSeconds);
        return;
      }

      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setCurrentSet(1);
        setCurrentRep(1);
        setPhase("countdown");
        setTimeRemaining(3);
        return;
      }

      setPhase("completed");
      return;
    }

    if (phase === "rest") {
      if (currentStep.reps && currentRep < currentStep.reps) {
        setPhase("work");
        setTimeRemaining(currentStep.workSeconds);
        return;
      }

      if (currentSet < currentStep.sets) {
        setCurrentSet((prev) => prev + 1);
        setCurrentRep(1);
        setPhase("work");
        setTimeRemaining(currentStep.workSeconds);
        return;
      }

      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setCurrentSet(1);
        setCurrentRep(1);
        setPhase("countdown");
        setTimeRemaining(3);
        return;
      }

      setPhase("completed");
    }
  }, [phase, currentStep, currentSet, currentRep, currentStepIndex, totalSteps, session, triggerHaptic]);

  useEffect(() => {
    if (isPaused || phase === "completed") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          moveToNextPhase();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, phase, moveToNextPhase]);

  const handlePause = () => {
    setIsPaused(!isPaused);
    triggerHaptic();
  };

  const handleSkip = () => {
    if (!session) return;

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentSet(1);
      setCurrentRep(1);
      setPhase("countdown");
      setTimeRemaining(3);
    } else {
      setPhase("completed");
    }
    triggerHaptic();
  };

  const wasPausedRef = useRef(false);

  const cleanupAndExit = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    navigation.goBack();
  }, [navigation]);

  const handleExit = () => {
    wasPausedRef.current = isPaused;
    setIsPaused(true);
    
    Alert.alert(
      t.session.exitSession,
      t.session.exitSessionDesc,
      [
        { 
          text: t.common.cancel, 
          style: "cancel",
          onPress: () => {
            setIsPaused(wasPausedRef.current);
          }
        },
        {
          text: t.session.exit,
          style: "destructive",
          onPress: cleanupAndExit,
        },
      ]
    );
  };

  const handleComplete = async () => {
    if (session) {
      const durationMinutes = Math.floor(totalTimeElapsed / 60);
      await recordSessionComplete(session.id, durationMinutes);
    }
    triggerHaptic();
    navigation.goBack();
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "work":
        return theme.contract;
      case "rest":
        return theme.relax;
      case "countdown":
        return theme.primary;
      default:
        return theme.success;
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "work":
        return t.session.contract;
      case "rest":
        return t.session.relax;
      case "countdown":
        return t.session.getReady;
      case "completed":
        return t.session.wellDone;
      default:
        return "";
    }
  };

  const getProgress = () => {
    if (!currentStep) return 0;
    const maxTime =
      phase === "work"
        ? currentStep.workSeconds
        : phase === "rest"
          ? currentStep.restSeconds
          : 3;
    return 1 - timeRemaining / maxTime;
  };

  if (!session) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>{t.instructions.sessionNotFound}</ThemedText>
      </View>
    );
  }

  if (phase === "completed") {
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
        <View style={styles.completedContent}>
          <View
            style={[
              styles.completedIcon,
              { backgroundColor: theme.success + "20" },
            ]}
          >
            <Feather name="check" size={48} color={theme.success} />
          </View>
          <ThemedText style={styles.completedTitle}>{t.session.sessionComplete}</ThemedText>
          <ThemedText style={[styles.completedSubtitle, { color: theme.textSecondary }]}>
            {t.session.greatJob}
          </ThemedText>

          <View style={styles.completedStats}>
            <View style={styles.completedStat}>
              <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                {Math.floor(totalTimeElapsed / 60)}:{String(totalTimeElapsed % 60).padStart(2, "0")}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                {t.session.duration}
              </ThemedText>
            </View>
            <View style={styles.completedStat}>
              <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                {totalSteps}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                {t.session.exercisesCompleted}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.completedFooter}>
          <PrimaryButton
            title={t.common.done}
            onPress={handleComplete}
            icon="check"
            size="large"
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
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={handleExit}
          style={[styles.exitButton, { backgroundColor: theme.backgroundSecondary }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          testID="button-exit-session"
        >
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <ThemedText style={[styles.stepLabel, { color: theme.textSecondary }]}>
            {t.session.step} {currentStepIndex + 1} {t.session.of} {totalSteps}
          </ThemedText>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.exerciseInfo}>
        <View
          style={[
            styles.stepTypeBadge,
            { backgroundColor: getPhaseColor() + "20" },
          ]}
        >
          <ThemedText style={[styles.stepTypeText, { color: getPhaseColor() }]}>
            {currentStep ? getTranslatedStepType(currentStep.stepType, t.stepTypes).toUpperCase() : ""}
          </ThemedText>
        </View>
        <ThemedText style={styles.exerciseName}>
          {currentStep ? getTranslatedExerciseName(currentStep.exerciseId, t.exercises) : ""}
        </ThemedText>
        <ThemedText style={[styles.exerciseInstruction, { color: theme.textSecondary }]}>
          {currentStep ? getTranslatedInstruction(currentStep.instruction, t.instructions) : ""}
        </ThemedText>
      </View>

      <View style={styles.timerContainer}>
        <ProgressRing
          progress={getProgress()}
          size={280}
          strokeWidth={16}
          color={getPhaseColor()}
        >
          <View style={styles.timerContent}>
            <ThemedText style={[styles.phaseLabel, { color: getPhaseColor() }]}>
              {getPhaseLabel()}
            </ThemedText>
            <ThemedText style={[styles.timerText, { color: theme.text }]}>
              {timeRemaining}
            </ThemedText>
            <ThemedText style={[styles.setLabel, { color: theme.textSecondary }]}>
              {currentStep?.reps
                ? `${t.player.rep} ${currentRep}/${currentStep.reps}`
                : `${t.player.set} ${currentSet}/${currentStep?.sets || 1}`}
            </ThemedText>
          </View>
        </ProgressRing>
      </View>

      {currentStepIndex < totalSteps - 1 ? (
        <View style={[styles.nextPreview, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={[styles.nextLabel, { color: theme.textSecondary }]}>
            {t.player.upNext}
          </ThemedText>
          <ThemedText style={styles.nextExercise}>
            {getTranslatedExerciseName(session.steps[currentStepIndex + 1].exerciseId, t.exercises)}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.controls}>
        <Pressable
          onPress={handleSkip}
          style={[styles.controlButton, { backgroundColor: theme.backgroundSecondary }]}
        >
          <Feather name="skip-forward" size={28} color={theme.text} />
        </Pressable>

        <Pressable
          onPress={handlePause}
          style={[
            styles.mainControlButton,
            { backgroundColor: isPaused ? theme.success : theme.primary },
          ]}
        >
          <Feather
            name={isPaused ? "play" : "pause"}
            size={36}
            color={theme.buttonText}
          />
        </Pressable>

        <View style={styles.controlButtonPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    zIndex: 10,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  stepLabel: {
    ...Typography.body,
  },
  headerSpacer: {
    width: 44,
  },
  exerciseInfo: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  stepTypeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  stepTypeText: {
    ...Typography.smallMedium,
  },
  exerciseName: {
    ...Typography.h3,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  exerciseInstruction: {
    ...Typography.body,
    textAlign: "center",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerContent: {
    alignItems: "center",
  },
  phaseLabel: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
  },
  timerText: {
    ...Typography.timer,
  },
  setLabel: {
    ...Typography.body,
    marginTop: Spacing.sm,
  },
  nextPreview: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  nextLabel: {
    ...Typography.small,
    marginBottom: Spacing.xs,
  },
  nextExercise: {
    ...Typography.bodyMedium,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing["3xl"],
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  mainControlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonPlaceholder: {
    width: 56,
    height: 56,
  },
  completedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  completedIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  completedTitle: {
    ...Typography.h2,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  completedSubtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  completedStats: {
    flexDirection: "row",
    gap: Spacing["5xl"],
  },
  completedStat: {
    alignItems: "center",
  },
  statValue: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.body,
  },
  completedFooter: {
    paddingHorizontal: Spacing.xl,
  },
});
