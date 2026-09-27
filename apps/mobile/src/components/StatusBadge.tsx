import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { VerificationStatus } from "../types";

const CONFIG: Record<
  VerificationStatus,
  { bg: string; text: string; border: string; icon: React.ComponentProps<typeof Feather>["name"] }
> = {
  Pending: { bg: "#fffbeb", text: "#b45309", border: "#fde68a", icon: "clock" },
  Approved: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", icon: "check-circle" },
  Rejected: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", icon: "x-circle" },
};

export default function StatusBadge({ status }: { status: VerificationStatus }) {
  const c = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Feather name={c.icon} size={11} color={c.text} />
      <Text style={[styles.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
