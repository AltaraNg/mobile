/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../modals/ModalScreen';
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import NotFoundScreen from '../screens/NotFoundScreen';
import {
	DrawerParamList,
	RootStackParamList,
	RootTabParamList,
	RootTabScreenProps,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Intro } from '../screens/Intro';
import Login from '../screens/Login';
import Otp from '../screens/Otp';
import Dashboard from '../screens/Dashboard';
import ViewProfile from '../screens/ViewProfile';
import { Provider as AuthProvider } from '../context/AuthContext';
import { Context as AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

import axios from 'axios';
import Notification from '../screens/Notification';
import History from '../screens/History';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomSidebarMenu from '../components/CustomeSideBarMenu';
import EditProfile from '../screens/EditProfile';
import RequestModal from '../modals/requestModal';
let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		backgroundColor: '#EFF5F9',
	},
};

let token = '';
let isLogin = false;
let user = {};

async function getValueFor(key) {
	let result = await SecureStore.getItemAsync(key);

	if (result) {
		result = JSON.parse(result);
		try {
			let res = await axios({
				method: 'GET',
				url: '/auth/user',
				headers: { 'Authorization': `Bearer ${result.token}` },
			});

			if (res.status === 200) {
				isLogin = true;
				token = result.token;
				user = result.user;
			} else {
				isLogin = false;
			}
		} catch (error) {}
	} else {
	}
}
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


export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<AuthProvider>
			<NavigationContainer
				linking={LinkingConfiguration}
				theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
			>
				<RootNavigator />
			</NavigationContainer>
		</AuthProvider>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
getValueFor('MySecureAuthStateKey');
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	let { state } = React.useContext(AuthContext);
	if (isLogin) {
		state.token = token;
		state.user = user;
	}

	return (
		<Stack.Navigator
			screenOptions={{
				headerTintColor: 'green',
				headerStyle: { backgroundColor: 'tomato' },
			}}
		>
			{state.token === null ? (
				<Stack.Group>
					<Stack.Screen
						options={{ headerShown: false }}
						name="Intro"
						component={Intro}
					/>
					<Stack.Screen
						options={{ headerShown: false }}
						name="Login"
						component={Login}
					/>
					<Stack.Screen
						options={{ headerShown: false }}
						name="OTP"
						component={Otp}
					/>
				</Stack.Group>
			) : (
				<Stack.Group>
					<Stack.Screen
						name="Main"
						component={DrawerNavigator}
						options={{ headerShown: false }}
					/>
				</Stack.Group>
			)}

			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>
			<Stack.Group
				screenOptions={{
					presentation: 'transparentModal',
					headerShown: true,
					animation: 'fade_from_bottom',
				}}
			>
				<Stack.Screen name="Modal" component={ModalScreen} />
				<Stack.Screen name="RequestModal" component={RequestModal} />
			</Stack.Group>
		</Stack.Navigator>
	);
}





const DrawerNav = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator({route, navigation}) {
	const colorScheme = useColorScheme();
	return (
    <DrawerNav.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#fff",
          width: 240,
        },
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <DrawerNav.Screen
        name="Home"
        component={BottomTabNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display: getHeaderTitle(Dashboard),
          },
          drawerLabelStyle: { color: "#9C9696" },
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <FontAwesome size={24} color="#9C9696" name="home" />
          ),
        })}
      />

      <DrawerNav.Screen
        name="View Profile"
        component={ViewProfile}
        options={{
          drawerLabelStyle: { color: "#9C9696" },
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <EvilIcons name="user" size={24} color="#9C9696" />
          ),
        }}
      />
      <DrawerNav.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{
          drawerLabelStyle: { color: "#9C9696" },
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <AntDesign name="edit" size={24} color="#9C9696" />
          ),
        }}
      />
    </DrawerNav.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName="Dashboard"
			screenOptions={{
				tabBarActiveTintColor: '#074A74',
				tabBarStyle: { backgroundColor: '#EFF5F9' },
			}}
		>
			<BottomTab.Screen
				name="Dashboard"
				component={Dashboard}
				options={{
					headerShown: false,
					tabBarLabel: '',
					tabBarIcon: ({ color, size }) => (
						<FontAwesome
							size={size}
							color={color}
							name="home"
							style={{ marginBottom: -16 }}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="History"
				component={History}
				options={{
					headerShown: false,
					tabBarLabel: '',
					tabBarIcon: ({ color, size }) => (
						<FontAwesome
							size={size}
							color={color}
							name="folder-open"
							style={{ marginBottom: -16 }}
						/>
					),
				}}
			/>
			<BottomTab.Screen
				name="Notification"
				component={Notification}
				options={{
					headerShown: false,
					tabBarLabel: '',
					tabBarIcon: ({ color, size }) => (
						<FontAwesome
							size={size}
							color={color}
							name="bell"
							style={{ marginBottom: -16 }}
						/>
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
