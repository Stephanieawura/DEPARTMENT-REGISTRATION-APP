import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusBarBackground from "../../components/StatusBarBackground";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NOTIFICATIONS } from "../../data/sampleData";
import { Colors } from "../../constants/Colors";
import type { Notification } from "../../types";

const ICON_MAP: Record<string, React.ComponentProps<typeof Feather>["name"]> = {
  status: "file-text",
  sync: "refresh-cw",
  reminder: "bell",
  system: "info",
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS);
  const [alertVerification, setAlertVerification] = useState(true);
  const [alertSync, setAlertSync] = useState(true);
  const [alertDeadline, setAlertDeadline] = useState(false);

  const unread = items.filter((n) => !n.read).length;

  function markRead(id: number) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const today = items.filter((n) => n.time.startsWith("Today"));
  const yesterday = items.filter((n) => n.time.startsWith("Yesterday"));
  const older = items.filter((n) => !n.time.startsWith("Today") && !n.time.startsWith("Yesterday"));

  function NotifGroup({ label, group }: { label: string; group: Notification[] }) {
    if (!group.length) return null;
    return (
      <View style={{ gap: 6 }}>
        <Text style={styles.groupLabel}>{label}</Text>
        <View style={styles.card}>
          {group.map((n, i) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => markRead(n.id)}
              style={[styles.notifRow, i > 0 && styles.notifBorder, !n.read && styles.notifUnread]}
              activeOpacity={0.8}
            >
              <View style={[styles.notifIcon, { backgroundColor: n.read ? Colors.lightGray : "#eff6ff" }]}>
                <Feather name={ICON_MAP[n.type] ?? "bell"} size={15} color={n.read ? Colors.gray500 : Colors.deepBlue} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.notifTitleRow}>
                  <Text style={[styles.notifTitle, !n.read && styles.notifTitleUnread]} numberOfLines={1}>
                    {n.title}
                  </Text>
                  {!n.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody} numberOfLines={2}>{n.body}</Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <StatusBarBackground />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>{unread > 0 ? `${unread} unread` : "All caught up"}</Text>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Text style={styles.countText}>{items.length} notifications</Text>
          {unread > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Alert Preferences</Text>
          {[
            { label: "Verification updates", sub: "When your status changes", value: alertVerification, setter: setAlertVerification },
            { label: "Course sync alerts", sub: "MISWeb sync results", value: alertSync, setter: setAlertSync },
            { label: "Deadline reminders", sub: "Upload & submission deadlines", value: alertDeadline, setter: setAlertDeadline },
          ].map((pref, i) => (
            <View key={i} style={[styles.prefRow, i > 0 && styles.prefBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefLabel}>{pref.label}</Text>
                <Text style={styles.prefSub}>{pref.sub}</Text>
              </View>
              <Switch
                value={pref.value}
                onValueChange={pref.setter}
                trackColor={{ false: "#e5e7eb", true: Colors.deepBlue }}
                thumbColor={Colors.white}
              />
            </View>
          ))}
        </View>

        <NotifGroup label="Today" group={today} />
        <NotifGroup label="Yesterday" group={yesterday} />
        <NotifGroup label="Earlier" group={older} />
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
  actionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  countText: { color: Colors.gray400, fontSize: 12 },
  markAllText: { color: Colors.deepBlue, fontSize: 12, fontWeight: "700" },
  card: { backgroundColor: Colors.white, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: Colors.borderLight },
  sectionLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", padding: 16, paddingBottom: 8 },
  prefRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  prefBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  prefLabel: { color: Colors.darkText, fontSize: 13, fontWeight: "600" },
  prefSub: { color: Colors.gray400, fontSize: 11, marginTop: 2 },
  groupLabel: { color: Colors.gray400, fontSize: 10, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase" },
  notifRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14 },
  notifBorder: { borderTopWidth: 1, borderTopColor: "rgba(21,61,112,0.04)" },
  notifUnread: { backgroundColor: "rgba(239,246,255,0.6)" },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  notifTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  notifTitle: { color: Colors.darkText, fontSize: 13, fontWeight: "600", flex: 1 },
  notifTitleUnread: { fontWeight: "800" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentGold },
  notifBody: { color: Colors.gray400, fontSize: 11, lineHeight: 16 },
  notifTime: { color: "#d1d5db", fontSize: 10, fontWeight: "600" },
});
