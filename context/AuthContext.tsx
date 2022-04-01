import { post } from '../utilities/api';
import createDataContext from './createDataContext';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
let url = 'auth/login';
const MY_SECURE_AUTH_STATE_KEY = 'MySecureAuthStateKey';

const authReducer = (state, action) => {
	switch (action.type) {
		case 'signout':
			return { token: null, email: '' };
		case 'signin':
			return {
				token: action.payload.token,
				user: action.payload.user,
				id: action.payload.id,
			};
		default:
			return state;
	}
};

const signin = (dispatch) => {
	let token = '';
	let user = '';
	return ({ otp, phone_number, device_name }) => {
		const data = {
			otp: otp,
			phone_number: phone_number,
			device_name: device_name,
		};
		post(url, data)
			.then((res) => {
				let loginInfo = res.data.data;
				token = loginInfo.token;
				user = loginInfo.user;

				const storageValue = JSON.stringify(loginInfo);

				if (Platform.OS !== 'web') {
					SecureStore.setItemAsync(MY_SECURE_AUTH_STATE_KEY, storageValue);
				}
				dispatch({
					type: 'signin',
					payload: {
						token: token,
						user: user,
					},
				});
				
			})
			.catch((err) => {
				return 'OTP is incorrect'
			})
			.finally(() => {});
		// Do some API Request here
	};
};

const signout = (dispatch) => {
	return () => {
		if (Platform.OS !== 'web') {
			SecureStore.deleteItemAsync(MY_SECURE_AUTH_STATE_KEY);
		}

		dispatch({
			type: 'signout',
			payload: {
				token: null,
				user: null,
			},
		});
	};
};

export const { Provider, Context } = createDataContext(
	authReducer,
	{ signin, signout },
	{ token: null, user: ''}
);
