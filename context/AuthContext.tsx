import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import { AuthData, authService } from "../services/authService";
const url = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.baseURL = url;

type AuthContextData = {
    fetchNotification;
    setAuthData;
    setTotalUnread;
    totalUnread: object;
    isAdmin: boolean;
    showLoader;
    setShowLoader;
    authData?: AuthData;
    loading: boolean;
    signIn(phone_number: string, otp: string, device_name: string | null, login_type: string): Promise<void>;
    signInPassword(phone_number: string, password: string, device_name: string | null, login_type: string, customer: string): Promise<void>;
    signOut(): void;
    saveProfile(user: object): void;
};

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData>();
    const [showLoader, setShowLoader] = useState(false);
    const [totalUnread, setTotalUnread] = useState({
        unread: 0,
    });
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
        setShowLoader(true);
        try {
            //Try get the data from Async Storage
            const authDataSerialized = await SecureStore.getItemAsync("AuthData");
            if (authDataSerialized) {
                //If there are data, it's converted to an Object and the state is updated.
                const _authData: AuthData = JSON.parse(authDataSerialized);

                setAuthData(_authData);
                fetchNotification();
                if (_authData.user.attributes.staff_id === 999999) {
                    setIsAdmin(true);
                }
            }
            setShowLoader(false);
        } catch (error) {
            setShowLoader(false);
        } finally {
            //loading finished
            setLoading(false);
        }
    }

    const signIn = async (phone_number: string, otp: string, device_name: string, login_type: string) => {
        setShowLoader(true);
        //call the service passing credential (email and password).
        //In a real App this data will be provided by the user from some InputText components.
        const _authData = await authService.signIn(phone_number, otp, device_name, login_type);

        //Set the data in the context, so the App can be notified
        //and send the user to the AuthStack
        if (_authData !== undefined) {
            setAuthData(_authData);
            SecureStore.setItemAsync("AuthData", JSON.stringify(_authData));
            if (_authData.user.attributes.staff_id === 999999) {
                setIsAdmin(true);
            }
            setShowLoader(false);
        }

        //Persist the data in the Async Storage
        //to be recovered in the next user session.
    };
    const signInPassword = async (phone_number: string, password: string, device_name: string, login_type: string, customer: string) => {
        setShowLoader(true);
        //call the service passing credential (email and password).
        //In a real App this data will be provided by the user from some InputText components.
        const _authData = await authService.SignPassword(phone_number, password, device_name, login_type, customer);

        //Set the data in the context, so the App can be notified
        //and send the user to the AuthStack
        if (_authData !== undefined) {
            setAuthData(_authData);
            SecureStore.setItemAsync("AuthData", JSON.stringify(_authData));
            if (_authData.user.attributes.staff_id === 999999) {
                setIsAdmin(true);
            }
            setShowLoader(false);
        }
        //Persist the data in the Async Storage
        //to be recovered in the next user session.
    };

    const fetchNotification = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: `/customers/${authData.user.id}/notifications`,
                headers: { Authorization: `Bearer ${authData.token}` },
            });

            const notification = response?.data?.data?.notifications?.data;
            const unread = notification.filter((item) => {
                return item.read_at === null;
            });

            setTotalUnread({
                unread: unread.length,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const saveProfile = async (user: object) => {
        try {
            const authDataSerialized = await SecureStore.getItemAsync("AuthData");
            if (authDataSerialized) {
                //If there are data, it's converted to an Object and the state is updated.
                const _authData: AuthData = JSON.parse(authDataSerialized);
                const token = _authData.token;
                const newUser = user;
                const newAuthData: AuthData = { token: token, user: newUser };

                setAuthData(newAuthData);
                SecureStore.setItemAsync("AuthData", JSON.stringify(newAuthData));
            }
        } catch (error) {
            console.log("unable to complete");
        }
    };

    const signOut = async () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);

        //Remove the data from Async Storage
        //to NOT be recoverede in next session.
        await SecureStore.deleteItemAsync("AuthData");
    };

    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <AuthContext.Provider
            value={{
                totalUnread,
                setTotalUnread,
                authData,
                setAuthData,
                loading,
                signIn,
                signInPassword,
                signOut,
                isAdmin,
                setShowLoader,
                showLoader,
                saveProfile,
                fetchNotification,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export { AuthContext, AuthProvider, useAuth };
