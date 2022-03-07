import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	ToastAndroid,
	BackHandler,
	Platform,
	TouchableOpacity
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg'
import { Text, View } from '../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RootTabParamList } from '../types';
import Cards from '../components/Cards';
import SideMenu from './SideMenu'
import { Context as AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootTabParamList, 'Notification'>



export default function Notification({ navigation, route }: Props) {
	const {state} = useContext(AuthContext);
	const [exitApp, setExitApp] = useState(1);
	const [showMenu, setShowMenu] = useState(false);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

	const backAction = () => {
		if (Platform.OS === "ios") return;
		setTimeout(() => {
			
		}, 3000)

		if(exitApp === 0){
			setExitApp(exitApp + 1);

			ToastAndroid.showWithGravity(
				'press back button again to exit app',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		} else{
			BackHandler.exitApp();
		}
		
		return true;
	};

	
	const logout = () => {
    navigation.navigate("Login");
  };
	return (
    <View style={styles.container}>
      {showMenu && <SideMenu  Logout="Logout" />}
      <View style={styles.header}>
        <Header></Header>
        <TouchableOpacity>
          <Pressable onPress={toggleSideMenu}>
            <Hamburger style={styles.hamburger} />
          </Pressable>
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Text style={styles.name}>{"Notifications"}</Text>
		<Text style={styles.message}>Coming soon </Text>
       
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
