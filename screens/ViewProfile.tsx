import {
	Pressable,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	TouchableHighlight,
} from 'react-native';


import Header from '../components/Header';
import { useState, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import {
	DrawerParamList,
} from '../types';
import { AuthContext } from '../context/AuthContext';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<DrawerParamList, 'View Profile'>;

export default function ViewProfile({ navigation, route }: Props) {
	const { authData } = useContext(AuthContext);
	const [user, setUser] = useState(null);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

	const fetchUser = async () => {
		setUser(authData.user);
	};
	const displayDate = (user) => {
		if (user !== "N/A") {
			var date = new Date(user).toLocaleDateString();
			return date;
		} else return "Enter Date";
	};

	useEffect(() => {
		fetchUser();
	}, [authData]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Header navigation={navigation}></Header>
				<TouchableOpacity>
					<Pressable onPress={toggleSideMenu}>
						<Hamburger style={styles.hamburger} />
					</Pressable>
				</TouchableOpacity>
			</View>
			{user && (
				<View style={styles.main}>
					<Text style={styles.name}>My Profile</Text>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#EFF5F9",
							marginTop: 20,
						}}
					>
						<TouchableHighlight
							style={{
								borderRadius:
									Math.round(
										Dimensions.get("window").width +
										Dimensions.get("window").height
									) / 2,
								width: Dimensions.get("window").width * 0.2,
								height: Dimensions.get("window").width * 0.2,
								backgroundColor: "#074A74",
								justifyContent: "center",
								alignItems: "center",
							}}
							underlayColor="#ccc"
						>
							<Text
								style={{
									fontSize: 38,
									color: "#fff",
									fontFamily: "Montserrat_800ExtraBold",
								}}
							>
								{" "}
								{user.attributes.first_name.charAt(0).toUpperCase()}{" "}
							</Text>
						</TouchableHighlight>
					</View>

					<View style={styles.row}>
						<View style={styles.item}>
							<Text style={styles.label}>First Name:</Text>
							<Text style={styles.input}>{user.attributes.first_name}</Text>
						</View>
						<View style={styles.item}>
							<Text style={styles.label}>Last Name:</Text>
							<Text style={styles.input}>{user.attributes.last_name}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.item}>
							<Text style={styles.label}>Gender:</Text>
							<Text style={styles.input}>{user.attributes.gender}</Text>
						</View>
						<View style={styles.item}>
							<Text style={styles.label}>Phone Number:</Text>
							<Text style={styles.input}>{user.attributes.phone_number}</Text>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.item}>
							<Text style={styles.label}>Date of Birth:</Text>
							<Text style={styles.input}>
								{displayDate(user.attributes.date_of_birth)}
							</Text>
						</View>
						<View style={styles.item}>
							<Text style={styles.label}>Gender:</Text>
							<Text style={styles.input}>{user.attributes.gender}</Text>
						</View>
					</View>
				</View>
			)}
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
		marginBottom: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	address: {
		backgroundColor: '#EFF5F9',
		marginRight: 24,
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
	email: {
		backgroundColor: '#E8EBF7',
		borderRadius: 6,
		color: '#72788D',
		fontFamily: 'Montserrat_600SemiBold',
		padding: 9,
		width: Dimensions.get('window').width * 0.86,
	},
	container: {
		flex: 1,
		height: '100%',
		position: 'relative',
		backgroundColor: '#EFF5F9'

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

		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#EFF5F9',
	},
	main: {
		flex: 3,
		backgroundColor: '#EFF5F9',
		marginTop: 40

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
