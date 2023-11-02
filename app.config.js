export default {
    // ...
    owner: "ipixels",
    extra: {},
    slug: "loan-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },    
    plugins: [
        [
            "expo-notifications",
            {
                icon: "./assets/images/icon.png",
                color: "#ffffff",
            },
        ],
        [
            "expo-build-properties",
            {
                android: {
                    compileSdkVersion: 33,
                    targetSdkVersion: 31,
                    buildToolsVersion: "31.0.0",
                },
                ios: {
                    deploymentTarget: "13.0",
                },
            },
        ],
    ],
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.altara.mobile",
        buildNumber: "1.0.0",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#ffffff",
        },
        package: "com.altara.mobile",
        versionCode: 1,
        googleServicesFile: "./google-services.json",
    },
    web: {
        favicon: "./assets/images/icon.png",
    },
    description: "Altara Mobile Application",
};
