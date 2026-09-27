import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusBarBackground from "../../components/StatusBarBackground";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { Colors } from "../../constants/Colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [showConfirm, setShowConfirm] = useState(false);

  const infoFields = [
    { label: "Student ID", value: "10897354" },
    { label: "Email", value: "s.dunyo@st.ug.edu.gh" },
    { label: "Department", value: "Computer Science" },
    { label: "College", value: "Basic & Applied Science" },
    { label: "Academic Year", value: "2023 / 2024" },
  ];

  const menuItems = [
    { icon: "bell" as const, label: "Notifications", sub: "Manage alerts & updates", badge: "3", screen: "Notifications" as const },
    { icon: "shield" as const, label: "Privacy & Security", sub: "Password, 2FA, sessions", badge: null, screen: "Privacy" as const },
    { icon: "help-circle" as const, label: "Help & Support", sub: "FAQs, contact admin", badge: null, screen: "HelpSupport" as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBarBackground />
      {/* Hero header */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SA</Text>
        </View>
        <Text style={styles.name}>Stephanie Awrabena Dunyo</Text>
        <Text style={styles.program}>BSc Information Technology · Level 300</Text>
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active Student</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
        {/* Info card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Student Information</Text>
          {infoFields.map((f, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{f.label}</Text>
              <Text style={styles.infoValue}>{f.value}</Text>
            </View>
          ))}
        </View>

        {/* Menu items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(item.screen)}
              style={[styles.menuRow, i > 0 && styles.menuRowBorder]}
              activeOpacity={0.8}
            >
              <View style={styles.menuIcon}>
                <Feather name={item.icon} size={16} color={Colors.deepBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Feather name="chevron-right" size={14} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>CS Dept. Registration App · v1.0.0</Text>

        {/* Sign out */}
        {!showConfirm ? (
          <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowConfirm(true)} activeOpacity={0.8}>
            <Feather name="log-out" size={16} color={Colors.red} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Sign out of your account?</Text>
            <Text style={styles.confirmSub}>You will need to log in again to access your registration details.</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmSignOutBtn}
                onPress={() => navigation.replace("Login")}
              >
                <Feather name="log-out" size={14} color={Colors.white} />
                <Text style={styles.confirmSignOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  hero: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 6,
    paddingBottom: 48,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentGold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatarText: { color: Colors.white, fontSize: 28, fontWeight: "800" },
  name: { color: Colors.white, fontSize: 16, fontWeight: "800", textAlign: "center" },
  program: { color: "rgba(255,255,255,0.6)", fontSize: 12, textAlign: "center" },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(52,211,153,0.2)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#34d399" },
  activeText: { color: "#34d399", fontSize: 11, fontWeight: "700" },
  body: { flex: 1, marginTop: -24 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  infoLabel: { color: Colors.gray400, fontSize: 12, fontWeight: "600" },
  infoValue: { color: Colors.darkText, fontSize: 12, fontWeight: "700", maxWidth: "55%", textAlign: "right" },
  menuCard: { backgroundColor: Colors.white, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  menuRowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  menuIcon: { width: 36, height: 36, backgroundColor: "#eff6ff", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
  menuSub: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  badge: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.accentGold, alignItems: "center", justifyContent: "center" },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: "800" },
  version: { textAlign: "center", color: Colors.gray400, fontSize: 11 },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fee2e2", borderRadius: 16, paddingVertical: 14 },
  signOutText: { color: Colors.red, fontSize: 14, fontWeight: "700" },
  confirmCard: { backgroundColor: Colors.white, borderRadius: 20, borderWidth: 1, borderColor: "#fee2e2", padding: 16, gap: 10 },
  confirmTitle: { color: Colors.darkText, fontSize: 14, fontWeight: "700", textAlign: "center" },
  confirmSub: { color: Colors.gray400, fontSize: 12, textAlign: "center", lineHeight: 18 },
  confirmBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: Colors.lightGray, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  confirmSignOutBtn: { flex: 1, backgroundColor: Colors.red, borderRadius: 12, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  confirmSignOutText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
});
