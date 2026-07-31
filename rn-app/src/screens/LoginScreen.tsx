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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { Colors } from "../constants/Colors";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  function handleSendOTP() {
    if (!email || !idNumber) {
      Alert.alert("Missing Fields", "Please enter both email and ID number.");
      return;
    }
    setSentEmail(email);
    setOtpSent(true);
  }

  function handleVerifyOTP() {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP.");
      return;
    }
    if (otp === "123456") {
      navigation.replace(isAdmin ? "AdminApp" : "StudentApp");
    } else {
      Alert.alert("Invalid OTP", "Try '123456' for demo purposes.");
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
            {!otpSent ? (
              <>
                {/* Role toggle */}
                <View style={styles.roleToggle}>
                  {["Student", "Admin"].map((role) => {
                    const active = (role === "Admin") === isAdmin;
                    return (
                      <TouchableOpacity
                        key={role}
                        onPress={() => setIsAdmin(role === "Admin")}
                        style={[styles.roleBtn, active && styles.roleBtnActive]}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.roleBtnText, active && styles.roleBtnTextActive]}>
                          {role}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={isAdmin ? "staff@ug.edu.gh" : "student@st.ug.edu.gh"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>{isAdmin ? "Staff ID" : "Student ID"}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={isAdmin ? "STAFF-001" : "10897354"}
                    value={idNumber}
                    onChangeText={setIdNumber}
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleSendOTP}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Send OTP</Text>
                </TouchableOpacity>

                <Text style={styles.helpText}>
                  Need help?{" "}
                  <Text style={styles.helpLink}>Contact Admin</Text>
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setOtpSent(false)}
                  style={styles.backBtn}
                >
                  <Feather name="chevron-left" size={18} color={Colors.deepBlue} />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.otpHeader}>
                  <View style={styles.mailIcon}>
                    <Feather name="mail" size={28} color={Colors.accentGold} />
                  </View>
                  <Text style={styles.otpTitle}>Verify Your Email</Text>
                  <Text style={styles.otpSubtitle}>
                    {"We've sent a 6-digit code to"}
                    {"\n"}
                    <Text style={styles.otpEmail}>{sentEmail}</Text>
                  </Text>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Enter OTP Code</Text>
                  <TextInput
                    style={[styles.input, styles.otpInput]}
                    placeholder="000000"
                    value={otp}
                    onChangeText={(t) => setOtp(t.replace(/\D/g, "").slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={Colors.gray400}
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleVerifyOTP}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Verify &amp; Sign In</Text>
                </TouchableOpacity>

                <Text style={styles.helpText}>
                  {"Didn't receive code? "}
                  <Text
                    style={styles.helpLink}
                    onPress={() => Alert.alert("OTP Resent", `Code resent to ${sentEmail}`)}
                  >
                    Resend OTP
                  </Text>
                </Text>

                <View style={styles.demoBanner}>
                  <Text style={styles.demoText}>
                    <Text style={{ fontWeight: "700" }}>Demo Mode: </Text>
                    Use code{" "}
                    <Text style={{ fontFamily: "monospace", fontWeight: "700" }}>123456</Text>
                  </Text>
                </View>
              </>
            )}
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
  roleToggle: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  roleBtnActive: { backgroundColor: Colors.deepBlue },
  roleBtnText: { color: Colors.deepBlue, fontSize: 14, fontWeight: "700" },
  roleBtnTextActive: { color: Colors.white },
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
  otpInput: {
    textAlign: "center",
    letterSpacing: 10,
    fontSize: 20,
    fontWeight: "700",
  },
  primaryBtn: {
    backgroundColor: Colors.accentGold,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  helpText: { textAlign: "center", fontSize: 12, color: Colors.gray400 },
  helpLink: { color: Colors.deepBlue, fontWeight: "700" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: -4 },
  backText: { color: Colors.deepBlue, fontSize: 14, fontWeight: "700" },
  otpHeader: { alignItems: "center", gap: 8 },
  mailIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(186,143,74,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  otpTitle: { color: Colors.deepBlue, fontSize: 16, fontWeight: "800" },
  otpSubtitle: { color: Colors.gray500, fontSize: 12, textAlign: "center", lineHeight: 18 },
  otpEmail: { color: Colors.deepBlue, fontWeight: "700" },
  demoBanner: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 12,
    padding: 12,
  },
  demoText: { color: "#92400e", fontSize: 12, textAlign: "center" },
  footer: { textAlign: "center", color: Colors.gray400, fontSize: 11, marginTop: 20 },
});
