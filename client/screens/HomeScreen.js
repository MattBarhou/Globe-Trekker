import { useState, useEffect } from "react";
import {
  FlatList,
  ActivityIndicator,
  Animated,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "../components/SearchBar";

export default function HomeScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3,independent,status"
        );
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        const data = await response.json();

        const officialCountries = data.filter(
          (country) =>
            country.independent === true &&
            country.status === "officially-assigned"
        );

        const sortedCountries = officialCountries.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );

        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  const handleCountryPress = (country) => {
    // Keep just the navigation with a slight delay for better UX
    setTimeout(() => {
      navigation.navigate("CountryDetails", { country });
    }, 50);
  };

  const renderCountryCard = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => handleCountryPress(item)}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"]}
            style={styles.cardGradient}
          >
            <Text style={styles.countryName}>{item.name.common}</Text>
          </LinearGradient>

          <Image
            source={{ uri: item.flags.png }}
            style={styles.flagImage}
            resizeMode="cover"
          />

          <View style={styles.cardOverlay}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handleCountryPress(item)}
            >
              <Text style={styles.buttonText}>Explore</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.cca3}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderCountryCard}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff5252",
    fontSize: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#9e9e9e",
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    height: 200,
  },
  card: {
    height: 200,
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 2,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  countryName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  flagImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: "#ffffff",
    marginRight: 4,
    fontSize: 14,
    fontWeight: "500",
  },
});
