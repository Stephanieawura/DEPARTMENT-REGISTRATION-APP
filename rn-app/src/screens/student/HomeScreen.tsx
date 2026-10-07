import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { StudentTabParamList } from "../../navigation/StudentApp";
import { Colors } from "../../constants/Colors";

type Nav = BottomTabNavigationProp<StudentTabParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [userData, setUserData] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const api = require('../../api').default;
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
            const res = await api.get(`/users/${userId}`);
            setUserData(res.data);
          }
        } catch (e) {
          console.error("Failed to load user for home screen", e);
        }
      }
      loadUser();
    }, [])
  );


  const quickActions = [
    {
      label: "Sync Courses",
      desc: "Fetch from MISWeb",
      icon: "refresh-cw" as const,
      color: Colors.deepBlue,
      tab: "Courses" as const,
    },
    {
      label: "Upload Slip",
      desc: "Proof of Registration",
      icon: "upload" as const,
      color: Colors.accentGold,
      tab: "Registration" as const,
    },
    {
      label: "Check Status",
      desc: "View clearance",
      icon: "check-circle" as const,
      color: Colors.deepBlue,
      tab: "Registration" as const,
    },
    {
      label: "My Profile",
      desc: "View details",
      icon: "user" as const,
      color: Colors.deepBlue,
      tab: "Profile" as const,
    },
  ];

  const activity = [
    { label: "Courses synced from MISWeb", time: "Today 9:32am", icon: "refresh-cw" as const },
    { label: "Proof of Registration uploaded", time: "Today 9:35am", icon: "upload" as const },
    { label: "Verification submitted", time: "Today 9:36am", icon: "file-text" as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {userData?.name ? userData.name.split(' ')[0] : 'Student'}
          </Text>
          <Text style={styles.headerSub}>
            {userData?.program || "No Program Set"} · Level {userData?.level || "N/A"}
          </Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Feather name="bell" size={18} color={Colors.white} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Status overview */}
        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View>
              <Text style={styles.statusLabel}>Registration Status</Text>
              <View style={styles.statusRow}>
                <Feather name="clock" size={15} color={Colors.accentGold} />
                <Text style={styles.statusValue}>Pending Verification</Text>
              </View>
            </View>
            <View style={styles.semBadge}>
              <Text style={styles.semText}>Sem 2 · 2023/24</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              { value: "6", label: "Courses" },
              { value: "18", label: "Credits" },
              { value: "1", label: "Doc Uploaded" },
            ].map((s) => (
              <View key={s.label} style={styles.statBox}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={styles.actionCard}
                onPress={() => navigation.navigate(a.tab)}
                activeOpacity={0.8}
              >
                <View style={styles.actionIcon}>
                  <Feather name={a.icon} size={20} color={a.color} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
                <Text style={styles.actionDesc}>{a.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent activity */}
        <View>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {activity.map((item, i) => (
              <View
                key={i}
                style={[styles.activityRow, i < activity.length - 1 && styles.activityBorder]}
              >
                <View style={styles.activityIcon}>
                  <Feather name={item.icon} size={14} color={Colors.deepBlue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityLabel}>{item.label}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <Feather name="chevron-right" size={14} color={Colors.gray400} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flex: 1 },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  bellBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentGold,
    borderWidth: 1.5,
    borderColor: Colors.deepBlue,
  },
  body: { flex: 1 },
  statusCard: {
    backgroundColor: Colors.deepBlue,
    borderRadius: 20,
    padding: 16,
  },
  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  statusLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  statusValue: { color: Colors.accentGold, fontWeight: "700", fontSize: 13 },
  semBadge: { backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  semText: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, alignItems: "center" },
  statValue: { color: Colors.white, fontSize: 22, fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 2 },
  sectionTitle: { color: Colors.gray500, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionCard: {
    width: "47.5%",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: { width: 40, height: 40, backgroundColor: Colors.lightGray, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  actionDesc: { color: Colors.gray400, fontSize: 11 },
  activityCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  activityIcon: { width: 32, height: 32, backgroundColor: "#eff6ff", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  activityLabel: { color: Colors.darkText, fontSize: 12, fontWeight: "600" },
  activityTime: { color: Colors.gray400, fontSize: 10, marginTop: 2 },
});
