import { useState, useEffect } from "react";
import { FlatList, ActivityIndicator, Animated } from "react-native";
import { Box, Heading, Text, Image, Card, Button } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
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
    // Create a small animation effect before navigation
    Animated.sequence([
      Animated.timing(new Animated.Value(1), {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(new Animated.Value(0.95), {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate with a slight delay for better visual effect
    setTimeout(() => {
      navigation.navigate("CountryDetails", { country });
    }, 150);
  };

  if (loading) {
    return (
      <Box flex={1} bg="#1a1a1a" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#ffffff" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} bg="#1a1a1a" justifyContent="center" alignItems="center">
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="#1a1a1a">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.cca3}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <Card
            flex={1}
            margin={8}
            backgroundColor="#2a2a2a"
            borderRadius={10}
            overflow="hidden"
            maxWidth="46%"
          >
            <Box height={120} width="100%" backgroundColor="#1a1a1a">
              <Image
                source={{ uri: item.flags.png }}
                alt={`${item.name.common} flag`}
                height="100%"
                width="100%"
                resizeMode="contain"
              />
            </Box>
            <Box padding={10} alignItems="center">
              <Heading size="sm" color="#ffffff" textAlign="center" mb={10}>
                {item.name.common}
              </Heading>
              <Button
                backgroundColor="#4a4a4a"
                borderRadius={20}
                paddingHorizontal={16}
                paddingVertical={8}
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                onPress={() => handleCountryPress(item)}
              >
                <Text color="#ffffff" marginRight={4}>
                  More Details
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </Button>
            </Box>
          </Card>
        )}
      />
    </Box>
  );
}
