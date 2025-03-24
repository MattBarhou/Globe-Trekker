import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EXCHANGE_RATE_API_KEY } from "@env";

const CurrencyConverter = ({ details }) => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  // Set the initial "to" currency based on country details
  useEffect(() => {
    if (details && details.currencies) {
      // Get the first currency code from the country
      const countryCurrency = Object.keys(details.currencies)[0];
      if (countryCurrency) {
        setToCurrency(countryCurrency);
      } else {
        setToCurrency("USD");
      }
    } else {
      setToCurrency("USD");
    }
  }, [details]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }

        const data = await response.json();
        if (data.result === "success") {
          setExchangeRates(data.conversion_rates);

          // Create an array of currency codes for the dropdowns
          const currencies = Object.keys(data.conversion_rates).map((code) => ({
            code,
            name: code,
          }));

          setAvailableCurrencies(currencies);
          setLoading(false);
        } else {
          throw new Error(data.error || "Exchange rate API error");
        }
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, []);

  // Convert the amount when any of the parameters change
  useEffect(() => {
    if (exchangeRates && fromCurrency && toCurrency && amount) {
      // Convert from USD base to the source currency first if needed
      const amountInUSD =
        fromCurrency === "USD"
          ? parseFloat(amount)
          : parseFloat(amount) / exchangeRates[fromCurrency];

      // Then convert from USD to target currency
      const result = amountInUSD * exchangeRates[toCurrency];
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Dropdown selection handlers
  const selectFromCurrency = (currency) => {
    setFromCurrency(currency.code);
    setShowFromDropdown(false);
  };

  const selectToCurrency = (currency) => {
    setToCurrency(currency.code);
    setShowToDropdown(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Currency Converter</Text>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Currency Converter</Text>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <View style={styles.converterContainer}>
        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.currencyRow}>
          {/* From Currency Dropdown */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>From</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowFromDropdown(true)}
            >
              <Text style={styles.dropdownButtonText}>{fromCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Ionicons name="swap-horizontal" size={24} color="#4CAF50" />
          </TouchableOpacity>

          {/* To Currency Dropdown */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowToDropdown(true)}
            >
              <Text style={styles.dropdownButtonText}>{toCurrency}</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Result Display */}
        {convertedAmount && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>
              {amount} {fromCurrency} equals
            </Text>
            <Text style={styles.resultValue}>
              {convertedAmount} {toCurrency}
            </Text>
            <Text style={styles.rateInfo}>
              1 {fromCurrency} ={" "}
              {(
                exchangeRates[toCurrency] / exchangeRates[fromCurrency]
              ).toFixed(4)}{" "}
              {toCurrency}
            </Text>
          </View>
        )}
      </View>

      {/* From Currency Modal */}
      <Modal
        visible={showFromDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFromDropdown(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowFromDropdown(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyItem}
                  onPress={() => selectFromCurrency(item)}
                >
                  <Text style={styles.currencyCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* To Currency Modal */}
      <Modal
        visible={showToDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowToDropdown(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowToDropdown(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyItem}
                  onPress={() => selectToCurrency(item)}
                >
                  <Text style={styles.currencyCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  converterContainer: {
    backgroundColor: "#333333",
    borderRadius: 8,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#aaaaaa",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#444444",
    borderRadius: 6,
    color: "#ffffff",
    padding: 12,
    fontSize: 16,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownButton: {
    backgroundColor: "#444444",
    borderRadius: 6,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  swapButton: {
    backgroundColor: "#333333",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginTop: 16,
  },
  resultContainer: {
    alignItems: "center",
    backgroundColor: "#444444",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  resultLabel: {
    color: "#aaaaaa",
    fontSize: 14,
  },
  resultValue: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  rateInfo: {
    color: "#aaaaaa",
    fontSize: 12,
  },
  errorText: {
    color: "#ff5252",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#333333",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  currencyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
  },
  currencyCode: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default CurrencyConverter;
