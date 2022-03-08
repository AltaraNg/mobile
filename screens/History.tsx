import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	ToastAndroid,
	BackHandler,
	Platform,
	TouchableOpacity,
	Touchable,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RootTabParamList } from '../types';
import Cards from '../components/Cards';
import SideMenu from './SideMenu';
import { ELoan, Rental, ProductLoan } from '../assets/svgs/svg';
import { Context as AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;
type Props = NativeStackScreenProps<RootTabParamList, 'History'>;

export default function History({ navigation, route }: Props) {
	const { state } = useContext(AuthContext);
	const [orders, setOrders] = useState(null);
	const [exitApp, setExitApp] = useState(1);
	const [showMenu, setShowMenu] = useState(false);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

	const fetchOrder = async () => {
		try {
			let response = await axios({
				method: 'GET',
				url: `/customers/${state.user.id}/orders`,
				headers: { 'Authorization': `Bearer ${state.token}` },
			});

			const order = response.data.data[0].included.orders;
			setOrders(order);
		} catch (error: any) {
			console.log(error.response.data);
		}
	};

	const viewDetail = (order: object) => {
		console.log(order);
	};

	useEffect(() => {
		fetchOrder();
	}, []);
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Header></Header>
				<TouchableOpacity>
					<Pressable onPress={toggleSideMenu}>
						<Hamburger style={styles.hamburger} />
					</Pressable>
				</TouchableOpacity>
			</View>

			<View style={styles.main}>
				<Text style={styles.name}>{'History'}</Text>
				{orders && (
					<FlatList
						data={orders}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<Pressable onPress={() => viewDetail(item)}>
							<View style={styles.order}>
								<View style={styles.details}>
										<ELoan />
										<View style={styles.title}>
											<Text
												style={{
													color: '#074A74',
													fontFamily: 'Montserrat_700Bold',
												}}
												numberOfLines={1}
												ellipsizeMode={'tail'}
											>
												{item.included.product.name}{' '}
											</Text>
											<Text style={{ color: '#000', fontSize: 12 }}>
												Order ID: {item?.attributes?.order_number}
											</Text>
										</View>
								</View>
								<Text style={{ color: '#000', fontSize: 13 }}>
									{item?.attributes?.order_date}
								</Text>
							</View>
							</Pressable>
						)}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
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
	title: {
		backgroundColor: '#EFF5F9',
		marginLeft: 10,
		width: '65%',
	},
	details: {
		backgroundColor: '#EFF5F9',
		flexDirection: 'row',
		alignItems: 'center',
	},
	order: {
		backgroundColor: '#EFF5F9',
		flexDirection: 'row',
		marginLeft: 26,
		marginRight: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 30,
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
		marginBottom: 60,
	},
	message: {
		fontFamily: 'Montserrat_400Regular',
		marginTop: 10,
		marginHorizontal: 30,
		fontSize: 12,
		color: '#72788D',
		paddingBottom: 30,
	},
	menu: {
		position: 'absolute',
		right: 0,
	},
});
