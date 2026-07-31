import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/Colors";

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);

  function handleSavePw() {
    if (!currentPw || !newPw || !confirmPw) return;
    if (newPw !== confirmPw) { Alert.alert("Error", "Passwords do not match."); return; }
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setShowChangePw(false);
    Alert.alert("Updated", "Your password has been changed.");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Privacy &amp; Security</Text>
          <Text style={styles.headerSub}>Keep your account safe</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Password section */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Password</Text>
          {!showChangePw ? (
            <TouchableOpacity onPress={() => setShowChangePw(true)} style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <Feather name="lock" size={15} color={Colors.deepBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>Change Password</Text>
                <Text style={styles.menuSub}>Last changed: Never</Text>
              </View>
              <Feather name="chevron-right" size={14} color={Colors.gray400} />
            </TouchableOpacity>
          ) : (
            <View style={styles.pwForm}>
              {[
                { label: "Current Password", val: currentPw, set: setCurrentPw },
                { label: "New Password", val: newPw, set: setNewPw },
                { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
              ].map((f) => (
                <View key={f.label} style={styles.field}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={f.val}
                    onChangeText={f.set}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={Colors.gray400}
                  />
                </View>
              ))}
              <View style={styles.pwBtns}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowChangePw(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSavePw}>
                  <Text style={styles.saveText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Authentication toggles */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Authentication</Text>
          {[
            { label: "Two-Factor Authentication", sub: "Verify login via email code", value: twoFactor, setter: setTwoFactor },
            { label: "Biometric Login", sub: "Use fingerprint or Face ID", value: biometric, setter: setBiometric },
            { label: "Remember this device", sub: "Stay logged in for 30 days", value: rememberDevice, setter: setRememberDevice },
          ].map((item, i) => (
            <View key={i} style={[styles.toggleRow, i > 0 && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.setter}
                trackColor={{ false: "#e5e7eb", true: Colors.deepBlue }}
                thumbColor={Colors.white}
              />
            </View>
          ))}
        </View>

        {/* Privacy */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Data &amp; Privacy</Text>
          <View style={[styles.toggleRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Share usage analytics</Text>
              <Text style={styles.menuSub}>Help improve the app anonymously</Text>
            </View>
            <Switch
              value={shareAnalytics}
              onValueChange={setShareAnalytics}
              trackColor={{ false: "#e5e7eb", true: Colors.deepBlue }}
              thumbColor={Colors.white}
            />
          </View>
          {["Privacy Policy", "Terms of Use"].map((label) => (
            <TouchableOpacity key={label} style={[styles.menuRow, styles.rowBorder]}>
              <Feather name="file-text" size={14} color={Colors.deepBlue} />
              <Text style={[styles.menuLabel, { color: Colors.deepBlue, flex: 1 }]}>{label}</Text>
              <Feather name="chevron-right" size={13} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Active sessions */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Active Sessions</Text>
          {[
            { device: "iPhone 14 Pro", location: "Accra, Ghana", time: "Now · Current", current: true },
            { device: "Chrome · Windows", location: "Accra, Ghana", time: "Jan 13 · 2:15pm", current: false },
          ].map((s, i) => (
            <View key={i} style={[styles.sessionRow, i > 0 && styles.rowBorder]}>
              <View style={styles.sessionIcon}>
                <Feather name="smartphone" size={15} color={Colors.deepBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{s.device}</Text>
                <Text style={styles.menuSub}>{s.location} · {s.time}</Text>
              </View>
              {s.current
                ? <View style={styles.activePill}><Text style={styles.activePillText}>Active</Text></View>
                : <TouchableOpacity><Text style={styles.revokeText}>Revoke</Text></TouchableOpacity>
              }
            </View>
          ))}
        </View>

        {/* Danger zone */}
        <View style={styles.dangerCard}>
          <Text style={[styles.sectionLabel, { color: "#f87171" }]}>Danger Zone</Text>
          <TouchableOpacity style={styles.deleteRow}>
            <Feather name="trash-2" size={15} color={Colors.red} />
            <Text style={styles.deleteText}>Delete My Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.deepBlue, paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  body: { flex: 1 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 4, borderWidth: 1, borderColor: Colors.borderLight },
  sectionLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  menuIcon: { width: 36, height: 36, backgroundColor: "#eff6ff", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  menuSub: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  pwForm: { gap: 12 },
  field: { gap: 4 },
  fieldLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" },
  input: { backgroundColor: Colors.lightGray, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: Colors.darkText },
  pwBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: Colors.lightGray, borderRadius: 12, paddingVertical: 11, alignItems: "center" },
  cancelText: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  saveBtn: { flex: 1, backgroundColor: Colors.accentGold, borderRadius: 12, paddingVertical: 11, alignItems: "center" },
  saveText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  rowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  sessionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  sessionIcon: { width: 36, height: 36, backgroundColor: "#eff6ff", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  activePill: { backgroundColor: "#ecfdf5", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  activePillText: { color: "#059669", fontSize: 10, fontWeight: "800" },
  revokeText: { color: Colors.red, fontSize: 11, fontWeight: "700" },
  dangerCard: { backgroundColor: "#fef2f2", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#fecaca" },
  deleteRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  deleteText: { color: Colors.red, fontSize: 14, fontWeight: "700" },
});
