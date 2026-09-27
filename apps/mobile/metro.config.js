const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// The web app pins React 18, which gets hoisted to the repo root. Force every
// import of react (including from hoisted deps like react-native) to resolve to
// this app's React 19 so there is only one copy in the bundle.
const singletons = ["react"];
const appNodeModules = path.resolve(__dirname, "node_modules");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`))) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(appNodeModules, "_singleton.js") },
      moduleName,
      platform,
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
