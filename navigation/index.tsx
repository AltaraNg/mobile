/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useEffect, useState, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ColorSchemeName } from "react-native";
import { AuthContext } from "../context/AuthContext";
import ModalScreen from "../modals/ModalScreen";
import Cards from "../components/Cards";
import { getFocusedRouteNameFromRoute, NavigationContainer, DefaultTheme, DarkTheme, useNavigationContainerRef } from "@react-navigation/native";
import NotFoundScreen from "../screens/NotFoundScreen";
import { DrawerParamList, RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Intro } from "../screens/Intro";
import Login from "../screens/Login";
import LoginPassword from "../screens/LoginPassword";
import Otp from "../screens/Otp";
import Dashboard from "../screens/Dashboard";
import OrderRequest from "../screens/OrderRequest";
import ViewProfile from "../screens/ViewProfile";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { OrderProvider } from "../context/OrderContext";
import axios from "axios";
import Notification from "../screens/Notification";
import History from "../screens/History";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomSidebarMenu from "../components/CustomeSideBarMenu";
import EditProfile from "../screens/EditProfile";
import UploadDocument from "../screens/UploadDocument";
import RequestModal from "../modals/requestModal";
import { Loading } from "../components/Loading";
import { FlagsProvider } from "flagged";
import OrderDetails from "../screens/OrderDetails";
import ViewNotification from "../screens/ViewNotification";
import Calculator from "../screens/Calculator";
import OrderConfirmation from "../screens/OrderConfirmation";
import OrderSuccess from "../screens/OrderSuccess";
import VerificationPassed from "../screens/VerificationPassed";
const url = process.env.EXPO_PUBLIC_API_URL;

axios.defaults.baseURL = url;

function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";

    switch (routeName) {
        case "Dashboard":
            return "Dashboard";
        case "History":
            return "History";
        case "Notification":
            return "Notification";
    }
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    const navigationRef = useNavigationContainerRef();
    const routeNameRef = useRef<string | null>(null);
    const app_id = process.env.EXPO_PUBLIC_APP_ID;
    const app_token = process.env.EXPO_PUBLIC_APP_TOKEN;
    return (
        <AuthProvider>
            <OrderProvider>
                <NavigationContainer
                    linking={LinkingConfiguration}
                    ref={navigationRef}
                    onReady={() => {
                        routeNameRef.current = navigationRef.getCurrentRoute()?.name || "";
                        //when you switch routes set the name of the current screen to the name of the screen
                    }}
                    onStateChange={async () => {
                        const previousRouteName = routeNameRef.current;
                        const currentRouteName = navigationRef.getCurrentRoute()?.name;

                        // if (previousRouteName !== currentRouteName) {
                        //     axios.post(`https://app.nativenotify.com/api/analytics`, {
                        //         app_id: app_id,
                        //         app_token: app_token,
                        //         screenName: currentRouteName,
                        //     });
                        // }

                        // Save the current route name for later comparison
                        routeNameRef.current = currentRouteName || "";
                    }}
                    theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                    <RootNavigator />
                </NavigationContainer>
            </OrderProvider>
        </AuthProvider>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    const { authData, loading, isAdmin } = useAuth();
    if (loading) {
        return <Loading />;
    }

    return (
        <FlagsProvider features={{ admin: isAdmin }}>
            <Stack.Navigator
                screenOptions={{
                    headerTintColor: "green",
                    headerStyle: { backgroundColor: "tomato" },
                }}
            >
                {authData === undefined ? (
                    <Stack.Group>
                        <Stack.Screen options={{ headerShown: false }} name="Intro" component={Intro} />
                        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
                        <Stack.Screen options={{ headerShown: false }} name="LoginPassword" component={LoginPassword} />
                        <Stack.Screen options={{ headerShown: false }} name="OTP" component={Otp} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
                    </Stack.Group>
                )}
                <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
                <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
                <Stack.Screen name="ViewNotification" component={ViewNotification} options={{ headerShown: false }} />
                <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} options={{ headerShown: false }} />
                <Stack.Screen name="VerificationPassed" component={VerificationPassed} options={{ headerShown: false }} />
                <Stack.Screen name="OrderSuccess" component={OrderSuccess} options={{ headerShown: false }} />
                <Stack.Screen name="Calculator" component={Calculator} options={{ headerShown: false }} />
                <Stack.Screen name="Cards" component={Cards} options={{ headerShown: false }} />

                <Stack.Group
                    screenOptions={{
                        presentation: "transparentModal",
                        headerShown: true,
                        animation: "fade_from_bottom",
                    }}
                >
                    <Stack.Screen name="Modal" component={ModalScreen} />
                    <Stack.Screen name="RequestModal" component={RequestModal} />
                </Stack.Group>
            </Stack.Navigator>
        </FlagsProvider>
    );
}

const DrawerNav = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
    const { authData } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [uploaded, setUploaded] = useState<boolean>(false);

    return (
        <DrawerNav.Navigator
            initialRouteName={authData?.user?.attributes?.on_boarded ? "Home" : "CreateProfile"}
            backBehavior="initialRoute"
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "#fff",
                    width: 280,
                },
            }}
            drawerContent={(props) => <CustomSidebarMenu {...props} />}
        >
            <DrawerNav.Screen
                name="Home"
                component={BottomTabNavigator}
                options={() => ({
                    tabBarStyle: {
                        display: getHeaderTitle(Dashboard),
                    },
                    drawerLabelStyle: { color: "#9C9696" },
                    headerShown: false,
                    drawerIcon: () => <FontAwesome size={24} color="#9C9696" name="home" />,
                })}
            />

            <DrawerNav.Screen
                name="ViewProfile"
                component={ViewProfile}
                options={{
                    drawerLabelStyle: { color: "#9C9696" },
                    headerShown: false,
                    drawerLabel: "View Profile",
                    drawerIcon: () => <EvilIcons name="user" size={24} color="#9C9696" />,
                }}
            />
            {authData?.user?.attributes?.on_boarded ? (
                <DrawerNav.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{
                        drawerLabelStyle: { color: "#9C9696" },
                        drawerLabel: "Edit Profile",
                        headerShown: false,
                        drawerIcon: () => <AntDesign name="edit" size={24} color="#9C9696" />,
                    }}
                />
            ) : (
                <DrawerNav.Screen
                    name="CreateProfile"
                    component={EditProfile}
                    options={{
                        drawerLabelStyle: { color: "#9C9696" },
                        drawerLabel: "Create Profile",
                        headerShown: false,
                        drawerIcon: () => <AntDesign name="edit" size={24} color="#9C9696" />,
                    }}
                />
            )}
            {!uploaded && (
                <DrawerNav.Screen
                    name="UploadDocument"
                    component={UploadDocument}
                    options={{
                        drawerLabelStyle: { color: "#9C9696" },
                        drawerLabel: "Upload Document",
                        headerShown: false,
                        drawerIcon: () => <AntDesign name="addfile" size={24} color="#9C9696" />,
                    }}
                />
            )}
        </DrawerNav.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

// function TabBarIcon(props: {
// 	name: React.ComponentProps<typeof FontAwesome>['name'];
// 	color: string;
// }) {
// 	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
// }

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const { totalUnread, fetchNotification } = useAuth();

    // fetchNotification();
    return (
        <BottomTab.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                tabBarActiveTintColor: "#074A74",
                tabBarStyle: { backgroundColor: "#EFF5F9" },
            }}
        >
            <BottomTab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    headerShown: false,
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} color={color} name="home" style={{ marginBottom: -16 }} />,
                }}
            />
            <BottomTab.Screen
                name="History"
                component={History}
                options={{
                    headerShown: false,
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} color={color} name="folder-open" style={{ marginBottom: -16 }} />,
                }}
            />
            <BottomTab.Screen
                name="Notification"
                component={Notification}
                options={{
                    headerShown: false,
                    tabBarBadge: totalUnread.unread === 0 ? false : totalUnread.unread,
                    tabBarBadgeStyle: {
                        color: "white",
                        backgroundColor: totalUnread.unread === 0 ? "#EFF5F9" : "red",
                        fontWeight: "bold",
                    },
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} color={color} name="bell" style={{ marginBottom: -16 }}></FontAwesome>,
                }}
            />
            <BottomTab.Screen
                name="OrderRequest"
                component={OrderRequest}
                options={{
                    headerShown: false,
                    tabBarLabel: "",
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="folder-plus" size={29} color={color} style={{ marginBottom: -16 }} />,
                }}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
