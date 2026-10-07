import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import { Colors } from "../../constants/Colors";

type Step = 1 | 2 | 3 | 4 | 5;

export default function DuesScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<Step>(1);

  // Form State
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [contact, setContact] = useState("");
  const [level, setLevel] = useState("");
  const [residency, setResidency] = useState<"Resident" | "Non-resident">("Resident");
  const [hall, setHall] = useState("");
  const [showHallModal, setShowHallModal] = useState(false);
  const halls = [
    "Akuafo Hall", "Commonwealth Hall", "Legon Hall", 
    "Mensah Sarbah Hall", "Volta Hall", "Jubilee Hall", 
    "International Students Hostel (ISH)", "Alexander Adum Kwapong Hall", 
    "Hilla Limann Hall", "Elizabeth Frances Sey Hall", "Jean Nelson Aka Hall", 
    "Bani Hostel", "Evandy Hostel", "TF Hostel", "Pentagon Hostel", "Other"
  ];

  React.useEffect(() => {
    async function loadData() {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const res = await api.get(`/users/${userId}`);
          if (res.data) {
            setName(res.data.name || "");
            setStudentId(res.data.studentId || "");
            setLevel(res.data.level || "");
          }
        }
      } catch (e) {
        console.error("Failed to fetch user data in dues:", e);
      }
    }
    loadData();
  }, []);

  // Payment State
  const [method, setMethod] = useState<"MOMO" | "BANK">("MOMO");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);

  const reference = "UGCS-DUES-2026-MAMNQR";
  const amount = "GH₵ 100.00";

  const [submitting, setSubmitting] = useState(false);

  const renderStepper = () => {
    const steps = [
      { id: 1, label: "Details" },
      { id: 2, label: "Invoice" },
      { id: 3, label: "Payment" },
      { id: 4, label: "Confirmation" },
    ];
    return (
      <View style={styles.stepperContainer}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, step >= s.id ? styles.stepCircleActive : styles.stepCircleInactive]}>
                {step > s.id ? (
                  <Feather name="check" size={12} color={Colors.deepBlue} />
                ) : (
                  <Text style={[styles.stepText, step >= s.id ? styles.stepTextActive : styles.stepTextInactive]}>{s.id}</Text>
                )}
              </View>
              <Text style={styles.stepLabel}>{s.label}</Text>
            </View>
            {i < steps.length - 1 && (
              <View style={[styles.stepLine, step > s.id ? styles.stepLineActive : styles.stepLineInactive]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Student details</Text>
      <Text style={styles.cardSub}>These details appear on your invoice</Text>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>FULL NAME *</Text>
        <TextInput 
          style={[styles.textInput, { color: Colors.gray500, backgroundColor: '#f9fafb' }]} 
          value={name} 
          editable={false} 
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.formLabel}>STUDENT ID *</Text>
        <TextInput 
          style={[styles.textInput, { color: Colors.gray500, backgroundColor: '#f9fafb' }]} 
          value={studentId} 
          editable={false} 
        />
      </View>
      <View style={styles.formField}>
        <Text style={styles.formLabel}>CONTACT NUMBER *</Text>
        <TextInput style={styles.textInput} value={contact} onChangeText={setContact} />
      </View>
      <View style={styles.formField}>
        <Text style={styles.formLabel}>LEVEL *</Text>
        <TextInput 
          style={[styles.textInput, { color: Colors.gray500, backgroundColor: '#f9fafb' }]} 
          value={level} 
          editable={false} 
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.formLabel}>RESIDENCY *</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity 
            style={[styles.toggleBtn, residency === "Resident" && styles.toggleBtnActive]}
            onPress={() => setResidency("Resident")}
          >
            <Text style={[styles.toggleBtnText, residency === "Resident" && styles.toggleBtnTextActive]}>Resident</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, residency === "Non-resident" && styles.toggleBtnActive]}
            onPress={() => setResidency("Non-resident")}
          >
            <Text style={[styles.toggleBtnText, residency === "Non-resident" && styles.toggleBtnTextActive]}>Non-resident</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.formLabel}>HALL *</Text>
        <TouchableOpacity 
          style={[styles.textInput, { justifyContent: 'center' }]} 
          onPress={() => setShowHallModal(true)}
          activeOpacity={0.8}
        >
          <Text style={{ color: hall ? Colors.darkText : Colors.gray400, fontSize: 13 }}>
            {hall || "Select your hall/hostel"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={() => setStep(2)}>
        <Text style={styles.submitBtnText}>Pay <Feather name="chevron-right" size={14} /></Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.card}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceIconWrap}>
          <Feather name="file-text" size={24} color={Colors.accentGold} />
        </View>
        <Text style={styles.invoiceUni}>UNIVERSITY OF GHANA</Text>
        <Text style={styles.invoiceTitle}>Departmental Dues Invoice</Text>
      </View>

      <View style={styles.referenceBox}>
        <Text style={styles.referenceLabel}>INVOICE REFERENCE</Text>
        <View style={styles.referenceRow}>
          <Text style={styles.referenceCode}>{reference}</Text>
          <Feather name="copy" size={16} color={Colors.deepBlue} />
        </View>
        <Text style={styles.referenceSub}>Use this reference for every payment.</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Billed to</Text>
        <Text style={styles.detailValue}>{name}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Student ID</Text>
        <Text style={styles.detailValue}>{studentId}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Academic level</Text>
        <Text style={styles.detailValue}>{level}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Description</Text>
        <Text style={styles.detailValue}>2024 Departmental Dues</Text>
      </View>

      <View style={styles.amountDivider} />
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>AMOUNT DUE</Text>
        <Text style={styles.amountValue}>{amount}</Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={() => setStep(3)}>
        <Text style={styles.submitBtnText}>Proceed to payment <Feather name="chevron-right" size={14} /></Text>
      </TouchableOpacity>
    </View>
  );

  async function handleInitiatePayment() {
    setSubmitting(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Error", "You must be logged in to pay dues.");
        setSubmitting(false);
        return;
      }

      await api.post("/payments/initialize", {
        studentId: userId,
        reference,
        amount,
        contactNumber: contact,
        residency,
        hall,
        method
      });

      // Show mock PSP modal
      setShowPinModal(true);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", e.response?.data?.message || "Failed to initialize payment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAuthorizePayment() {
    setShowPinModal(false);
    setSubmitting(true);
    try {
      // Simulate PSP webhook success
      await api.post("/payments/webhook", {
        reference,
        status: 'success'
      });
      setStep(4);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Error", "Payment verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  const renderStep3 = () => (
    <View style={{ gap: 16 }}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choose payment method</Text>
        <Text style={styles.cardSub}>Secure payment gateway</Text>

        <TouchableOpacity style={[styles.methodCard, method === "MOMO" && styles.methodCardActive]} onPress={() => setMethod("MOMO")}>
          <View style={styles.methodIcon}><Feather name="smartphone" size={20} color={Colors.white} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>Mobile Money</Text>
            <Text style={styles.methodSub}>MTN, Telecel or AT Money</Text>
          </View>
          {method === "MOMO" && <Feather name="check-circle" size={20} color={Colors.accentGold} />}
        </TouchableOpacity>

        {method === "MOMO" && (
          <View style={[styles.formField, { marginTop: 8 }]}>
            <Text style={styles.formLabel}>MOBILE NUMBER *</Text>
            <TextInput 
              style={styles.textInput} 
              value={mobileNumber} 
              onChangeText={setMobileNumber} 
              placeholder="e.g. 0241234567" 
              keyboardType="phone-pad"
            />
          </View>
        )}

        <TouchableOpacity style={[styles.methodCard, method === "BANK" && styles.methodCardActive]} onPress={() => setMethod("BANK")}>
          <View style={[styles.methodIcon, { backgroundColor: Colors.deepBlue }]}><Feather name="briefcase" size={20} color={Colors.white} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>Bank Transfer</Text>
            <Text style={styles.methodSub}>Pay with any card</Text>
          </View>
          {method === "BANK" && <Feather name="check-circle" size={20} color={Colors.accentGold} />}
        </TouchableOpacity>
      </View>

      <View style={styles.payableCard}>
        <Text style={styles.payableLabel}>PAYABLE NOW</Text>
        <Text style={styles.payableAmount}>{amount}</Text>
        <Text style={styles.payableRef}>Reference: {reference}</Text>
        <TouchableOpacity 
          style={styles.gatewayBtn}
          onPress={handleInitiatePayment}
          disabled={submitting}
        >
          <Feather name="credit-card" size={16} color={Colors.white} />
          <Text style={styles.gatewayBtnText}>{submitting ? "Connecting..." : "Continue to payment gateway"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.card}>
      <View style={styles.successHeader}>
        <View style={[styles.successIconWrap, { backgroundColor: "#ecfdf5" }]}>
          <Feather name="check-circle" size={32} color={Colors.emerald} />
        </View>
        <Text style={styles.successTitle}>Payment Successful</Text>
        <Text style={styles.successSub}>Your payment was processed securely. You are now fully cleared!</Text>
        <View style={[styles.pendingBadge, { borderColor: "#a7f3d0", backgroundColor: "#ecfdf5" }]}>
          <Feather name="check" size={12} color={Colors.emerald} />
          <Text style={[styles.pendingBadgeText, { color: Colors.emerald }]}>Approved</Text>
        </View>
      </View>

      <View style={styles.detailRow}><Text style={styles.detailLabel}>Invoice reference</Text><Text style={styles.detailValue}>{reference}</Text></View>
      <View style={styles.detailRow}><Text style={styles.detailLabel}>Payment Method</Text><Text style={styles.detailValue}>{method === "MOMO" ? "Mobile Money" : "Card"}</Text></View>
      <View style={styles.detailRow}><Text style={styles.detailLabel}>Status</Text><Text style={[styles.detailValue, { color: Colors.emerald }]}>PAID</Text></View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate("StudentApp", { screen: "Home" })}>
        <Text style={styles.homeBtnText}>Return home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep((s) => (s - 1) as Step) : navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Pay Departmental Dues</Text>
          <Text style={styles.headerSub}>Invoice and payment verification</Text>
        </View>
      </View>

      {renderStepper()}

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      {/* Mock Paystack PIN Modal */}
      {showPinModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Feather name="lock" size={20} color="#059669" />
              <Text style={styles.modalTitle}>Secure Checkout</Text>
            </View>
            <Text style={styles.modalSub}>Enter your Mobile Money PIN to authorize {amount}</Text>
            <TextInput 
              style={[styles.textInput, { textAlign: 'center', fontSize: 24, letterSpacing: 8, marginTop: 16 }]} 
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
              autoFocus
            />
            <TouchableOpacity 
              style={[styles.submitBtn, { width: '100%', marginTop: 24 }]} 
              onPress={handleAuthorizePayment}
            >
              <Text style={styles.submitBtnText}>Authorize Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPinModal(false)} style={{ marginTop: 16 }}>
              <Text style={{ color: Colors.gray500, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hall Selection Modal */}
      {showHallModal && (
        <View style={styles.hallModalOverlay}>
          <View style={styles.hallModalContent}>
            <Text style={styles.hallModalTitle}>Select Hall / Hostel</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {halls.map((h) => (
                <TouchableOpacity 
                  key={h} 
                  style={styles.modalOption} 
                  onPress={() => { setHall(h); setShowHallModal(false); }}
                >
                  <Text style={styles.modalOptionText}>{h}</Text>
                  {hall === h && <Feather name="check" size={16} color={Colors.deepBlue} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setShowHallModal(false)} style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ color: Colors.gray500, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.deepBlue },
  header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 },
  
  stepperContainer: { flexDirection: "row", paddingHorizontal: 24, paddingBottom: 20, alignItems: "center", justifyContent: "space-between" },
  stepItem: { alignItems: "center", gap: 6, width: 44 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", zIndex: 2 },
  stepCircleActive: { backgroundColor: Colors.accentGold },
  stepCircleInactive: { backgroundColor: "rgba(255,255,255,0.1)" },
  stepText: { fontSize: 10, fontWeight: "700" },
  stepTextActive: { color: Colors.deepBlue },
  stepTextInactive: { color: "rgba(255,255,255,0.4)" },
  stepLabel: { fontSize: 9, color: "rgba(255,255,255,0.6)", position: "absolute", top: 28 },
  stepLine: { flex: 1, height: 2, marginHorizontal: -8 },
  stepLineActive: { backgroundColor: Colors.accentGold },
  stepLineInactive: { backgroundColor: "rgba(255,255,255,0.1)" },

  body: { flex: 1, backgroundColor: Colors.lightGray, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, gap: 16, borderWidth: 1, borderColor: Colors.borderLight },
  cardTitle: { color: Colors.darkText, fontSize: 16, fontWeight: "700" },
  cardSub: { color: Colors.gray400, fontSize: 12, marginTop: -12 },
  
  formField: { gap: 6 },
  formLabel: { color: Colors.deepBlue, fontSize: 10, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  textInput: { backgroundColor: Colors.lightGray, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: Colors.darkText, fontSize: 14, fontWeight: "500" },
  
  toggleRow: { flexDirection: "row", gap: 12 },
  toggleBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderRadius: 12, backgroundColor: Colors.lightGray, borderWidth: 1, borderColor: Colors.borderLight },
  toggleBtnActive: { backgroundColor: "#fffbeb", borderColor: Colors.accentGold },
  toggleBtnText: { color: Colors.gray500, fontWeight: "600", fontSize: 13 },
  toggleBtnTextActive: { color: Colors.accentGold, fontWeight: "700" },

  submitBtn: { backgroundColor: Colors.accentGold, borderRadius: 16, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 8 },
  submitBtnText: { color: Colors.white, fontSize: 15, fontWeight: "700" },

  // Step 2
  invoiceHeader: { alignItems: "center", gap: 8, marginBottom: 8 },
  invoiceIconWrap: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: Colors.accentGold, alignItems: "center", justifyContent: "center" },
  invoiceUni: { color: Colors.accentGold, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase" },
  invoiceTitle: { color: Colors.darkText, fontSize: 18, fontWeight: "800" },
  
  referenceBox: { backgroundColor: "#fffbeb", borderColor: "#fde68a", borderWidth: 1, borderRadius: 16, padding: 16, gap: 6 },
  referenceLabel: { color: "#d97706", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  referenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  referenceCode: { color: Colors.deepBlue, fontSize: 16, fontWeight: "800" },
  referenceSub: { color: "#d97706", fontSize: 11 },

  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  detailLabel: { color: Colors.gray400, fontSize: 13 },
  detailValue: { color: Colors.darkText, fontSize: 13, fontWeight: "700" },
  
  amountDivider: { height: 2, backgroundColor: Colors.darkText, marginVertical: 8 },
  amountRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  amountLabel: { color: Colors.deepBlue, fontSize: 14, fontWeight: "800", letterSpacing: 1 },
  amountValue: { color: Colors.deepBlue, fontSize: 24, fontWeight: "800" },

  // Step 3
  methodCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLight, backgroundColor: Colors.white },
  methodCardActive: { borderColor: Colors.accentGold, backgroundColor: "#fffbeb" },
  methodIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#d97706", alignItems: "center", justifyContent: "center" },
  methodTitle: { color: Colors.darkText, fontSize: 14, fontWeight: "700" },
  methodSub: { color: Colors.gray400, fontSize: 11 },

  payableCard: { backgroundColor: Colors.deepBlue, borderRadius: 20, padding: 20, gap: 8 },
  payableLabel: { color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  payableAmount: { color: Colors.white, fontSize: 28, fontWeight: "800" },
  payableRef: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  gatewayBtn: { backgroundColor: Colors.accentGold, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 },
  gatewayBtnText: { color: Colors.white, fontSize: 14, fontWeight: "700" },

  // Step 4
  dropZone: { borderWidth: 2, borderStyle: "dashed", borderColor: Colors.border, borderRadius: 16, paddingVertical: 32, alignItems: "center", gap: 8 },
  dropIcon: { width: 48, height: 48, backgroundColor: Colors.lightGray, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  dropTitle: { color: Colors.deepBlue, fontSize: 14, fontWeight: "700" },
  dropSub: { color: Colors.gray400, fontSize: 12 },
  fileRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.lightGray, borderRadius: 12, padding: 12 },
  fileIcon: { width: 40, height: 40, backgroundColor: Colors.deepBlue, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  fileName: { color: Colors.darkText, fontSize: 13, fontWeight: "600" },

  // Step 5
  successHeader: { alignItems: "center", gap: 8, marginBottom: 16, paddingTop: 16 },
  successIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#fffbeb", alignItems: "center", justifyContent: "center" },
  successTitle: { color: Colors.deepBlue, fontSize: 20, fontWeight: "800" },
  successSub: { color: Colors.gray500, fontSize: 13, textAlign: "center", paddingHorizontal: 20 },
  pendingBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fffbeb", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#fde68a", marginTop: 8 },
  pendingBadgeText: { color: "#d97706", fontSize: 12, fontWeight: "700" },

  // Modals
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24, zIndex: 999 },
  modalContent: { backgroundColor: Colors.white, borderRadius: 24, padding: 24, alignItems: 'center' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: "#059669" },
  modalSub: { color: Colors.gray500, textAlign: 'center', fontSize: 13, paddingHorizontal: 10 },
  
  // Bottom Modal styles for Hall
  hallModalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 999 },
  hallModalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  hallModalTitle: { fontSize: 16, fontWeight: '700', color: Colors.darkText, marginBottom: 16, textAlign: 'center' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalOptionText: { fontSize: 15, color: Colors.darkText },
});
