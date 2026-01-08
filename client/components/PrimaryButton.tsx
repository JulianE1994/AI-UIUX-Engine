import React from "react";
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: "left" | "right";
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
  iconPosition = "left",
  size = "medium",
  style,
}: PrimaryButtonProps) {
  const { theme } = useTheme();

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return theme.backgroundTertiary;
    switch (variant) {
      case "primary":
        return pressed ? theme.primaryLight : theme.primary;
      case "secondary":
        return pressed ? theme.backgroundTertiary : theme.backgroundSecondary;
      case "outline":
      case "ghost":
        return pressed ? theme.backgroundSecondary : "transparent";
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    switch (variant) {
      case "primary":
        return theme.buttonText;
      case "secondary":
      case "outline":
      case "ghost":
        return theme.primary;
      default:
        return theme.buttonText;
    }
  };

  const getBorderColor = () => {
    if (variant === "outline") {
      return disabled ? theme.border : theme.primary;
    }
    return "transparent";
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg };
      case "large":
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing["3xl"] };
      default:
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 24;
      default:
        return 20;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 2 : 0,
          opacity: loading ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" ? (
            <Feather
              name={icon}
              size={getIconSize()}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          ) : null}
          <ThemedText
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: size === "small" ? 14 : size === "large" ? 18 : 16,
              },
            ]}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === "right" ? (
            <Feather
              name={icon}
              size={getIconSize()}
              color={getTextColor()}
              style={styles.iconRight}
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Spacing.buttonHeight,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
