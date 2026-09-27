import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import SubmissionsScreen from "../screens/admin/SubmissionsScreen";
import AdminStudentsScreen from "../screens/admin/AdminStudentsScreen";
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen";
import { Colors } from "../constants/Colors";

export type AdminTabParamList = {
  Dashboard: undefined;
  Submissions: undefined;
  Students: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const TAB_ICONS: Record<string, FeatherIconName> = {
  Dashboard: "home",
  Submissions: "file-text",
  Students: "users",
  Settings: "shield",
};

export default function AdminApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.deepBlue,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "700",
          marginTop: -2,
        },
        tabBarIcon: ({ color }) => (
          <Feather name={TAB_ICONS[route.name]} size={19} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Submissions" component={SubmissionsScreen} />
      <Tab.Screen name="Students" component={AdminStudentsScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
}
