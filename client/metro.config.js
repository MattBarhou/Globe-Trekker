const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add additional asset extensions
defaultConfig.resolver.assetExts.push("png");

module.exports = defaultConfig;
