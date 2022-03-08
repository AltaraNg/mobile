import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	ToastAndroid,
	BackHandler,
	Platform,
	TouchableOpacity,
	Modal,
	Alert,
	Dimensions,
	TouchableHighlight,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { SuccessSvg, FailSvg, LogOut } from '../assets/svgs/svg';

import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import {
	DrawerParamList,
	RootStackParamList,
	RootTabParamList,
} from '../types';
import SideMenu from './SideMenu';
import { Context as AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<DrawerParamList, 'View Profile'>;

export default function ViewProfile({ navigation, route }: Props) {
	const { state } = useContext(AuthContext);
	const [exitApp, setExitApp] = useState(1);
	const [showMenu, setShowMenu] = useState(false);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

	return (
		<View style={styles.container}>
			{showMenu && <SideMenu Logout="Logout" />}

			<View style={styles.header}>
				<Header></Header>
				<TouchableOpacity>
					<Pressable onPress={toggleSideMenu}>
						<Hamburger style={styles.hamburger} />
					</Pressable>
				</TouchableOpacity>
			</View>

			<View style={styles.main}>
				<Text style={styles.name}>My Profile</Text>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#EFF5F9',
						marginTop: 20,
					}}
				>
					<TouchableHighlight
						style={{
							borderRadius:
								Math.round(
									Dimensions.get('window').width +
										Dimensions.get('window').height
								) / 2,
							width: Dimensions.get('window').width * 0.2,
							height: Dimensions.get('window').width * 0.2,
							backgroundColor: '#074A74',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						underlayColor="#ccc"
						onPress={() => alert('Yaay!')}
					>
						<Text
							style={{
								fontSize: 38,
								color: '#fff',
								fontFamily: 'Montserrat_800ExtraBold',
							}}
						>
							{' '}
							{state.user.attributes.first_name.charAt(0)}{' '}
						</Text>
					</TouchableHighlight>
				</View>

				<View style={styles.row}>
					<View style={styles.item}>
						<Text style={styles.label}>First Name:</Text>
						<Text style={styles.input}>{state.user.attributes.first_name}</Text>
					</View>
					<View style={styles.item}>
						<Text style={styles.label}>Last Name:</Text>
						<Text style={styles.input}>{state.user.attributes.last_name}</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.item}>
						<Text style={styles.label}>Gender:</Text>
						<Text style={styles.input}>{state.user.attributes.gender}</Text>
					</View>
					<View style={styles.item}>
						<Text style={styles.label}>Phone Number:</Text>
						<Text style={styles.input}>
							{state.user.attributes.phone_number}
						</Text>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.address}>
						<Text style={styles.label}>Email Address:</Text>
						<Text style={styles.input}>
							{state.user.attributes.email_address}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		backgroundColor: '#EFF5F9',
		marginLeft: 30,
		marginRight: 24,
		marginTop: 40,
		marginBottom: 25,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	address: {
		width: 280,
		backgroundColor: '#EFF5F9',
	},
	item: {
		backgroundColor: '#EFF5F9',
		width: 140,
	},
	label: {
		color: '#111',
		fontFamily: 'Montserrat_700Bold',
		marginBottom: 5,
	},
	input: {
		backgroundColor: '#E8EBF7',
		borderRadius: 6,
		color: '#72788D',
		fontFamily: 'Montserrat_600SemiBold',
		padding: 9,
	},
	container: {
		flex: 1,
		height: '100%',
		position: 'relative',
	},
	hamburger: {
		marginTop: 80,
		marginRight: 24,
	},
	cards: {
		backgroundColor: '#EFF5F9',
		flexDirection: 'column',
		alignItems: 'center',
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#EFF5F9',
	},
	main: {
		flex: 3,
		backgroundColor: '#EFF5F9',
	},
	name: {
		marginHorizontal: 30,
		fontSize: 25,
		color: '#074A74',
		fontFamily: 'Montserrat_700Bold',
	},

	menu: {
		position: 'absolute',
		right: 0,
	},

	modalContainer: {
		height: Dimensions.get('screen').height / 2.1,
		alignItems: 'center',
		marginTop: 'auto',
		borderRadius: 15,
	},
	modalContent: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	modalHeading: {
		fontFamily: 'Montserrat_700Bold',
		fontSize: 30,
	},
	modalHeaderCloseText: {
		backgroundColor: 'white',
		textAlign: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		width: 30,
		fontSize: 15,
		borderRadius: 50,
	},
});
