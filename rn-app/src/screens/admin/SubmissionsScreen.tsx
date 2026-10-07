import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { SAMPLE_SUBMISSIONS } from "../../data/sampleData";
import { Colors } from "../../constants/Colors";
import StatusBadge from "../../components/StatusBadge";
import type { Submission, VerificationStatus } from "../../types";
import api from "../../api";

type FilterStatus = "All" | VerificationStatus;

export default function SubmissionsScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchSubmissions();
    }, [])
  );

  const fetchSubmissions = async () => {
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
      console.error("Failed to fetch submissions:", e);
    }
  };

  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search);
    const matchFilter = filter === "All" || s.status === filter;
    return matchSearch && matchFilter;
  });

  function updateStatus(id: string, status: VerificationStatus) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    setSelected(null);
    Alert.alert("Updated", `Submission marked as ${status}.`);
  }

  const FILTERS: FilterStatus[] = ["All", "Pending", "Approved", "Rejected"];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Submissions</Text>
        <Text style={styles.headerSub}>{filtered.length} records</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or ID…"
            placeholderTextColor={Colors.gray400}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 10 }}>
        {filtered.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            onPress={() => setSelected(s)}
            activeOpacity={0.8}
          >
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{s.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.meta}>{s.studentId} · {s.level}</Text>
                <Text style={styles.prog}>{s.program}</Text>
              </View>
              <StatusBadge status={s.status} />
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.detail}>{s.courses} courses</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.detail}>Submitted {s.submittedAt}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Feather name="inbox" size={32} color={Colors.gray400} />
            <Text style={styles.emptyText}>No submissions found</Text>
          </View>
        )}
      </ScrollView>

      {/* Detail sheet */}
      {selected && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setSelected(null)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetAvatar}>
                <Text style={styles.sheetAvatarText}>{selected.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetName}>{selected.name}</Text>
                <Text style={styles.sheetMeta}>{selected.studentId} · {selected.program}</Text>
              </View>
              <StatusBadge status={selected.status} />
            </View>

            {[
              { label: "Level", value: selected.level },
              { label: "Courses", value: `${selected.courses} courses` },
              { label: "Submitted At", value: selected.submittedAt },
              { label: "Reference", value: `DEP-2024-${selected.studentId}` },
            ].map((d, i) => (
              <View key={i} style={[styles.detailRow, i > 0 && styles.detailBorder]}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}

            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => updateStatus(selected.id, "Approved")}
              >
                <Feather name="check" size={16} color={Colors.white} />
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => updateStatus(selected.id, "Rejected")}
              >
                <Feather name="x" size={16} color={Colors.red} />
                <Text style={styles.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  filterScroll: { backgroundColor: Colors.white, paddingVertical: 10, maxHeight: 52 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.lightGray },
  filterChipActive: { backgroundColor: Colors.deepBlue },
  filterChipText: { fontSize: 12, fontWeight: "700", color: Colors.gray500 },
  filterChipTextActive: { color: Colors.white },
  body: { flex: 1 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.borderLight, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.deepBlue, alignItems: "center", justifyContent: "center" },
  avatarText: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  name: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
  meta: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  prog: { color: Colors.deepBlue, fontSize: 11, fontWeight: "600", marginTop: 2 },
  cardBottom: { flexDirection: "row", gap: 6, borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 10 },
  detail: { color: Colors.gray400, fontSize: 11 },
  dot: { color: Colors.gray400, fontSize: 11 },
  empty: { alignItems: "center", gap: 12, paddingVertical: 48 },
  emptyText: { color: Colors.gray400, fontSize: 14 },
  overlay: { position: "absolute", inset: 0, justifyContent: "flex-end" } as any,
  overlayBg: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" } as any,
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, gap: 12 },
  sheetHandle: { width: 40, height: 4, backgroundColor: "#e5e7eb", borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  sheetHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  sheetAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.deepBlue, alignItems: "center", justifyContent: "center" },
  sheetAvatarText: { color: Colors.white, fontSize: 18, fontWeight: "800" },
  sheetName: { color: Colors.darkText, fontSize: 16, fontWeight: "800" },
  sheetMeta: { color: Colors.gray400, fontSize: 12, marginTop: 2 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  detailBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  detailLabel: { color: Colors.gray400, fontSize: 12 },
  detailValue: { color: Colors.darkText, fontSize: 12, fontWeight: "700" },
  actionBtns: { flexDirection: "row", gap: 10, paddingTop: 8 },
  approveBtn: { flex: 1, backgroundColor: "#059669", borderRadius: 14, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  approveBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  rejectBtn: { flex: 1, borderWidth: 2, borderColor: Colors.red, borderRadius: 14, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  rejectBtnText: { color: Colors.red, fontSize: 14, fontWeight: "700" },
});
