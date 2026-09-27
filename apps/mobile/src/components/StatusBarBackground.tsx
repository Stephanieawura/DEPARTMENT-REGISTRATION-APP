import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

/** Fills the top safe-area inset so the header colour extends behind the status bar. */
export default function StatusBarBackground({ color = Colors.deepBlue }: { color?: string }) {
  const { top } = useSafeAreaInsets();
  return <View style={{ height: top, backgroundColor: color }} />;
}
