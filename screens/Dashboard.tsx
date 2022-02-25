import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Hamburger from '../assets/svgs/hamburger.svg'
import { Text, View } from '../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Cards from '../components/Cards';
import SideMenu from '../components/SideMenu'

export default function Dashboard({ navigation, route }) {
    const user = route.params?.phone_number?.user?.attributes;
	console.log(route.params.phone_number.user);
	const [showMenu, setShowMenu] = useState(false);
	const toggleSideMenu = async () => {
		setShowMenu(!showMenu)
	}

	return (
		<View style={styles.container}>
			{ showMenu && <SideMenu />}
			<View style={styles.header}>
				<Header></Header>
				<Pressable onPress={toggleSideMenu}>
					<Hamburger style={styles.hamburger} />
				</Pressable>
			</View>

			<View style={styles.main}>
                <Text style={styles.name}>
                    {user.first_name},
                </Text>
                <Text style={styles.message}>
                Welcome to your altara dashboard
                </Text>
				<View style={styles.cards}>
				<Cards title="Get a Loan Now!!!" amount="Up to ₦500,000"/>
				<Cards title="Order a Product Now!!!" amount="Up to ₦500,000"/>
			</View>
            </View>
			
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height:'100%',
		position:'relative'
		
	},
	hamburger:{
		marginTop: 80,
        marginRight: 24,
	},
	cards:{
		backgroundColor: '#EFF5F9',
		flexDirection:'column',
		alignItems:'center'
	},
	header: {
		flex: 1,
		flexDirection:'row',
		justifyContent: 'space-between',
		backgroundColor: '#EFF5F9',
	},
    main: {
        flex: 3,
		backgroundColor: '#EFF5F9'
    },
	name:{
		marginHorizontal: 30,
		fontSize: 25,
		color: '#074A74',
		fontFamily: 'Montserrat_700Bold',
		
	},
	message:{
		fontFamily: 'Montserrat_400Regular',
		marginTop: 10,
		marginHorizontal: 30,
		fontSize: 12,
		color: '#72788D',
		paddingBottom:30
	},
	menu:{
		position:'absolute',
		right:0,


	}

});
