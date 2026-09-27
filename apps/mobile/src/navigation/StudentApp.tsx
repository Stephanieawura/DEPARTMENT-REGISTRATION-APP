import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import HomeScreen from "../screens/student/HomeScreen";
import CoursesScreen from "../screens/student/CoursesScreen";
import RegistrationScreen from "../screens/student/RegistrationScreen";
import ProfileScreen from "../screens/student/ProfileScreen";
import { Colors } from "../constants/Colors";

export type StudentTabParamList = {
  Home: undefined;
  Courses: undefined;
  Registration: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<StudentTabParamList>();

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const TAB_ICONS: Record<string, FeatherIconName> = {
  Home: "home",
  Courses: "book-open",
  Registration: "clipboard",
  Profile: "user",
};

export default function StudentApp() {
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
          fontSize: 10,
          fontWeight: "700",
          marginTop: -2,
        },
        tabBarIcon: ({ color }) => (
          <Feather
            name={TAB_ICONS[route.name]}
            size={20}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Registration" component={RegistrationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
