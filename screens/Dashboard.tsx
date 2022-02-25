import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	ToastAndroid,
	BackHandler,
	Platform,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef, useEffect } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg'
import { Text, View } from '../components/Themed';

import Cards from '../components/Cards'

export default function Dashboard({ navigation, route }) {

	const [exitApp, setExitApp] = useState(1);
    const user = route.params?.phone_number?.user?.attributes;
	const backAction = () => {
		if (Platform.OS === "ios") return;
		setTimeout(() => {
			
		}, 3000)

		if(exitApp === 0){
			setExitApp(exitApp + 1);
			console.log(exitApp);

			ToastAndroid.showWithGravity(
				'press back button again to exit app',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		} else{
			console.log('exit now');
			BackHandler.exitApp();
		}
		
		return true;
	};

	useEffect(() => {
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
		return () => backHandler.remove();
	}, [])


	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Header></Header>
				<Hamburger style={styles.hamburger} />
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
	}

});
