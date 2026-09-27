import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import StudentApp from "./src/navigation/StudentApp";
import AdminApp from "./src/navigation/AdminApp";
import CourseDetailsScreen from "./src/screens/student/CourseDetailsScreen";
import NotificationsScreen from "./src/screens/student/NotificationsScreen";
import PrivacyScreen from "./src/screens/student/PrivacyScreen";
import HelpScreen from "./src/screens/student/HelpScreen";
import type { Course } from "./src/types";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  StudentApp: undefined;
  AdminApp: undefined;
  CourseDetails: { course: Course; isRegistered?: boolean };
  Notifications: undefined;
  Privacy: undefined;
  HelpSupport: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="StudentApp" component={StudentApp} />
          <Stack.Screen name="AdminApp" component={AdminApp} />
          <Stack.Screen
            name="CourseDetails"
            component={CourseDetailsScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="Privacy"
            component={PrivacyScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="HelpSupport"
            component={HelpScreen}
            options={{ animation: "slide_from_bottom" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
