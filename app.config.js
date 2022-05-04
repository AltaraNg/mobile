export default {
	// ...
	extra: {
		// Fall back to development URL when not set
		URL:
			process.env.API_URL ??
			'https://altara-customer-play-api.herokuapp.com/api/v1/',
		BEAMS_INSTANCE: 'f7b96c9d-c657-414a-afd9-8dc713ff294e',
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
		'googleServicesFile': './google-services.json',
		'permissions': ['NOTIFICATIONS'],
		'useNextNotificationsApi': true,
	},
	'web': {
		'favicon': './assets/images/icon.png',
	},
	'sdkVersion': '44.0.0',
	'description': '',
};
