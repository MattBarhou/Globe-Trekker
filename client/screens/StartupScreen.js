import React, { useRef, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { Box, Text, Heading, Image, Button } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function StartupScreen({ navigation }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in and scale up the logo and title
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Then animate the button
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleExplore = () => {
    // Animate out before navigation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate after animation completes
      navigation.navigate("Home");
    });
  };

  return (
    <LinearGradient
      colors={["#1a1a1a", "#2a2a2a", "#1a1a1a"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons
            name="globe-outline"
            size={120}
            color="#ffffff"
            style={styles.logoIcon}
          />
        </View>

        <Heading size="2xl" style={styles.title}>
          Globe Trekker
        </Heading>

        <Text style={styles.subtitle}>
          Discover the world, one country at a time
        </Text>

        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleExplore}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#4a4a4a", "#3a3a3a"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Explore!</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#ffffff"
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
        © 2024 Globe Trekker
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#3a3a3a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logoIcon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "#cccccc",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
    maxWidth: "80%",
  },
  button: {
    width: 180,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    color: "#888888",
    fontSize: 14,
  },
});
