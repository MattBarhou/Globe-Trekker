import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// Import screens from their individual files
import OverviewScreen from "./countryDetails/OverviewScreen";
import GeographyScreen from "./countryDetails/GeographyScreen";
import CultureScreen from "./countryDetails/CultureScreen";
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
          headerTitle: `${country.name.common} - Overview`,
        }}
      />
      <Drawer.Screen
        name="Geography"
        component={GeographyScreen}
        initialParams={{ country }}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons name="map" size={24} color="#ffffff" />
          ),
          headerTitle: `${country.name.common} - Geography`,
        }}
      />
      <Drawer.Screen
        name="Culture"
        component={CultureScreen}
        initialParams={{ country }}
        options={{
          drawerIcon: ({ focused }) => (
            <Ionicons name="people" size={24} color="#ffffff" />
          ),
          headerTitle: `${country.name.common} - Culture`,
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
          headerTitle: `${country.name.common} - Economy`,
        }}
      />
    </Drawer.Navigator>
  );
}
