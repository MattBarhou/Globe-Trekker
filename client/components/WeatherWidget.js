import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OPENWEATHER_API_KEY } from "@env";
import WeatherForecast from "./WeatherForecast";

export default function WeatherWidget({ capital, countryCode }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState("C"); // "C" for Celsius, "F" for Fahrenheit

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      if (!capital) {
        setLoading(false);
        setError("No capital city data available");
        return;
      }

      try {
        setLoading(true);

        // Fetch current weather
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital},${countryCode}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        // Fetch 5-day forecast using standard forecast API
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${capital},${countryCode}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeatherAndForecast();
  }, [capital, countryCode]);

  // Temperature conversion functions
  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  const formatTemp = (celsius) => {
    if (tempUnit === "C") return `${Math.round(celsius)}°C`;
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  };

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === "C" ? "F" : "C");
  };

  // Extract unique days from 5-day forecast (3-hour interval)
  const getUniqueDays = () => {
    if (!forecast || !forecast.list) return [];

    const uniqueDays = [];
    const dayMap = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });

      // Only include noon forecasts (closest to midday temperature)
      const hour = date.getHours();

      // If we don't have this day yet, or if this time is closer to noon
      if (
        !dayMap[day] ||
        Math.abs(hour - 12) < Math.abs(dayMap[day].hour - 12)
      ) {
        dayMap[day] = {
          data: item,
          hour: hour,
        };
      }
    });

    // Convert to array and sort by date
    Object.keys(dayMap).forEach((day) => {
      uniqueDays.push(dayMap[day].data);
    });

    // Sort by timestamp
    uniqueDays.sort((a, b) => a.dt - b.dt);

    return uniqueDays.slice(0, 5); // Limit to 5 days
  };

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

  // Get forecast days
  const forecastDays = getUniqueDays();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weather in {capital}</Text>
        <TouchableOpacity onPress={toggleTempUnit} style={styles.unitToggle}>
          <Text style={styles.unitToggleText}>
            {tempUnit === "C" ? "Switch to °F" : "Switch to °C"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Current weather */}
      <View style={styles.weatherContainer}>
        <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
        <View style={styles.detailsContainer}>
          <Text style={styles.temperature}>
            {formatTemp(weather.main.temp)}
          </Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
        </View>
      </View>

      {/* Current weather details */}
      <View style={styles.extraInfo}>
        <View style={styles.infoRow}>
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
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="thermometer-outline" size={16} color="#9E9E9E" />
            <Text style={styles.infoText}>
              Min/Max: {formatTemp(weather.main.temp_min)} /{" "}
              {formatTemp(weather.main.temp_max)}
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

      {/* 5-day forecast */}
      <WeatherForecast
        forecast={forecast}
        formatTemp={formatTemp}
        forecastDays={forecastDays}
      />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  unitToggle: {
    backgroundColor: "#333333",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unitToggleText: {
    color: "#BBBBBB",
    fontSize: 12,
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
