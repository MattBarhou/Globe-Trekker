import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OPENWEATHER_API_KEY } from "@env";

export default function WeatherWidget({ capital, countryCode }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!capital) {
        setLoading(false);
        setError("No capital city data available");
        return;
      }

      if (!OPENWEATHER_API_KEY) {
        setLoading(false);
        setError("API key not configured");
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital},${countryCode}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [capital, countryCode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#ffffff" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.container}>
        <Ionicons name="cloud-offline-outline" size={24} color="#ff5252" />
        <Text style={styles.errorText}>
          {error || "Weather data unavailable"}
        </Text>
      </View>
    );
  }

  // Get the weather icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Weather in {capital}</Text>
      <View style={styles.weatherContainer}>
        <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
        <View style={styles.detailsContainer}>
          <Text style={styles.temperature}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
        </View>
      </View>
      <View style={styles.extraInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="water-outline" size={16} color="#9E9E9E" />
          <Text style={styles.infoText}>
            Humidity: {weather.main.humidity}%
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="speedometer-outline" size={16} color="#9E9E9E" />
          <Text style={styles.infoText}>
            Pressure: {weather.main.pressure} hPa
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="thermometer-outline" size={16} color="#9E9E9E" />
          <Text style={styles.infoText}>
            Min/Max: {Math.round(weather.main.temp_min)}°C /{" "}
            {Math.round(weather.main.temp_max)}°C
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="compass-outline" size={16} color="#9E9E9E" />
          <Text style={styles.infoText}>
            Wind: {Math.round(weather.wind.speed * 3.6)} km/h
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  detailsContainer: {
    marginLeft: 8,
  },
  temperature: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 16,
    color: "#CCCCCC",
    textTransform: "capitalize",
  },
  extraInfo: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingTop: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    color: "#BBBBBB",
    marginLeft: 8,
    fontSize: 14,
  },
  loadingText: {
    color: "#BBBBBB",
    marginTop: 8,
  },
  errorText: {
    color: "#ff5252",
    marginTop: 8,
  },
});
