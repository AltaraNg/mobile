import {
  Pressable,
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";

import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import { RootStackParamList, RootTabParamList } from '../types';

import Constants from 'expo-constants';

import { AuthContext, useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewNotification'>;

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

export default function Notification({ navigation, route }: Props) {
  const [refreshing, setRefreshing] = useState(true);
	const { totalUnread, setTotalUnread, isAdmin, fetchNotification } = useAuth();

	const { authData } = useContext(AuthContext);
	
  const [showLoader, setShowLoader] = useState(false);
	const [notifications, setNotifications] = useState(null);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

  const viewDetail = async (notification) => {
    if(notification.read_at === null){
      try{
        let read = await axios({
          method: 'PATCH',
          url: `/notification/${notification.id}`,
          headers: { 'Authorization': `Bearer ${authData.token}` },
        });
        fetchNotificationNorm();
        fetchNotification();
      }catch(err){
        console.log(err.message);
      }
     
    }
    
        
    navigation.navigate('ViewNotification', notification);
  };

	const fetchNotificationNorm = async () => {
    setShowLoader(true)
		try {
			let response = await axios({
				method: 'GET',
				url: `/customers/${authData.user.id}/notifications`,
				headers: { 'Authorization': `Bearer ${authData.token}` },
			});
      setShowLoader(false)
      setRefreshing(false);

			const notification = response?.data?.data?.notifications?.data;
			setNotifications(notification);
      // fetchNotification();

		} catch (error: any) {
		}
	};

	useEffect(() => {
		fetchNotificationNorm();
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
        {showLoader ? (
          <Image
            source={require("../assets/gifs/loader.gif")}
            style={styles.image2}
          />
        ) : (
          <View
            style={{
              backgroundColor: "#EFF5F9",
              marginTop: 30,
              marginBottom: 60,
            }}
          >
            {notifications?.length > 0 ? (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchNotificationNorm}
                  />
                }
                renderItem={({ item }) => (
                  <Pressable  onPress={() => viewDetail(item)}>
                    <View style={item.read_at ? styles.order : styles.orderRead}>
                      <Text
                        style={item.read_at ? {
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 18,
                          color: "rgba(7, 74, 116, 0.36)",
                        } : {
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 18,
                          color: "#074A74",
                        }}
                      >
                        {JSON.parse(item.data).subject}
                      </Text>
                      <Text style={{ color: "#777", fontSize: 12 }}>
                        {item.created_at}
                      </Text>

                      <Text
                        style={item.read_at ? {
                          fontSize: 13,
                          fontFamily: "Montserrat_500Medium",
                          marginVertical: 8,
                          color: "#7B7A7A",
                        }: {
                          fontSize: 13,
                          fontFamily: "Montserrat_500Medium",
                          marginVertical: 8,
                          color: "black",
                        }}
                      numberOfLines={1}
                      >
                        {JSON.parse(item.data).message}
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
                  marginTop: 40,
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
    backgroundColor: "#EFF5F9",

  },
  image: {
    width: Dimensions.get("window").height * 0.46,
    height: Dimensions.get("window").height * 0.46,
  },
  image2: {
    width: Dimensions.get("window").height * 0.2,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#EFF5F9",
    position: "absolute",
    top: Dimensions.get("window").height * 0.2,
    left: Dimensions.get("window").width * 0.25,
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
   
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EFF5F9",
  },
  main: {
    flex: 3,
    backgroundColor: "#EFF5F9",
    marginTop:40

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
  orderRead: {
    backgroundColor: "white",
  
    alignItems: "flex-start",
    borderColor: "#074A74",
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    padding: 10
  },
  order: {
    backgroundColor: "#EFF5F9",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "flex-start",
    borderColor: "#074A74",
    borderBottomWidth: 1,
    padding: 10

  }
});
