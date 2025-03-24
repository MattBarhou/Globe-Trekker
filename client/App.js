import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GluestackUIProvider, config } from "@gluestack-ui/themed";
import StartupScreen from "./screens/StartupScreen";
import HomeScreen from "./screens/HomeScreen";
import OverviewScreen from "./screens/countryDetails/OverviewScreen";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

// Custom transition configuration
const customTransitionConfig = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Startup"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#1a1a1a",
              },
              headerTintColor: "#ffffff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              // Add smooth transition animations
              animation: "fade_from_bottom",
              transitionSpec: {
                open: customTransitionConfig,
                close: customTransitionConfig,
              },
              gestureEnabled: true,
              gestureDirection: "horizontal",
              presentation: "card",
            }}
          >
            <Stack.Screen
              name="Startup"
              component={StartupScreen}
              options={{
                headerShown: false,
                // Special animation for the startup screen
                animation: "fade",
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="CountryDetails"
              component={OverviewScreen}
              options={({ route }) => ({
                title: route.params.country.name.common,
                headerStyle: {
                  backgroundColor: "#1a1a1a",
                },
                headerTintColor: "#ffffff",
                // Slide from right for details screen
                animation: "slide_from_right",
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
