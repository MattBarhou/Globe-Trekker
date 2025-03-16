import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

const InteractiveCountryMap = ({ country }) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  // Get default region from country data
  const getRegion = () => {
    if (!country || !country.latlng || country.latlng.length < 2) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 50,
        longitudeDelta: 50,
      };
    }

    // Calculate appropriate zoom level based on country size
    let zoomLevel = 5;
    if (country.area) {
      if (country.area > 5000000) zoomLevel = 10; // Very large countries
      else if (country.area > 1000000) zoomLevel = 8; // Large countries
      else if (country.area > 500000) zoomLevel = 6; // Medium-large countries
      else if (country.area > 100000) zoomLevel = 4; // Medium countries
      else if (country.area > 20000) zoomLevel = 3; // Small-medium countries
      else zoomLevel = 2; // Small countries
    }

    return {
      latitude: country.latlng[0],
      longitude: country.latlng[1],
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    };
  };

  // Get capital coordinates if available
  const getCapitalCoordinates = () => {
    if (
      country &&
      country.capitalInfo &&
      country.capitalInfo.latlng &&
      country.capitalInfo.latlng.length === 2
    ) {
      return {
        latitude: country.capitalInfo.latlng[0],
        longitude: country.capitalInfo.latlng[1],
      };
    }
    return null;
  };

  // Set a timeout to detect if the map is taking too long to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapReady) {
        setTimeoutOccurred(true);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timer);
  }, [mapReady]);

  const region = getRegion();
  const capitalCoords = getCapitalCoordinates();

  // Handle map error
  const handleMapError = () => {
    setMapError(true);
  };

  // Get static map URL as fallback
  const getStaticMapUrl = () => {
    const zoom = country.area
      ? country.area > 1000000
        ? 3
        : country.area > 500000
        ? 4
        : country.area > 100000
        ? 5
        : country.area > 20000
        ? 6
        : 7
      : 5;

    return `https://staticmap.openstreetmap.de/staticmap.php?center=${region.latitude},${region.longitude}&zoom=${zoom}&size=600x400&maptype=mapnik&markers=${region.latitude},${region.longitude},red`;
  };

  // Open map in browser
  const openMapInBrowser = () => {
    const url = `https://www.openstreetmap.org/?mlat=${region.latitude}&mlon=${region.longitude}#map=5/${region.latitude}/${region.longitude}`;
    Linking.openURL(url);
  };

  // Open Google Maps if available
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`;
    Linking.openURL(url);
  };

  // Show fallback static map if there's an error or timeout
  if (mapError || timeoutOccurred) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Location</Text>

        <View style={styles.mapContainer}>
          <Image
            source={{ uri: getStaticMapUrl() }}
            style={styles.map}
            resizeMode="cover"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={openMapInBrowser}
            >
              <Ionicons name="map-outline" size={16} color="#ffffff" />
              <Text style={styles.buttonText}>OpenStreetMap</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
              <Ionicons name="location" size={16} color="#ffffff" />
              <Text style={styles.buttonText}>Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            Latitude: {region.latitude.toFixed(2)}°{" "}
            {region.latitude >= 0 ? "N" : "S"}
          </Text>
          <Text style={styles.coordinatesText}>
            Longitude: {region.longitude.toFixed(2)}°{" "}
            {region.longitude >= 0 ? "E" : "W"}
          </Text>
          {country.capital && country.capital.length > 0 && (
            <Text style={styles.capitalText}>
              Capital: {country.capital[0]}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>

      {!mapReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          onMapReady={() => setMapReady(true)}
          onError={handleMapError}
        >
          {/* Country marker */}
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title={country.name.common}
            description="Country location"
            pinColor="#FF5722"
          />

          {/* Capital marker if coordinates are available */}
          {capitalCoords && (
            <Marker
              coordinate={capitalCoords}
              title={country.capital ? country.capital[0] : "Capital"}
              description={`Capital of ${country.name.common}`}
              pinColor="#2196F3"
            />
          )}
        </MapView>
      </View>

      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          Latitude: {region.latitude.toFixed(2)}°{" "}
          {region.latitude >= 0 ? "N" : "S"}
        </Text>
        <Text style={styles.coordinatesText}>
          Longitude: {region.longitude.toFixed(2)}°{" "}
          {region.longitude >= 0 ? "E" : "W"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    padding: 15,
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    backgroundColor: "#3a3a3a",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "#3a3a3a",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
  },
  mapButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "#ffffff",
    marginLeft: 5,
    fontSize: 12,
  },
  coordinatesContainer: {
    padding: 15,
    backgroundColor: "#333333",
  },
  coordinatesText: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 5,
  },
  capitalText: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default InteractiveCountryMap;
