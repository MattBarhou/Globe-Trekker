import React from "react";
import {
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const clearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search countries..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
          editable={true}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity
            onPress={clearSearch}
            style={styles.iconContainer}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#999999" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name="search" size={20} color="#999999" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2a2a2a",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#ffffff",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  iconContainer: {
    padding: 5,
  },
});

export default SearchBar;
