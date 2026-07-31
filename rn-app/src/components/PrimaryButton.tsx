import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../constants/Colors";

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "gold" | "blue" | "destructive" | "ghost";
}

export default function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "gold",
}: Props) {
  const bg =
    variant === "gold"
      ? Colors.accentGold
      : variant === "blue"
      ? Colors.deepBlue
      : variant === "destructive"
      ? "transparent"
      : "#F8F9FA";

  const textColor =
    variant === "destructive" ? Colors.red : variant === "ghost" ? Colors.darkText : Colors.white;

  const border =
    variant === "destructive" ? { borderWidth: 2, borderColor: Colors.red } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.button, { backgroundColor: bg }, border, (disabled || loading) && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
