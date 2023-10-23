export default {
<<<<<<< HEAD
	// ...
	extra: {
		// Fall back to development URL when not set
		URL:
			process.env.API_URL ??
			'https://altara-customer-play-api.herokuapp.com/api/v1/',
		APP_ID: process.env.APP_ID ?? '2566',
		APP_TOKEN: process.env.APP_TOKEN ?? '3giYD4fJ6e7vESNT5Bwa0F',
	},
	'slug': 'Altara',
	'version': '1.0.0',
	'orientation': 'portrait',
	'icon': './assets/images/icon.png',
	'scheme': 'myapp',
	'userInterfaceStyle': 'automatic',
	'splash': {
		'image': './assets/images/splash.png',
		'resizeMode': 'contain',
		'backgroundColor': '#ffffff',
	},
	plugins: [
		[
			'expo-notifications',
			{
				'icon': './assets/images/icon.png',
				'color': '#ffffff',
				
			},
		],
	],
	'updates': {
		'fallbackToCacheTimeout': 0,
	},
	'assetBundlePatterns': ['**/*'],
	'ios': {
		'supportsTablet': true,
		'bundleIdentifier': 'com.altara.mobile',
		'buildNumber': '1.0.0',
	},
	'android': {
		'adaptiveIcon': {
			'foregroundImage': './assets/images/adaptive-icon.png',
			'backgroundColor': '#ffffff',
		},
		'package': 'com.altara.mobile',
		'versionCode': 1,
		"googleServicesFile": "./google-services.json"
	},
	'web': {
		'favicon': './assets/images/icon.png',
	},
	'description': 'Altara Mobile Application',
=======
    // ...
    owner: "ipixels",
    extra: {
        eas: {
            projectId: "ec89dc74-c330-41a0-a4f7-30e7feaf1d42",
        },
    },
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
>>>>>>> fa571561f48eb7d12fc4db7f5f113255a7646528
};
