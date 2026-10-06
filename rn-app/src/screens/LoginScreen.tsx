import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      const { access_token, user } = response.data;

      // Store token and user role
      await AsyncStorage.setItem('userToken', access_token);
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('userId', user.sub.toString());

      if (user.role === 'ADMIN') {
        navigation.replace("AdminApp");
      } else {
        navigation.replace("StudentApp");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Login Failed", 
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.crestRing}>
            <Feather name="award" size={36} color={Colors.accentGold} />
          </View>
          <Text style={styles.headerSub}>University of Ghana</Text>
          <Text style={styles.headerTitle}>CS Dept. Registration</Text>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="student@st.ug.edu.gh"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.gray400}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={Colors.gray400} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.helpText}>
              Need help?{" "}
              <Text style={styles.helpLink}>Contact Admin</Text>
            </Text>

            <View style={styles.demoBanner}>
              <Text style={styles.demoText}>
                <Text style={{ fontWeight: "700" }}>Demo Credentials:{"\n"}</Text>
                Student: student@dept.edu / password123{"\n"}
                Admin: admin@dept.edu / password123
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>Department of Computer Science · UG</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    backgroundColor: Colors.deepBlue,
    paddingTop: 16,
    paddingBottom: 48,
    alignItems: "center",
    gap: 6,
  },
  crestRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: Colors.accentGold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerSub: {
    color: Colors.accentGold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
  },
  body: { flex: 1, marginTop: -24, paddingHorizontal: 20 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    gap: 16,
  },
  field: { gap: 6 },
  label: {
    color: Colors.deepBlue,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: Colors.darkText,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  primaryBtn: {
    backgroundColor: Colors.accentGold,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  helpText: { textAlign: "center", fontSize: 12, color: Colors.gray400 },
  helpLink: { color: Colors.deepBlue, fontWeight: "700" },
  demoBanner: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  demoText: { color: "#92400e", fontSize: 12, textAlign: "center", lineHeight: 18 },
  footer: { textAlign: "center", color: Colors.gray400, fontSize: 11, marginTop: 20 },
});
