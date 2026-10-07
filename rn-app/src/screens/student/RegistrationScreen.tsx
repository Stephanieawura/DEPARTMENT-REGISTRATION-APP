import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "../../constants/Colors";

type SubTab = "upload" | "status";
type VerificationStatus = "Not_Submitted" | "Pending" | "Approved" | "Rejected";

const STATUS_CONFIG = {
  Not_Submitted: {
    icon: "file-minus" as const,
    iconColor: "#6b7280",
    bg: "#f3f4f6",
    border: "#e5e7eb",
    headline: "Not Submitted",
    message: "You have not submitted your registration documents yet.",
    textColor: "#374151",
  },
  Pending: {
    icon: "clock" as const,
    iconColor: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    headline: "Verification Pending",
    message: "Your submission is under review by the department. This usually takes 1–2 working days.",
    textColor: "#b45309",
  },
  Approved: {
    icon: "check-circle" as const,
    iconColor: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    headline: "Clearance Approved",
    message: "Your departmental clearance has been approved. You are fully registered.",
    textColor: "#065f46",
  },
  Rejected: {
    icon: "x-circle" as const,
    iconColor: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    headline: "Submission Rejected",
    message: "Your submission was rejected. Please review the feedback and resubmit.",
    textColor: "#991b1b",
  },
};



export default function RegistrationScreen() {
  const [subTab, setSubTab] = useState<SubTab>("upload");
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigation = require('@react-navigation/native').useNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);

  // Form states
  const [name, setName] = useState('');
  const [studentIdStr, setStudentIdStr] = useState('');
  const [program, setProgram] = useState('');
  const [level, setLevel] = useState('');
  const [academicYear, setAcademicYear] = useState('2023/2024');
  const [semester, setSemester] = useState('');

  const [showProgramModal, setShowProgramModal] = useState(false);
  const programs = ["BSc Information Technology", "BSc Computer Science", "BSc Mathematical Science"];

  const [showLevelModal, setShowLevelModal] = useState(false);
  const levels = ["100", "200", "300", "400"];

  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const semesters = ["Semester 1", "Semester 2"];

  const status: VerificationStatus = !submission ? 'Not_Submitted' 
    : submission.status === 'APPROVED' ? 'Approved' 
    : submission.status === 'REJECTED' ? 'Rejected' : 'Pending';
  const cfg = STATUS_CONFIG[status];
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const api = require('../../api').default;
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const res = await api.get(`/users/${userId}`);
          setUserData(res.data);

          try {
            const subRes = await api.get(`/submissions/student/${userId}`);
            if (subRes.data && subRes.data.length > 0) {
              setSubmission(subRes.data[0]);
            }
          } catch (e) {
            console.log("No submissions yet");
          }
        }
      } catch (e) {
        console.error("Failed to load user data:", e);
      }
    }
    fetchUser();
  }, []);

  const accountCreatedTime = userData?.createdAt ? new Date(userData.createdAt) : null;
  const validAccountDate = accountCreatedTime && !isNaN(accountCreatedTime.getTime()) ? accountCreatedTime.toLocaleDateString() : "Unknown";

  const submissionTime = submission?.submittedAt ? new Date(submission.submittedAt) : null;
  const validSubmissionDate = submissionTime && !isNaN(submissionTime.getTime()) ? submissionTime.toLocaleDateString() : "Awaiting";

  const timeline = [
    { label: "Account Created", done: !!userData, time: validAccountDate },
    { label: "Courses Synced", done: true, time: "Completed" }, // Simplified
    { label: "Document Uploaded", done: !!submission, time: validSubmissionDate },
    { label: "Submitted for Verification", done: !!submission, time: validSubmissionDate },
    { label: "Under Review", done: submission?.status === 'APPROVED' || submission?.status === 'REJECTED', time: submission ? "Completed" : "In progress" },
    { label: "Clearance Decision", done: submission?.status === 'APPROVED' || submission?.status === 'REJECTED', time: submission?.status === 'APPROVED' ? "Approved" : submission?.status === 'REJECTED' ? "Rejected" : "Awaiting" },
  ];

  async function handlePick() {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (!result.canceled && result.assets[0]) {
      setUploadedFile(result.assets[0]);
    }
  }

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function handleSubmit() {
    if (!uploadedFile || submitting || !!submission) return;
    setSubmitting(true);
    try {
      // 1. Get userId
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const api = require('../../api').default;
      
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Error", "You must be logged in to submit.");
        setSubmitting(false);
        return;
      }

      // 2. Save user profile changes first
      await api.patch(`/users/${userId}`, {
        name,
        studentId: studentIdStr,
        program,
        level,
      });

      // 3. Fetch courses to submit
      const coursesRes = await api.get('/courses?limit=5');
      const courseIds = coursesRes.data.data ? coursesRes.data.data.map((c: any) => c.id) : [];

      // 4. Prepare form data
      const formData = new FormData();
      formData.append('studentId', userId);
      formData.append('courseIds', JSON.stringify(courseIds));
      
      // We append a dummy file object for React Native Web / Mobile
      // If result was from DocumentPicker on web, `file` object exists, otherwise `uri`
      formData.append('file', {
        uri: uploadedFile.uri || '',
        name: uploadedFile.name || 'document.pdf',
        type: uploadedFile.mimeType || 'application/pdf',
      } as any);

      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowSuccessModal(true);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.response?.data?.message || "Failed to submit document to server");
    } finally {
      setSubmitting(false);
    }
  }

  const TABS: { id: SubTab; label: string; icon: React.ComponentProps<typeof Feather>["name"] }[] = [
    { id: "upload", label: "Upload", icon: "upload" },
    { id: "status", label: "Status", icon: "check-circle" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Registration</Text>
          <Text style={styles.headerSub}>{subTab === "upload" ? "Upload documents" : "Track status"}</Text>
        </View>
      </View>

      {/* Sub-tabs */}
      <View style={styles.subTabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSubTab(tab.id)}
            style={styles.subTab}
            activeOpacity={0.8}
          >
            <Feather name={tab.icon} size={15} color={subTab === tab.id ? Colors.deepBlue : Colors.gray400} />
            <Text style={[styles.subTabText, subTab === tab.id && styles.subTabTextActive]}>
              {tab.label}
            </Text>
            {subTab === tab.id && <View style={styles.subTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {subTab === "upload" ? (
        <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Info banner */}
          <View style={styles.infoBanner}>
            <Feather name="info" size={15} color="#1d4ed8" />
            <Text style={styles.infoText}>
              Download your Proof of Registration from the UG MISWeb portal and upload the PDF here for departmental clearance verification.
            </Text>
          </View>

          {/* Upload area */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Proof of Registration</Text>
              <Text style={styles.cardSub}>PDF format · Max 5MB</Text>
            </View>
            {!uploadedFile ? (
              <TouchableOpacity style={styles.dropZone} onPress={handlePick} activeOpacity={0.8}>
                <View style={styles.dropIcon}>
                  <Feather name="upload" size={24} color={Colors.deepBlue} />
                </View>
                <Text style={styles.dropTitle}>Tap to upload PDF</Text>
                <Text style={styles.dropSub}>Select from your files</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.fileRow}>
                <View style={styles.fileIcon}>
                  <Feather name="file-text" size={18} color={Colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>{uploadedFile.name}</Text>
                  <Text style={styles.fileMeta}>PDF · Just now</Text>
                </View>
                <TouchableOpacity onPress={() => setUploadedFile(null)}>
                  <Feather name="x" size={16} color={Colors.gray400} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Departmental Registration Form</Text>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Enter your full name" />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Student ID</Text>
              <TextInput style={styles.textInput} value={studentIdStr} onChangeText={setStudentIdStr} placeholder="e.g. 10897354" keyboardType="numeric" />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Programme</Text>
              <TouchableOpacity 
                style={[styles.textInput, { justifyContent: 'center' }]} 
                onPress={() => setShowProgramModal(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: program ? Colors.darkText : Colors.gray400, fontSize: 13 }}>
                  {program || "Select your programme"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Level</Text>
              <TouchableOpacity 
                style={[styles.textInput, { justifyContent: 'center' }]} 
                onPress={() => setShowLevelModal(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: level ? Colors.darkText : Colors.gray400, fontSize: 13 }}>
                  {level || "Select your level"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Academic Year</Text>
              <TextInput 
                style={[styles.textInput, { color: Colors.gray500, backgroundColor: '#f9fafb' }]} 
                value={academicYear} 
                editable={false}
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Semester</Text>
              <TouchableOpacity 
                style={[styles.textInput, { justifyContent: 'center' }]} 
                onPress={() => setShowSemesterModal(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: semester ? Colors.darkText : Colors.gray400, fontSize: 13 }}>
                  {semester || "Select semester"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!uploadedFile || submitting || !!submission}
            style={[styles.submitBtn, (!uploadedFile || submitting || !!submission) && styles.submitBtnDisabled]}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {!!submission ? "Already Submitted" : submitting ? "Submitting…" : "Submit for Verification"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
          {/* Status card */}
          <View style={[styles.statusCard, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
            <View style={[styles.statusIconWrap, { backgroundColor: Colors.white }]}>
              <Feather name={cfg.icon} size={32} color={cfg.iconColor} />
            </View>
            <View style={styles.statusTextBlock}>
              <Text style={[styles.statusHeadline, { color: cfg.textColor }]}>{cfg.headline}</Text>
              <Text style={styles.statusMessage}>{cfg.message}</Text>
            </View>
            <View style={styles.statusBadgeWrap}>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                <Feather name={cfg.icon} size={11} color={cfg.iconColor} />
                <Text style={[styles.statusBadgeText, { color: cfg.textColor }]}>{status}</Text>
              </View>
            </View>
          </View>

          {/* Submission details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Submission Details</Text>
            {submission ? [
              { label: "Reference No.", value: `DEP-2024-${submission.id.substring(0, 8).toUpperCase()}` },
              { label: "Submitted", value: new Date(submission.submittedAt).toLocaleString() },
              { label: "Courses", value: `${submission.courses?.length || 0} courses` },
              { label: "Document", value: submission.documentUrl ? submission.documentUrl.split('/').pop() : "No document" },
            ].map((d, i) => (
              <View key={i} style={[styles.detailRow, i > 0 && styles.detailRowBorder]}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            )) : (
              <Text style={{ color: Colors.gray500, fontSize: 13 }}>No submission found. Please upload your documents first.</Text>
            )}
          </View>

          {/* Timeline */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Progress Timeline</Text>
            {timeline.map((step, i) => (
              <View key={i} style={styles.timelineStep}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, step.done ? styles.timelineDotDone : styles.timelineDotPending]}>
                    {step.done && <Feather name="check" size={10} color={Colors.white} />}
                  </View>
                  {i < timeline.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: step.done ? Colors.deepBlue : "#e5e7eb" }]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, step.done ? styles.timelineLabelDone : styles.timelineLabelPending]}>
                    {step.label}
                  </Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Programme Selection Modal */}
      {showProgramModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Programme</Text>
            {programs.map((p) => (
              <TouchableOpacity 
                key={p} 
                style={styles.modalOption} 
                onPress={() => { setProgram(p); setShowProgramModal(false); }}
              >
                <Text style={styles.modalOptionText}>{p}</Text>
                {program === p && <Feather name="check" size={16} color={Colors.deepBlue} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowProgramModal(false)} style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ color: Colors.gray500, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Level Selection Modal */}
      {showLevelModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Level</Text>
            {levels.map((l) => (
              <TouchableOpacity 
                key={l} 
                style={styles.modalOption} 
                onPress={() => { setLevel(l); setShowLevelModal(false); }}
              >
                <Text style={styles.modalOptionText}>{l}</Text>
                {level === l && <Feather name="check" size={16} color={Colors.deepBlue} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowLevelModal(false)} style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ color: Colors.gray500, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Semester Selection Modal */}
      {showSemesterModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Semester</Text>
            {semesters.map((s) => (
              <TouchableOpacity 
                key={s} 
                style={styles.modalOption} 
                onPress={() => { setSemester(s); setShowSemesterModal(false); }}
              >
                <Text style={styles.modalOptionText}>{s}</Text>
                {semester === s && <Feather name="check" size={16} color={Colors.deepBlue} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowSemesterModal(false)} style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ color: Colors.gray500, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center', paddingVertical: 40 }]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#ecfdf5", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Feather name="check" size={32} color="#10b981" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "800", color: Colors.darkText, marginBottom: 8 }}>Submission Successful!</Text>
            <Text style={{ fontSize: 14, color: Colors.gray500, textAlign: "center", marginBottom: 32, paddingHorizontal: 16 }}>
              Your documents have been securely uploaded and are now pending verification.
            </Text>
            <TouchableOpacity 
              style={[styles.submitBtn, { width: '100%' }]} 
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate("Dues");
              }}
            >
              <Text style={styles.submitBtnText}>Proceed to Pay Dues</Text>
            </TouchableOpacity>
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
  subTabBar: { backgroundColor: Colors.white, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Colors.border, paddingHorizontal: 8 },
  subTab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, position: "relative" },
  subTabText: { fontSize: 13, fontWeight: "700", color: Colors.gray400 },
  subTabTextActive: { color: Colors.deepBlue },
  subTabIndicator: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.deepBlue },
  body: { flex: 1 },
  infoBanner: { backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#bfdbfe", borderRadius: 16, padding: 14, flexDirection: "row", gap: 10 },
  infoText: { flex: 1, color: "#1d4ed8", fontSize: 12, lineHeight: 18 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: Colors.borderLight },
  cardHeader: { gap: 2 },
  cardTitle: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
  cardSub: { color: Colors.gray400, fontSize: 11 },
  dropZone: { borderWidth: 2, borderStyle: "dashed", borderColor: Colors.border, borderRadius: 16, paddingVertical: 32, alignItems: "center", gap: 8 },
  dropIcon: { width: 48, height: 48, backgroundColor: Colors.lightGray, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  dropTitle: { color: Colors.deepBlue, fontSize: 14, fontWeight: "700" },
  dropSub: { color: Colors.gray400, fontSize: 12 },
  fileRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.lightGray, borderRadius: 12, padding: 12 },
  fileIcon: { width: 40, height: 40, backgroundColor: Colors.deepBlue, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  fileName: { color: Colors.darkText, fontSize: 13, fontWeight: "600" },
  fileMeta: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  formField: { gap: 4 },
  formLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" },
  textInput: { backgroundColor: Colors.lightGray, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: Colors.darkText, fontSize: 13, minHeight: 44 },
  submitBtn: { backgroundColor: Colors.accentGold, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },
  statusCard: { borderWidth: 1, borderRadius: 20, padding: 20, alignItems: "center", gap: 12 },
  statusIconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statusTextBlock: { alignItems: "center", gap: 6 },
  statusHeadline: { fontSize: 16, fontWeight: "800" },
  statusMessage: { color: Colors.gray500, fontSize: 12, textAlign: "center", lineHeight: 18 },
  statusBadgeWrap: {},
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  detailRowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  detailLabel: { color: Colors.gray400, fontSize: 11, fontWeight: "600" },
  detailValue: { color: Colors.darkText, fontSize: 11, fontWeight: "700", maxWidth: "60%", textAlign: "right" },
  timelineStep: { flexDirection: "row", gap: 12 },
  timelineLeft: { alignItems: "center", width: 24 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", zIndex: 1 },
  timelineDotDone: { backgroundColor: Colors.deepBlue },
  timelineDotPending: { backgroundColor: Colors.lightGray, borderWidth: 2, borderColor: "#e5e7eb" },
  timelineLine: { flex: 1, width: 2, minHeight: 20 },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineLabel: { fontSize: 12, fontWeight: "700" },
  timelineLabelDone: { color: Colors.darkText },
  timelineLabelPending: { color: Colors.gray400 },
  timelineTime: { color: Colors.gray400, fontSize: 10, marginTop: 2 },

  // Modal styles
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 999 },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.darkText, marginBottom: 8, textAlign: 'center' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalOptionText: { fontSize: 15, color: Colors.darkText },
});
