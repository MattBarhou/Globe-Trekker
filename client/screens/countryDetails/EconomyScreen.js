import React from "react";
import { Box, Text, Heading } from "@gluestack-ui/themed";

export default function EconomyScreen({ route }) {
  const { country } = route.params;

  return (
    <Box flex={1} backgroundColor="#1a1a1a" padding={16}>
      <Heading size="xl" color="#ffffff" mb={16}>
        Economy
      </Heading>
      <Text color="#ffffff" fontSize={16} mb={10}>
        Country: {country.name.common}
      </Text>
      <Text color="#ffffff" fontSize={16}>
        Economic information will be displayed here.
      </Text>
    </Box>
  );
}
