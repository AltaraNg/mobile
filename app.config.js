export default {
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
				'sounds': [
					'./local/assets/notification-sound.wav',
					'./local/assets/notification-sound-other.wav',
				],
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
	},
	'web': {
		'favicon': './assets/images/icon.png',
	},
	'sdkVersion': '44.0.0',
	'description': 'Altara Mobile Application',
};
