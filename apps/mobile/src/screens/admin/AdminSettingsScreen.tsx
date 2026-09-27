import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusBarBackground from "../../components/StatusBarBackground";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { Colors } from "../../constants/Colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AdminSettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const semesterInfo = [
    { label: "Current Semester", value: "Semester 2" },
    { label: "Academic Year", value: "2023 / 2024" },
    { label: "Registration Deadline", value: "Jan 31, 2024" },
    { label: "Verification Window", value: "Jan 15 – Jan 31" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBarBackground />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <Text style={styles.headerSub}>System configuration</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Admin profile */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>KA</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Mr. K. Acheampong</Text>
            <Text style={styles.profileRole}>CS Department Administrator</Text>
            <Text style={styles.profileEmail}>k.acheampong@ug.edu.gh</Text>
          </View>
        </View>

        {/* Semester info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Semester Information</Text>
          {semesterInfo.map((d, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{d.label}</Text>
              <Text style={styles.infoValue}>{d.value}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.editBtn}>
            <Feather name="edit-2" size={14} color={Colors.deepBlue} />
            <Text style={styles.editBtnText}>Edit Semester Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Notification Settings</Text>
          {[
            { label: "Email Notifications", sub: "Receive submission alerts via email", value: emailNotif, setter: setEmailNotif },
            { label: "Push Notifications", sub: "Get real-time alerts on device", value: pushNotif, setter: setPushNotif },
          ].map((item, i) => (
            <View key={i} style={[styles.toggleRow, i > 0 && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <Text style={styles.toggleSub}>{item.sub}</Text>
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

        {/* System settings */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>System Settings</Text>
          {[
            { label: "Auto-Approve", sub: "Automatically approve valid submissions", value: autoApprove, setter: setAutoApprove },
            { label: "Maintenance Mode", sub: "Disable student access temporarily", value: maintenanceMode, setter: setMaintenanceMode },
          ].map((item, i) => (
            <View key={i} style={[styles.toggleRow, i > 0 && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <Text style={styles.toggleSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.setter}
                trackColor={{ false: "#e5e7eb", true: item.label === "Maintenance Mode" ? Colors.red : Colors.deepBlue }}
                thumbColor={Colors.white}
              />
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Quick Actions</Text>
          {[
            { icon: "download" as const, label: "Export Student Data", sub: "Download CSV report", color: Colors.deepBlue },
            { icon: "refresh-cw" as const, label: "Sync MISWeb Data", sub: "Pull latest enrollments", color: Colors.deepBlue },
            { icon: "mail" as const, label: "Send Bulk Notification", sub: "Alert all students", color: Colors.accentGold },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.actionRow, i > 0 && styles.rowBorder]}
              onPress={() => Alert.alert(action.label, `${action.sub} - coming soon.`)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color === Colors.accentGold ? "#fffbeb" : "#eff6ff" }]}>
                <Feather name={action.icon} size={16} color={action.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{action.label}</Text>
                <Text style={styles.toggleSub}>{action.sub}</Text>
              </View>
              <Feather name="chevron-right" size={14} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>App Information</Text>
          {[
            { label: "Version", value: "v1.0.0" },
            { label: "Build", value: "2024.01.15" },
            { label: "Environment", value: "Production" },
          ].map((d, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{d.label}</Text>
              <Text style={styles.infoValue}>{d.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={16} color={Colors.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.deepBlue, paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  body: { flex: 1 },
  profileCard: { backgroundColor: Colors.deepBlue, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  profileAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.accentGold, alignItems: "center", justifyContent: "center" },
  profileAvatarText: { color: Colors.white, fontSize: 18, fontWeight: "800" },
  profileName: { color: Colors.white, fontSize: 15, fontWeight: "800" },
  profileRole: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  profileEmail: { color: Colors.accentGold, fontSize: 11, marginTop: 4 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 4, borderWidth: 1, borderColor: Colors.borderLight },
  sectionLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  infoLabel: { color: Colors.gray400, fontSize: 12 },
  infoValue: { color: Colors.darkText, fontSize: 12, fontWeight: "700" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  editBtnText: { color: Colors.deepBlue, fontSize: 13, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  rowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  toggleLabel: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  toggleSub: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  actionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fee2e2", borderRadius: 16, paddingVertical: 14 },
  signOutText: { color: Colors.red, fontSize: 14, fontWeight: "700" },
});
