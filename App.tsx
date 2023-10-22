import React from "react";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Provider as PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { Alert } from "react-native";

import {
    useFonts,
    Montserrat_100Thin,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light,
    Montserrat_300Light_Italic,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black,
    Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { Subscription } from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Keep the splash screen visible while we fetch resources|
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const app_id = process.env.EXPO_PUBLIC_APP_ID;
export default function App() {
    const [, setExpoPushToken] = useState("");
    const [, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef({});
    const responseListener = useRef({});

    const [fontsLoaded] = useFonts({
        Montserrat_100Thin,
        Montserrat_100Thin_Italic,
        Montserrat_200ExtraLight,
        Montserrat_200ExtraLight_Italic,
        Montserrat_300Light,
        Montserrat_300Light_Italic,
        Montserrat_400Regular,
        Montserrat_400Regular_Italic,
        Montserrat_500Medium,
        Montserrat_500Medium_Italic,
        Montserrat_600SemiBold,
        Montserrat_600SemiBold_Italic,
        Montserrat_700Bold,
        Montserrat_700Bold_Italic,
        Montserrat_800ExtraBold,
        Montserrat_800ExtraBold_Italic,
        Montserrat_900Black,
        Montserrat_900Black_Italic,
    });

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current as Subscription);
            Notifications.removeNotificationSubscription(responseListener.current as Subscription);
        };
    }, []);

    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete || !fontsLoaded) {
        return null;
    }

    SplashScreen.hideAsync();

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar style="dark" />
            </PaperProvider>
        </SafeAreaProvider>
    );
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            AlertModal("Failed to get push token for push notification!");
            return;
        }
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (await Notifications.getExpoPushTokenAsync({ projectId: app_id })).data;
        console.log(token);
    } else {
        AlertModal("Must use physical device for Push Notifications");
    }

    return token;
}

const AlertModal = (message: string) =>
    Alert.alert("Info", message, [
        {
            text: "Ask me later",
            onPress: () => console.log("Ask me later pressed"),
        },
        {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
