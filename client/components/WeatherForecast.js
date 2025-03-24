import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";

export default function WeatherForecast({
  forecast,
  formatTemp,
  forecastDays,
}) {
  if (!forecast || !forecast.list || forecastDays.length === 0) {
    return null;
  }

  return (
    <View style={styles.forecastContainer}>
      <Text style={styles.forecastTitle}>5-Day Forecast</Text>
      <FlatList
        data={forecastDays}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={({ item }) => (
          <View style={styles.forecastDay}>
            <Text style={styles.forecastDayText}>
              {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
              }}
              style={styles.forecastIcon}
            />
            <Text style={styles.forecastTemp}>
              {formatTemp(item.main.temp)}
            </Text>
            <Text style={styles.forecastDescription}>
              {item.weather[0].main}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  forecastContainer: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    paddingTop: 12,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  forecastDay: {
    alignItems: "center",
    marginRight: 16,
    width: 64,
  },
  forecastDayText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 4,
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
  forecastTemp: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  forecastDescription: {
    color: "#BBBBBB",
    fontSize: 12,
    textAlign: "center",
  },
});
