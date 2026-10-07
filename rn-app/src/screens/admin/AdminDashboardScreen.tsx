import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { SAMPLE_SUBMISSIONS } from "../../data/sampleData";
import { Colors } from "../../constants/Colors";
import StatusBadge from "../../components/StatusBadge";
import api from "../../api";

type Nav = NativeStackNavigationProp<RootStackParamList>;



export default function AdminDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [submissions, setSubmissions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchStats() {
      try {
        const res = await api.get('/submissions');
        setSubmissions(res.data);
      } catch (e) {
        console.error("Failed to fetch admin stats:", e);
      }
    }
    fetchStats();
  }, [])
  );

  const pending = submissions.filter((s) => s.status === "PENDING").length;
  const approved = submissions.filter((s) => s.status === "APPROVED").length;
  const rejected = submissions.filter((s) => s.status === "REJECTED").length;
  const total = submissions.length;

  const stats = [
    { label: "Total Students", value: total, color: Colors.deepBlue, bg: "#eff6ff", sub: "Registered" },
    { label: "Pending Review", value: pending, color: "#b45309", bg: "#fffbeb", sub: "Awaiting" },
    { label: "Approved", value: approved, color: "#059669", bg: "#ecfdf5", sub: "Cleared" },
    { label: "Rejected", value: rejected, color: Colors.red, bg: "#fef2f2", sub: "Resubmit" },
  ];

  const distribution = [
    { label: "Approved", count: approved, color: "#10b981" },
    { label: "Pending", count: pending, color: "#f59e0b" },
    { label: "Rejected", count: rejected, color: "#ef4444" },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const trendMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  
  submissions.forEach(s => {
    if (s.createdAt || s.submittedAt) {
      const d = new Date(s.createdAt || s.submittedAt);
      const dayStr = d.toLocaleDateString("en-US", { weekday: 'short' });
      if (trendMap[dayStr] !== undefined) {
        trendMap[dayStr]++;
      }
    }
  });

  const TREND_DATA = days.map(day => ({ day, count: trendMap[day] }));
  const MAX_COUNT = Math.max(...TREND_DATA.map((d) => d.count), 1);
  const TOTAL_THIS_WEEK = TREND_DATA.reduce((sum, d) => sum + d.count, 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTop}>University of Ghana · CS Dept</Text>
          <Text style={styles.headerTitle}>Admin Portal</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="bell" size={17} color={Colors.white} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.replace("Login")}>
            <Feather name="log-out" size={17} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Welcome */}
        <View style={styles.welcomeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeSub}>Welcome back,</Text>
            <Text style={styles.welcomeName}>Mr. K. Acheampong</Text>
            <Text style={styles.welcomeRole}>CS Dept. Administrator</Text>
            <View style={styles.welcomeDate}>
              <Feather name="clock" size={11} color={Colors.accentGold} />
              <Text style={styles.welcomeDateText}>Semester 2, 2023/2024 · Jan 15, 2024</Text>
            </View>
          </View>
          <View style={styles.adminAvatar}>
            <Text style={styles.adminAvatarText}>KA</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Bar chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Submissions</Text>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>This week</Text>
            </View>
          </View>
          <View style={styles.barChart}>
            {TREND_DATA.map((d) => {
              const heightPct = (d.count / MAX_COUNT) * 100;
              return (
                <View key={d.day} style={styles.barCol}>
                  <Text style={styles.barCount}>{d.count}</Text>
                  <View style={styles.barWrapper}>
                    <View style={[styles.barFill, { height: `${heightPct}%` as any, opacity: d.day === "Fri" ? 1 : 0.45 }]} />
                  </View>
                  <Text style={styles.barDay}>{d.day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartFooter}>
            <Text style={styles.chartTotal}>Total this week: <Text style={styles.chartTotalBold}>{TOTAL_THIS_WEEK}</Text></Text>
          </View>
        </View>

        {/* Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Distribution</Text>
          {distribution.map((row) => {
            const pct = total ? Math.round((row.count / total) * 100) : 0;
            return (
              <View key={row.label} style={styles.distRow}>
                <View style={styles.distLabelRow}>
                  <Text style={styles.distLabel}>{row.label}</Text>
                  <Text style={styles.distCount}>{row.count} ({pct}%)</Text>
                </View>
                <View style={styles.distBarBg}>
                  <View style={[styles.distBarFill, { width: `${pct}%` as any, backgroundColor: row.color }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent submissions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Submissions</Text>
          {submissions.slice(0, 3).map((s, i) => (
            <View key={i} style={[styles.submissionRow, i > 0 && styles.submissionBorder]}>
              <View style={styles.submissionAvatar}>
                <Text style={styles.submissionAvatarText}>{(s.student?.name || "?").charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.submissionName}>{s.student?.name || "Unknown"}</Text>
                <Text style={styles.submissionId}>{s.student?.studentId || "Unknown"} · {s.student?.program || ""}</Text>
              </View>
              <StatusBadge status={s.status === 'PENDING' ? 'Pending' : s.status === 'APPROVED' ? 'Approved' : 'Rejected'} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.deepBlue, paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center" },
  headerTop: { color: Colors.accentGold, fontSize: 9, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase" },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: "800", marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 38, height: 38, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  bellDot: { position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentGold, borderWidth: 1.5, borderColor: Colors.deepBlue },
  body: { flex: 1 },
  welcomeCard: { backgroundColor: Colors.deepBlue, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center" },
  welcomeSub: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
  welcomeName: { color: Colors.white, fontSize: 16, fontWeight: "800", marginTop: 2 },
  welcomeRole: { color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 },
  welcomeDate: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" },
  welcomeDateText: { color: "rgba(255,255,255,0.5)", fontSize: 10 },
  adminAvatar: { width: 48, height: 48, backgroundColor: Colors.accentGold, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  adminAvatarText: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "47.5%", borderRadius: 16, padding: 14 },
  statValue: { fontSize: 28, fontWeight: "800" },
  statLabel: { color: Colors.darkText, fontSize: 11, fontWeight: "700", marginTop: 4 },
  statSub: { color: Colors.gray400, fontSize: 10, marginTop: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: Colors.borderLight },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { color: Colors.darkText, fontSize: 14, fontWeight: "800" },
  weekBadge: { backgroundColor: "#eff6ff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  weekBadgeText: { color: Colors.deepBlue, fontSize: 10, fontWeight: "700" },
  barChart: { flexDirection: "row", alignItems: "flex-end", height: 100, gap: 6 },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  barCount: { color: Colors.gray400, fontSize: 8, fontWeight: "600" },
  barWrapper: { flex: 1, width: "100%", justifyContent: "flex-end" },
  barFill: { width: "100%", backgroundColor: Colors.deepBlue, borderRadius: 4 },
  barDay: { color: Colors.gray400, fontSize: 8, fontWeight: "600" },
  chartFooter: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 10 },
  chartTotal: { color: Colors.gray400, fontSize: 11 },
  chartTotalBold: { color: Colors.deepBlue, fontWeight: "800" },
  chartTrend: { color: "#059669", fontSize: 11, fontWeight: "700" },
  distRow: { gap: 6 },
  distLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  distLabel: { color: Colors.darkText, fontSize: 12, fontWeight: "600" },
  distCount: { color: Colors.gray500, fontSize: 12, fontWeight: "700" },
  distBarBg: { height: 10, backgroundColor: "#f3f4f6", borderRadius: 5, overflow: "hidden" },
  distBarFill: { height: "100%", borderRadius: 5 },
  submissionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  submissionBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  submissionAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.deepBlue, alignItems: "center", justifyContent: "center" },
  submissionAvatarText: { color: Colors.white, fontSize: 14, fontWeight: "800" },
  submissionName: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  submissionId: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
});
