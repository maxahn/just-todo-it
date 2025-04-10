/* eslint-disable no-undef */
import "dotenv/config";

const CHANNELS = {
  Development: "development",
  DevelopStaging: "develop-staging",
  Staging: "staging",
  Preview: "preview",
  Production: "production",
};

const APP_NAME = "Task Focus";
const BUNDLE_ID = APP_NAME.replace(" ", ".");

let routes = {
  baseUrl: process.env.BASE_URL,
  authApiUrl: process.env.AUTH_API_URL,
  apiUrl: process.env.API_URL,
};
console.log({ CHANNEL: process.env.CHANNEL });

switch (process.env.CHANNEL) {
  case CHANNELS.Development:
    routes = {
      ...routes,
      baseUrl: process.env.BASE_URL,
      authApiUrl: process.env.AUTH_API_URL,
      apiUrl: process.env.API_URL,
      appName: `(Dev) ${APP_NAME}`,
      bundleIdentifier: `com.maxapp.${BUNDLE_ID}.development`,
    };
    break;
  case CHANNELS.DevelopStaging:
    routes = {
      ...routes,
      baseUrl: process.env.BASE_URL,
      authApiUrl: process.env.AUTH_API_URL,
      apiUrl: process.env.API_URL,
      appName: `(DevStaging) ${APP_NAME}`,
      bundleIdentifier: `com.maxapp.${BUNDLE_ID}.developstaging`,
    };
    break;
  case CHANNELS.Staging:
    routes = {
      ...routes,
      baseUrl: process.env.BASE_URL,
      authApiUrl: process.env.AUTH_API_URL,
      apiUrl: process.env.API_URL,
      appName: "(Staging) Ray Asset Tracker",
      bundleIdentifier: `com.maxapp.${BUNDLE_ID}.staging`,
    };
    break;
  case CHANNELS.Preview:
    routes = {
      ...routes,
      baseUrl: process.env.PREVIEW_BASE_URL,
      authApiUrl: process.env.PREVIEW_AUTH_API_URL,
      apiUrl: process.env.PREVIEW_API_URL,
      resetUrl: process.env.PREVIEW_RESET_URL,
      appName: `(Preview) ${APP_NAME}`,
      bundleIdentifier: `com.maxapp.${BUNDLE_ID}.preview`,
    };
    break;
  case CHANNELS.Production:
    routes = {
      ...routes,
      baseUrl: process.env.PROD_BASE_URL,
      authApiUrl: process.env.PROD_AUTH_API_URL,
      apiUrl: process.env.PROD_API_URL,
      resetUrl: process.env.PROD_RESET_URL,
      appName: APP_NAME,
      bundleIdentifier: `com.maxapp.${BUNDLE_ID}.tracker`,
    };
    break;
  default:
    break;
}

const config = {
  expo: {
    name: routes.appName,
    slug: "task-focus",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: routes.bundleIdentifier,
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#0F172A",
      },
      package: routes.bundleIdentifier,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 256,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      ...routes,
      router: {
        origin: false,
      },
      eas: {
        projectId: "3056a6bf-da3d-47f9-b00c-bee57c1c38ea",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/3056a6bf-da3d-47f9-b00c-bee57c1c38ea",
    },
  },
};

export default config;
