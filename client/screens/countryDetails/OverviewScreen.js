import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@gluestack-ui/themed";
import InteractiveCountryMap from "../../components/InteractiveCountryMap";

export default function OverviewScreen({ route }) {
  const { country } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(country);

  // Fetch additional country details when component mounts
  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${country.cca3}`
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        setDetails(data[0] || country);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching country details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [country.cca3]);

  // Format population with commas
  const formatPopulation = (population) => {
    if (!population) return "Not available";
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format area with commas and km²
  const formatArea = (area) => {
    if (!area) return "Not available";
    return `${area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km²`;
  };

  // Get capital(s)
  const getCapitals = (capitals) => {
    if (!capitals || capitals.length === 0) return "Not available";
    return Array.isArray(capitals) ? capitals.join(", ") : capitals;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading country details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading details: {error}</Text>
        <Text style={styles.errorSubText}>Showing limited information</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: details.flags.png }}
          style={styles.flag}
          resizeMode="contain"
        />
        <View style={styles.nameContainer}>
          <Text style={styles.countryName}>{details.name.common}</Text>
          <Text style={styles.officialName}>{details.name.official || ""}</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <InteractiveCountryMap country={details} />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>General Information</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="people" size={24} color="#ffffff" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Population</Text>
            <Text style={styles.infoValue}>
              {formatPopulation(details.population)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="business" size={24} color="#ffffff" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Capital</Text>
            <Text style={styles.infoValue}>{getCapitals(details.capital)}</Text>
          </View>
        </View>

        {details.region && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="globe" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Region</Text>
              <Text style={styles.infoValue}>
                {details.region}
                {details.subregion ? `, ${details.subregion}` : ""}
              </Text>
            </View>
          </View>
        )}

        {details.currencies && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="cash" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Currency</Text>
              <Text style={styles.infoValue}>
                {Object.values(details.currencies || {})
                  .map(
                    (currency) => `${currency.name} (${currency.symbol || ""})`
                  )
                  .join(", ") || "Not available"}
              </Text>
            </View>
          </View>
        )}

        {details.languages && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="chatbubbles" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Languages</Text>
              <Text style={styles.infoValue}>
                {Object.values(details.languages || {}).join(", ") ||
                  "Not available"}
              </Text>
            </View>
          </View>
        )}

        {details.idd && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="call" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Calling Code</Text>
              <Text style={styles.infoValue}>
                +{details.idd?.root || ""}
                {details.idd?.suffixes?.[0] || ""}
              </Text>
            </View>
          </View>
        )}

        {details.area && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="resize" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Area</Text>
              <Text style={styles.infoValue}>{formatArea(details.area)}</Text>
            </View>
          </View>
        )}

        {details.timezones && details.timezones.length > 0 && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="time" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Timezone</Text>
              <Text style={styles.infoValue}>
                {details.timezones[0] || "Not available"}
              </Text>
            </View>
          </View>
        )}

        {details.car && details.car.side && (
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="car" size={24} color="#ffffff" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Driving Side</Text>
              <Text style={styles.infoValue}>
                {details.car.side === "right" ? "Right" : "Left"}
              </Text>
            </View>
          </View>
        )}

        {details.maps && details.maps.googleMaps && (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => Linking.openURL(details.maps.googleMaps)}
          >
            <Ionicons name="map" size={20} color="#ffffff" />
            <Text style={styles.mapButtonText}>View on Google Maps</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Government</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="person" size={24} color="#ffffff" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>
              {details.independent ? "Independent" : "Dependent"}
              {details.unMember ? " (UN Member)" : ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Data provided by REST Countries API
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubText: {
    color: "#cccccc",
    fontSize: 14,
    textAlign: "center",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  flag: {
    width: 80,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  nameContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  officialName: {
    fontSize: 14,
    color: "#aaaaaa",
    fontStyle: "italic",
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#aaaaaa",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#ffffff",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a3a3a",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  mapButtonText: {
    color: "#ffffff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666666",
    fontSize: 12,
  },
  mapContainer: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
  },
});
