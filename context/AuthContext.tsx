import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useFeatures } from 'flagged';

import { AuthData, authService } from '../services/authService';

type AuthContextData = {
	isAdmin: boolean,
	authData?: AuthData;
	loading: boolean;
	signIn(
		phone_number: string,
		otp: string,
		device_name: string | null
	): Promise<void>;
	signOut(): void;
};

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
	const [authData, setAuthData] = useState<AuthData>();

	//the AuthContext start with loading equals true
	//and stay like this, until the data be load from Async Storage
	const [loading, setLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		//Every time the App is opened, this provider is rendered
		//and call de loadStorage function.
		loadStorageData();
	}, []);

	async function loadStorageData(): Promise<void> {
		try {
			//Try get the data from Async Storage
			const authDataSerialized = await SecureStore.getItemAsync('AuthData');
			if (authDataSerialized) {
				//If there are data, it's converted to an Object and the state is updated.
				const _authData: AuthData = JSON.parse(authDataSerialized);
				setAuthData(_authData);
				if(_authData.user.attributes.staff_id === 1){
					setIsAdmin(true);
				}
			}
		} catch (error) {
		} finally {
			//loading finished
			setLoading(false);
		}
	}

	const signIn = async (
		phone_number: string,
		otp: string,
		device_name: string
	) => {
		//call the service passing credential (email and password).
		//In a real App this data will be provided by the user from some InputText components.
		const _authData = await authService.signIn(phone_number, otp, device_name);

		//Set the data in the context, so the App can be notified
		//and send the user to the AuthStack
		if (_authData !== undefined) {
			setAuthData(_authData);
			SecureStore.setItemAsync('AuthData', JSON.stringify(_authData));
			if(_authData.user.attributes.staff_id === 1){
				setIsAdmin(true);
			}

		}

		//Persist the data in the Async Storage
		//to be recovered in the next user session.
	};

	const signOut = async () => {
		//Remove data from context, so the App can be notified
		//and send the user to the AuthStack
		setAuthData(undefined);

		//Remove the data from Async Storage
		//to NOT be recoverede in next session.
		await SecureStore.deleteItemAsync('AuthData');
	};

	return (
		//This component will be used to encapsulate the whole App,
		//so all components will have access to the Context
		<AuthContext.Provider value={{ authData, loading, signIn, signOut, isAdmin }}>
			{children}
		</AuthContext.Provider>
	);
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}

export { AuthContext, AuthProvider, useAuth };
