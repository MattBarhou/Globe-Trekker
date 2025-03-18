import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import OverviewScreen from "./countryDetails/OverviewScreen";
import EconomyScreen from "./countryDetails/EconomyScreen";

// Create drawer navigator
const Drawer = createDrawerNavigator();

// Main Country Details Screen with Drawer Navigator
export default function CountryDetailsScreen({ route }) {
  const { country } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Overview"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#2a2a2a",
          width: 240,
        },
        drawerLabelStyle: {
          color: "#ffffff",
        },
        drawerActiveTintColor: "#ffffff",
        drawerInactiveTintColor: "#ffffff",
        drawerActiveBackgroundColor: "#4a4a4a",
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        sceneContainerStyle: {
          backgroundColor: "#1a1a1a",
        },
      }}
    >
      <Drawer.Screen
        name="Overview"
        component={OverviewScreen}
        initialParams={{ country }}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons name="information-circle" size={24} color="#ffffff" />
          ),
          headerTitle: "Overview",
        }}
      />
      <Drawer.Screen
        name="Economy"
        component={EconomyScreen}
        initialParams={{ country }}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons name="cash" size={24} color="#ffffff" />
          ),
          headerTitle: "Economy",
        }}
      />
    </Drawer.Navigator>
  );
}
