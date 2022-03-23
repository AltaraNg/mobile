import {
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RootTabParamList } from '../types';
import Cards from '../components/Cards';
import SideMenu from './SideMenu';
import {ZeroState} from '../assets/svgs/svg'
import Constants from 'expo-constants';

import { Context as AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { ELoan } from '../assets/svgs/svg';

type Props = NativeStackScreenProps<RootTabParamList, 'Notification'>;

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

export default function Notification({ navigation, route }: Props) {
	const { state } = useContext(AuthContext);
	const [exitApp, setExitApp] = useState(1);
	const [showMenu, setShowMenu] = useState(false);
	const [notifications, setNotifications] = useState(null);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

	const fetchNotification = async () => {
		try {
			let response = await axios({
				method: 'GET',
				url: `/customers/${state.user.id}/notifications`,
				headers: { 'Authorization': `Bearer ${state.token}` },
			});

			const notifications = response?.data?.data?.notifications?.data;
			setNotifications(notifications);
			console.log(notifications);
		} catch (error: any) {
		}
	};

	useEffect(() => {
		fetchNotification();
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
        <Text style={styles.name}>{"Notifications"}</Text>
        {notifications?.length < 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable>
                <View style={styles.order}>
                  <Text
                    style={{
                      fontFamily: "Montserrat_700Bold",
                      fontSize: 18,
                      color: "#074A74",
                    }}
                  >
                    Altara Update
                  </Text>
                  <Text style={{ color: "#777", fontSize: 12 }}>
                    {item.created_at}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Montserrat_500Medium",
                      marginVertical: 14,
                      color: "black",
                    }}
                  >
                    Dear Elizabeth,this is a remainder that your next payment is
                    due on the 12/2/2022
                  </Text>
                </View>
              </Pressable>
            )}
          />
        ) : (
          <View
            style={{
              backgroundColor: "#EFF5F9",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
			  marginTop:40
            }}
          >
            <Image
              source={require("../assets/images/zeroNotifications.png")}
              style={styles.image}
            />
            <Text style={{ color: "black" }}>No notification</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  image: {
    width: Dimensions.get("window").height * 0.46,
    height: Dimensions.get("window").height * 0.46,
  },
  hamburger: {
    marginTop: 80,
    marginRight: 24,
  },
  cards: {
    backgroundColor: "#EFF5F9",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EFF5F9",
  },
  main: {
    flex: 3,
    backgroundColor: "#EFF5F9",
  },
  name: {
    marginHorizontal: 30,
    fontSize: 25,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
  },
  message: {
    fontFamily: "Montserrat_400Regular",
    marginTop: 10,
    marginHorizontal: 30,
    fontSize: 12,
    color: "#72788D",
    paddingBottom: 30,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
  title: {
    backgroundColor: "#EFF5F9",
    marginLeft: 10,
    width: "65%",
  },
  details: {
    backgroundColor: "#EFF5F9",
    flexDirection: "row",
    alignItems: "center",
  },
  order: {
    backgroundColor: "#EFF5F9",
    paddingVertical: 16,
    marginLeft: 26,
    marginRight: 20,
    alignItems: "flex-start",
    marginTop: 30,
    borderStyle: "dashed",
    borderColor: "#074A74",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
