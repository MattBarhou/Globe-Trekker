import "dotenv/config";

export default {
  expo: {
    name: "Globe Trekker",
    slug: "globe-trekker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    updates: {
      url: "https://u.expo.dev/93479e2b-7319-4251-9954-f3cf75ba0aa3",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    userInterfaceStyle: "light",
    owner: "mattbarhou",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Globe Trekker to use your location.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "93479e2b-7319-4251-9954-f3cf75ba0aa3",
      },
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
    },
  },
};
