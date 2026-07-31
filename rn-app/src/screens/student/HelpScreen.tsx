import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FAQS } from "../../data/sampleData";
import { Colors } from "../../constants/Colors";

export default function HelpScreen() {
  const navigation = useNavigation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Help &amp; Support</Text>
          <Text style={styles.headerSub}>{"We're here to help"}</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Contact buttons */}
        <View style={styles.contactGrid}>
          {[
            { icon: "mail" as const, label: "Email Us", sub: "cs@ug.edu.gh", onPress: () => Linking.openURL("mailto:cs@ug.edu.gh") },
            { icon: "phone" as const, label: "Call Us", sub: "+233 30 213 ···", onPress: () => {} },
            { icon: "message-square" as const, label: "Live Chat", sub: "Office hours", onPress: () => {} },
          ].map((c) => (
            <TouchableOpacity key={c.label} style={styles.contactCard} onPress={c.onPress} activeOpacity={0.8}>
              <View style={styles.contactIcon}>
                <Feather name={c.icon} size={18} color={Colors.deepBlue} />
              </View>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactSub}>{c.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => (
            <View key={i} style={i > 0 ? styles.faqBorder : undefined}>
              <TouchableOpacity
                onPress={() => setOpenFaq(openFaq === i ? null : i)}
                style={styles.faqRow}
                activeOpacity={0.8}
              >
                <View style={styles.faqNum}>
                  <Text style={styles.faqNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Feather
                  name={openFaq === i ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={Colors.gray400}
                />
              </TouchableOpacity>
              {openFaq === i && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Send message */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Send a Message</Text>
          {sent ? (
            <View style={styles.sentBanner}>
              <Feather name="check-circle" size={20} color="#059669" />
              <View>
                <Text style={styles.sentTitle}>Message sent!</Text>
                <Text style={styles.sentSub}>{"We'll get back to you within 24 hours."}</Text>
              </View>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.textarea}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your issue or question…"
                placeholderTextColor={Colors.gray400}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!message.trim()}
                activeOpacity={0.85}
              >
                <Text style={styles.sendBtnText}>Send Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* App info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>App Information</Text>
          {[
            { label: "App Version", value: "v1.0.0" },
            { label: "Platform", value: "React Native · iOS & Android" },
            { label: "Institution", value: "University of Ghana" },
            { label: "Department", value: "Computer Science" },
          ].map((d, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{d.label}</Text>
              <Text style={styles.infoValue}>{d.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.deepBlue, paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: Colors.white, fontSize: 16, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  body: { flex: 1 },
  contactGrid: { flexDirection: "row", gap: 10 },
  contactCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 20, padding: 14, alignItems: "center", gap: 6, borderWidth: 1, borderColor: Colors.borderLight },
  contactIcon: { width: 40, height: 40, backgroundColor: Colors.lightGray, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  contactLabel: { color: Colors.darkText, fontSize: 12, fontWeight: "700" },
  contactSub: { color: Colors.gray400, fontSize: 10, textAlign: "center" },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 8, borderWidth: 1, borderColor: Colors.borderLight },
  sectionLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 },
  faqBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  faqRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 12 },
  faqNum: { width: 20, height: 20, backgroundColor: "#eff6ff", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  faqNumText: { color: Colors.deepBlue, fontSize: 10, fontWeight: "800" },
  faqQ: { flex: 1, color: Colors.darkText, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  faqAnswer: { paddingLeft: 30, paddingBottom: 12 },
  faqAnswerText: { color: Colors.gray500, fontSize: 12, lineHeight: 18 },
  textarea: { backgroundColor: Colors.lightGray, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: Colors.darkText, minHeight: 96 },
  sendBtn: { backgroundColor: Colors.accentGold, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: Colors.white, fontSize: 13, fontWeight: "700" },
  sentBanner: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#a7f3d0", borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  sentTitle: { color: "#065f46", fontSize: 14, fontWeight: "700" },
  sentSub: { color: Colors.gray500, fontSize: 11, marginTop: 2 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  infoRowBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  infoLabel: { color: Colors.gray400, fontSize: 12 },
  infoValue: { color: Colors.darkText, fontSize: 12, fontWeight: "700" },
});
