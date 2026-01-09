import { useAudioPlayer } from "expo-audio";
import { useRef, useCallback, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";

const STEP_CHANGE_SOUND = require("../assets/sounds/step-change.wav");
const SUCCESS_SOUND = require("../assets/sounds/success.wav");

export function useSoundEffects() {
  const { settings } = useAppState();
  const lastPlayedRef = useRef<number>(0);
  const throttleMs = 300;

  const stepChangePlayer = useAudioPlayer(
    settings.soundEnabled ? STEP_CHANGE_SOUND : null
  );
  const successPlayer = useAudioPlayer(
    settings.soundEnabled ? SUCCESS_SOUND : null
  );

  useEffect(() => {
    if (stepChangePlayer) {
      stepChangePlayer.volume = 0.4;
    }
    if (successPlayer) {
      successPlayer.volume = 0.5;
    }
  }, [stepChangePlayer, successPlayer]);

  const playStepChange = useCallback(() => {
    if (!settings.soundEnabled || !stepChangePlayer) return;

    const now = Date.now();
    if (now - lastPlayedRef.current < throttleMs) return;
    lastPlayedRef.current = now;

    stepChangePlayer.seekTo(0);
    stepChangePlayer.play();
  }, [settings.soundEnabled, stepChangePlayer]);

  const playSuccess = useCallback(() => {
    if (!settings.soundEnabled || !successPlayer) return;

    successPlayer.seekTo(0);
    successPlayer.play();
  }, [settings.soundEnabled, successPlayer]);

  return { playStepChange, playSuccess };
}
