export default {
    // ...
    extra: {
      // Fall back to development URL when not set
      URL: process.env.API_URL ?? "https://altara-customer-play-api.herokuapp.com/api/v1/",
    },
    "slug": "Altara",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.altara.mobile",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.altara.mobile",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/icon.png"
    },
    "sdkVersion": "44.0.0",
    "description": ""
  }
 
  