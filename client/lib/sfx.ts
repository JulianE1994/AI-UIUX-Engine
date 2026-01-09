import { useAudioPlayer } from "expo-audio";
import { useRef, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useAppState } from "@/hooks/useAppState";

const STEP_CHANGE_SOUND = require("../assets/sounds/step-change.wav");
const SUCCESS_SOUND = require("../assets/sounds/success.wav");

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== "web") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playWebSound(type: "step" | "success") {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  if (type === "step") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } else {
    const frequencies = [392, 493.88, 587.33];
    const duration = 0.75;
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      
      const startTime = now + i * 0.07;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
      gain.gain.setValueAtTime(0.12, startTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }
}

export function useSoundEffects() {
  const { settings } = useAppState();
  const lastPlayedRef = useRef<number>(0);
  const throttleMs = 350;
  const isPlayingRef = useRef<boolean>(false);

  const stepChangePlayer = useAudioPlayer(
    settings.soundEnabled ? STEP_CHANGE_SOUND : null
  );
  const successPlayer = useAudioPlayer(
    settings.soundEnabled ? SUCCESS_SOUND : null
  );

  useEffect(() => {
    if (stepChangePlayer) {
      stepChangePlayer.volume = 0.18;
    }
    if (successPlayer) {
      successPlayer.volume = 0.35;
    }
  }, [stepChangePlayer, successPlayer]);

  const playStepChange = useCallback(() => {
    if (!settings.soundEnabled) return;

    const now = Date.now();
    if (now - lastPlayedRef.current < throttleMs) return;
    if (isPlayingRef.current) return;
    
    lastPlayedRef.current = now;
    isPlayingRef.current = true;

    if (Platform.OS === "web") {
      playWebSound("step");
      setTimeout(() => { isPlayingRef.current = false; }, 150);
    } else if (stepChangePlayer) {
      stepChangePlayer.seekTo(0);
      stepChangePlayer.play();
      setTimeout(() => { isPlayingRef.current = false; }, 150);
    } else {
      isPlayingRef.current = false;
    }
  }, [settings.soundEnabled, stepChangePlayer]);

  const playSuccess = useCallback(() => {
    if (!settings.soundEnabled) return;
    if (isPlayingRef.current) return;
    
    isPlayingRef.current = true;

    if (Platform.OS === "web") {
      playWebSound("success");
      setTimeout(() => { isPlayingRef.current = false; }, 900);
    } else if (successPlayer) {
      successPlayer.seekTo(0);
      successPlayer.play();
      setTimeout(() => { isPlayingRef.current = false; }, 900);
    } else {
      isPlayingRef.current = false;
    }
  }, [settings.soundEnabled, successPlayer]);

  return { playStepChange, playSuccess };
}
