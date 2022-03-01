/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
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
import ModalScreen from '../screens/ModalScreen';

import NotFoundScreen from '../screens/NotFoundScreen';
import {
	RootStackParamList,
	RootTabParamList,
	RootTabScreenProps,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Intro } from '../screens/Intro';
import Login from '../screens/Login';
import Otp from '../screens/Otp';
import Dashboard from '../screens/Dashboard';
import { Provider as AuthProvider } from '../context/AuthContext';
import { Context as AuthContext } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

import axios from 'axios';
let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		backgroundColor: '#EFF5F9',
	},
};

let token = ''
let isLogin = false;
let user = {};

// const { auth } = React.useContext(AuthContext);

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
	
			if(res.status === 200){
				isLogin = true;
				token = result.token;	
				user = result.user;			
			} else{
				isLogin = false;
			}
		} catch (error) {
			
		}
		

	} else {
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
const AuthStack = createNativeStackNavigator();

function AuthFlow() {
	return (
		<AuthStack.Navigator>
			<AuthStack.Screen
				options={{ headerShown: false }}
				name="Intro"
				component={Intro}
			/>
			<AuthStack.Screen
				options={{ headerShown: false }}
				name="Login"
				component={Login}
			/>
			<AuthStack.Screen
				options={{ headerShown: false }}
				name="OTP"
				component={Otp}
			/>
		</AuthStack.Navigator>
	);
}

function RootNavigator() {
	let { state } = React.useContext(AuthContext);
	if(isLogin) {
		state.token = token;
		state.user = user;
	}
	
	console.log(isLogin);
	return (
		<Stack.Navigator
			screenOptions={{
				headerTintColor: 'green',
				headerStyle: { backgroundColor: 'tomato' },
			}}
		>
			{state.token === null ? (
				<Stack.Screen
					name="Auth"
					component={AuthFlow}
					options={{ headerShown: false }}
				/>
			) : (
				<Stack.Screen
					name="Dashboard"
					component={Dashboard}
					options={{ headerShown: false }}
				/>
			)}

			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen name="Modal" component={ModalScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName="TabOne"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
			}}
		>
			<BottomTab.Screen
				name="TabOne"
				component={WelcomeScreen}
				options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
					title: 'Tab One',
					tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
					headerRight: () => (
						<Pressable
							onPress={() => navigation.navigate('Modal')}
							style={({ pressed }) => ({
								opacity: pressed ? 0.5 : 1,
							})}
						>
							<FontAwesome
								name="info-circle"
								size={25}
								color={Colors[colorScheme].text}
								style={{ marginRight: 15 }}
							/>
						</Pressable>
					),
				})}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
