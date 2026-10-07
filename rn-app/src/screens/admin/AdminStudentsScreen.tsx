import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { SAMPLE_SUBMISSIONS } from "../../data/sampleData";
import { Colors } from "../../constants/Colors";
import StatusBadge from "../../components/StatusBadge";
import type { Submission } from "../../types";
import api from "../../api";

export default function AdminStudentsScreen() {
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchStudents() {
      try {
        const res = await api.get('/submissions');
        const mapped: Submission[] = res.data.map((s: any) => ({
          id: s.id,
          name: s.student?.name || "Unknown",
          studentId: s.student?.studentId || "Unknown",
          level: s.student?.level || "",
          program: s.student?.program || "",
          courses: s.courses?.length || 0,
          submittedAt: new Date(s.submittedAt).toLocaleDateString(),
          status: s.status === 'PENDING' ? 'Pending' : s.status === 'APPROVED' ? 'Approved' : 'Rejected'
        }));
        setSubmissions(mapped);
      } catch (e) {
        console.error("Failed to fetch admin students:", e);
      }
    }
    fetchStudents();
    }, [])
  );

  const filtered = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search) ||
      s.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Students</Text>
        <Text style={styles.headerSub}>{submissions.length} registered this semester</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search students…"
            placeholderTextColor={Colors.gray400}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Summary chips */}
      <View style={styles.summaryRow}>
        {[
          { label: "Total", value: submissions.length, color: Colors.deepBlue },
          { label: "Pending", value: submissions.filter(s => s.status === "Pending").length, color: "#b45309" },
          { label: "Approved", value: submissions.filter(s => s.status === "Approved").length, color: "#059669" },
          { label: "Rejected", value: submissions.filter(s => s.status === "Rejected").length, color: Colors.red },
        ].map((c) => (
          <View key={c.label} style={styles.summaryChip}>
            <Text style={[styles.summaryValue, { color: c.color }]}>{c.value}</Text>
            <Text style={styles.summaryLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {filtered.map((s, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.avatar, { backgroundColor: s.status === "Approved" ? "#059669" : s.status === "Rejected" ? Colors.red : Colors.deepBlue }]}>
                <Text style={styles.avatarText}>{s.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.id}>{s.studentId}</Text>
                <Text style={styles.program}>{s.program} · {s.level}</Text>
              </View>
              <StatusBadge status={s.status} />
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Feather name="book" size={11} color={Colors.gray400} />
                <Text style={styles.footerText}>{s.courses} courses</Text>
              </View>
              <View style={styles.footerItem}>
                <Feather name="calendar" size={11} color={Colors.gray400} />
                <Text style={styles.footerText}>{s.submittedAt}</Text>
              </View>
            </View>
          </View>
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Feather name="users" size={32} color={Colors.gray400} />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.deepBlue, paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.lightGray, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.darkText },
  summaryRow: { flexDirection: "row", backgroundColor: Colors.white, paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  summaryChip: { flex: 1, alignItems: "center", backgroundColor: Colors.lightGray, borderRadius: 12, paddingVertical: 8 },
  summaryValue: { fontSize: 18, fontWeight: "800" },
  summaryLabel: { color: Colors.gray500, fontSize: 10, fontWeight: "600", marginTop: 2 },
  body: { flex: 1 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.borderLight, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  name: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
  id: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  program: { color: Colors.deepBlue, fontSize: 11, fontWeight: "600", marginTop: 2 },
  cardFooter: { flexDirection: "row", gap: 16, borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 10 },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerText: { color: Colors.gray400, fontSize: 11 },
  empty: { alignItems: "center", gap: 12, paddingVertical: 48 },
  emptyText: { color: Colors.gray400, fontSize: 14 },
});
