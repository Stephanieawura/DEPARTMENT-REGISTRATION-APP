import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { SAMPLE_COURSES } from "../../data/sampleData";
import { Colors } from "../../constants/Colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CoursesScreen() {
  const navigation = useNavigation<Nav>();
  const [synced, setSynced] = useState(true);
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setSynced(true); }, 1500);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Courses</Text>
          <Text style={styles.headerSub}>Semester 2 · 2023/2024</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Feather name="bell" size={18} color={Colors.white} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Sync banner */}
        <View style={styles.syncCard}>
          <View style={styles.syncIcon}>
            {syncing
              ? <ActivityIndicator color={Colors.deepBlue} size="small" />
              : <Feather name="refresh-cw" size={18} color={Colors.deepBlue} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.syncTitle}>MISWeb Sync</Text>
            <Text style={styles.syncSub}>{synced ? "Last synced: Today 9:32am" : "Not yet synced"}</Text>
          </View>
          <TouchableOpacity
            onPress={handleSync}
            disabled={syncing}
            style={[styles.syncBtn, syncing && { opacity: 0.6 }]}
          >
            <Text style={styles.syncBtnText}>{syncing ? "Syncing…" : "Sync Now"}</Text>
          </TouchableOpacity>
        </View>

        {synced && (
          <>
            <View style={styles.countRow}>
              <Text style={styles.sectionTitle}>Registered Courses</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{SAMPLE_COURSES.length} courses · 18 credits</Text>
              </View>
            </View>

            {SAMPLE_COURSES.map((course, i) => (
              <TouchableOpacity
                key={i}
                style={styles.courseCard}
                onPress={() => navigation.navigate("CourseDetails", { course, isRegistered: true })}
                activeOpacity={0.8}
              >
                <View style={styles.courseCodeBox}>
                  <Text style={styles.courseCodeText}>{course.code.split(" ")[1]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  <Text style={styles.courseLecturer}>{course.lecturer}</Text>
                </View>
                <View style={styles.creditBadge}>
                  <Text style={styles.creditText}>{course.credits} cr</Text>
                </View>
                <Feather name="chevron-right" size={16} color={Colors.gray400} />
              </TouchableOpacity>
            ))}
          </>
        )}
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
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  bellBtn: { padding: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, position: "relative" },
  bellDot: { position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentGold, borderWidth: 1.5, borderColor: Colors.deepBlue },
  body: { flex: 1 },
  syncCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: Colors.borderLight },
  syncIcon: { width: 40, height: 40, backgroundColor: "#eff6ff", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  syncTitle: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
  syncSub: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  syncBtn: { backgroundColor: Colors.accentGold, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  syncBtnText: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  countRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: Colors.gray500, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  countBadge: { backgroundColor: "#eff6ff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  countText: { color: Colors.deepBlue, fontSize: 11, fontWeight: "700" },
  courseCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  courseCodeBox: { width: 44, height: 44, backgroundColor: Colors.deepBlue, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  courseCodeText: { color: Colors.white, fontSize: 11, fontWeight: "800" },
  courseTitle: { color: Colors.darkText, fontSize: 13, fontWeight: "700", lineHeight: 18 },
  courseCode: { color: Colors.deepBlue, fontSize: 11, fontWeight: "600", marginTop: 2 },
  courseLecturer: { color: Colors.gray400, fontSize: 11, marginTop: 3 },
  creditBadge: { backgroundColor: "#eff6ff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  creditText: { color: Colors.deepBlue, fontSize: 11, fontWeight: "700" },
});
