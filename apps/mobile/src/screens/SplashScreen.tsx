import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/Colors";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.crestRing}>
          <Feather name="award" size={44} color={Colors.accentGold} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.subtitle}>University of Ghana</Text>
          <Text style={styles.title}>CS Department</Text>
          <Text style={styles.title}>Registration App</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("Login")}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>College of Basic &amp; Applied Science</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBlue,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 24,
  },
  crestRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: Colors.accentGold,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    alignItems: "center",
    gap: 4,
  },
  subtitle: {
    color: Colors.accentGold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
  },
  actions: {
    width: "100%",
    marginTop: 8,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: Colors.accentGold,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    marginTop: 8,
  },
});
