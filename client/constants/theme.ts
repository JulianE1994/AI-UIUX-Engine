import { Platform } from "react-native";

const tintColorLight = "#0D9488";
const tintColorDark = "#14B8A6";

export const Colors = {
  light: {
    text: "#134E4A",
    textSecondary: "#5E8584",
    buttonText: "#FFFFFF",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
    link: "#0D9488",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F0FDFA",
    backgroundSecondary: "#CCFBF1",
    backgroundTertiary: "#99F6E4",
    primary: "#0D9488",
    primaryLight: "#14B8A6",
    accent: "#F97316",
    accentLight: "#FB923C",
    success: "#10B981",
    successLight: "#34D399",
    warning: "#F59E0B",
    warningLight: "#FBBF24",
    error: "#EF4444",
    errorLight: "#F87171",
    border: "#D1FAE5",
    borderSecondary: "#A7F3D0",
    cardBackground: "#FFFFFF",
    cardBackgroundElevated: "#F0FDFA",
    overlay: "rgba(0, 0, 0, 0.5)",
    contract: "#0D9488",
    relax: "#6366F1",
    locked: "#F59E0B",
  },
  dark: {
    text: "#F0FDFA",
    textSecondary: "#99F6E4",
    buttonText: "#FFFFFF",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,
    link: "#14B8A6",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#475569",
    primary: "#14B8A6",
    primaryLight: "#2DD4BF",
    accent: "#FB923C",
    accentLight: "#FDBA74",
    success: "#34D399",
    successLight: "#6EE7B7",
    warning: "#FBBF24",
    warningLight: "#FCD34D",
    error: "#F87171",
    errorLight: "#FCA5A5",
    border: "#334155",
    borderSecondary: "#475569",
    cardBackground: "#1E293B",
    cardBackgroundElevated: "#334155",
    overlay: "rgba(0, 0, 0, 0.7)",
    contract: "#14B8A6",
    relax: "#818CF8",
    locked: "#FBBF24",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  smallMedium: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  timer: {
    fontSize: 72,
    fontWeight: "300" as const,
  },
  timerSmall: {
    fontSize: 48,
    fontWeight: "300" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
