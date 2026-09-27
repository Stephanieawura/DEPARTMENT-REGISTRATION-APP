import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { Colors } from "../../constants/Colors";
import PrimaryButton from "../../components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "CourseDetails">;

export default function CourseDetailsScreen({ route, navigation }: Props) {
  const { course, isRegistered: initReg = true } = route.params;
  const [registered, setRegistered] = useState(initReg);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const enrollPct =
    course.enrolled && course.capacity
      ? Math.round((course.enrolled / course.capacity) * 100)
      : 0;

  const details = [
    { label: "Lecturer", value: course.lecturer, icon: "user" as const },
    { label: "Schedule", value: course.schedule ?? "TBA", icon: "clock" as const },
    { label: "Venue", value: course.venue ?? "TBA", icon: "map-pin" as const },
    { label: "Prerequisites", value: course.prerequisites ?? "None", icon: "book-open" as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color={Colors.white} />
          <Text style={styles.backText}>Back to Courses</Text>
        </TouchableOpacity>
        <View style={styles.headerBottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseCode}>{course.code}</Text>
          </View>
          <View style={styles.creditBadge}>
            <Text style={styles.creditText}>{course.credits} Credits</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>
        {/* Enrolled status */}
        {registered && (
          <View style={styles.enrolledBanner}>
            <View style={styles.enrolledIcon}>
              <Feather name="check-circle" size={20} color="#059669" />
            </View>
            <View>
              <Text style={styles.enrolledTitle}>Registered</Text>
              <Text style={styles.enrolledSub}>You are enrolled in this course</Text>
            </View>
          </View>
        )}

        {/* Description + details */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{course.description ?? "No description available."}</Text>

          <View style={styles.divider} />
          <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>Course Details</Text>
          {details.map((d, i) => (
            <View key={i} style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Feather name={d.icon} size={15} color={Colors.deepBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Enrollment bar */}
        {course.enrolled !== undefined && course.capacity !== undefined && (
          <View style={styles.card}>
            <View style={styles.enrollRow}>
              <Text style={styles.sectionLabel}>Enrollment</Text>
              <Text style={styles.enrollCount}>{course.enrolled} / {course.capacity}</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${enrollPct}%` as any }]} />
            </View>
            <Text style={styles.seatsText}>
              {course.capacity - course.enrolled} seats available
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        {!registered ? (
          <PrimaryButton label="Register for Course" onPress={() => setRegistered(true)} />
        ) : (
          <PrimaryButton
            label="Cancel Registration"
            variant="destructive"
            onPress={() => setConfirmVisible(true)}
          />
        )}
      </View>

      {/* Confirm modal */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalIcon}>
              <Feather name="alert-circle" size={28} color={Colors.red} />
            </View>
            <Text style={styles.modalTitle}>Cancel Registration?</Text>
            <Text style={styles.modalBody}>
              {"Are you sure you want to unregister from "}
              <Text style={{ color: Colors.deepBlue, fontWeight: "700" }}>{course.code}</Text>
              {"? This action cannot be undone."}
            </Text>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => { setRegistered(false); setConfirmVisible(false); }}
            >
              <Text style={styles.confirmBtnText}>Yes, Cancel Registration</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keepBtn}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={styles.keepBtnText}>Keep Registration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.deepBlue, paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  backText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  headerBottom: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  courseTitle: { color: Colors.white, fontSize: 18, fontWeight: "800", lineHeight: 24 },
  courseCode: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 },
  creditBadge: { backgroundColor: Colors.accentGold, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  creditText: { color: Colors.white, fontSize: 12, fontWeight: "800" },
  body: { flex: 1 },
  enrolledBanner: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#a7f3d0", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  enrolledIcon: { width: 40, height: 40, backgroundColor: "#d1fae5", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  enrolledTitle: { color: "#065f46", fontSize: 14, fontWeight: "700" },
  enrolledSub: { color: "#047857", fontSize: 11, marginTop: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.borderLight, gap: 8 },
  sectionLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  description: { color: Colors.darkText, fontSize: 13, lineHeight: 20 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 8 },
  detailRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  detailIcon: { width: 32, height: 32, backgroundColor: Colors.lightGray, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  detailLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "600" },
  detailValue: { color: Colors.darkText, fontSize: 13, fontWeight: "700", marginTop: 2 },
  enrollRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  enrollCount: { color: Colors.deepBlue, fontSize: 12, fontWeight: "700" },
  barBg: { height: 8, backgroundColor: Colors.lightGray, borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: Colors.deepBlue, borderRadius: 4 },
  seatsText: { color: Colors.gray400, fontSize: 11 },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, padding: 16 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 24 },
  modal: { backgroundColor: Colors.white, borderRadius: 24, padding: 24, width: "100%", gap: 12, alignItems: "center" },
  modalIcon: { width: 56, height: 56, backgroundColor: "#fef2f2", borderRadius: 28, alignItems: "center", justifyContent: "center" },
  modalTitle: { color: Colors.darkText, fontSize: 18, fontWeight: "800" },
  modalBody: { color: Colors.gray500, fontSize: 13, lineHeight: 20, textAlign: "center" },
  confirmBtn: { width: "100%", backgroundColor: Colors.red, paddingVertical: 14, borderRadius: 16, alignItems: "center" },
  confirmBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  keepBtn: { width: "100%", backgroundColor: Colors.lightGray, paddingVertical: 14, borderRadius: 16, alignItems: "center" },
  keepBtnText: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
});
