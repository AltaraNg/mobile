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
	TouchableHighlight,
	Alert,
	Dimensions,
} from 'react-native';
import { Button, Overlay, Icon } from "react-native-elements";
import { LinearGradient } from 'expo-linear-gradient';
import { SuccessSvg, FailSvg, LogOut } from '../assets/svgs/svg';

import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import { DrawerParamList, RootStackParamList, RootTabParamList } from '../types';
import Cards from '../components/Cards';
import SideMenu from './SideMenu';
import { Context as AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import axios from "axios";

type Props = DrawerScreenProps<DrawerParamList, 'Home'>


export default function Dashboard({ navigation, route }: Props) {
	const { state } = useContext(AuthContext);
	const [exitApp, setExitApp] = useState(1);
	const [isError, setIsError] = useState(false);
	const [user, setUser] = useState(null);
	const [modalResponse, setModalResponse] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};

	const backAction = () => {
		if (Platform.OS === 'ios') return;
		setTimeout(() => {}, 3000);

		if (exitApp === 0) {
			setExitApp(exitApp + 1);

			ToastAndroid.showWithGravity(
				'press back button again to exit app',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		} else {
			BackHandler.exitApp();
		}

		return true;
	};

	function handleRequest(res: object, status: String) {
		status === 'success' ? setIsError(false) : setIsError(true);
		setModalResponse(res);
		setModalVisible(true);
	}
	const fetchUser = async () => {
    try {
      let response = await axios({
        method: "GET",
        url: `/auth/user`,
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const user = response.data.data[0];
      setUser(user);
    } catch (error: any) {
      ToastAndroid.showWithGravity(
        "Unable to fetch user",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

	

	

	
	return (
    <View style={styles.container}>
      <Overlay
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(!modalVisible);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        style={{ justifyContent: "flex-end", margin: 0, position: "relative" }}
      >
        <TouchableHighlight
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            borderRadius:
              Math.round(
                Dimensions.get("window").width + Dimensions.get("window").height
              ) / 2,
            width: Dimensions.get("window").width * 0.13,
            height: Dimensions.get("window").width * 0.13,
            backgroundColor: "#fff",
            position: "absolute",
            //   top: 1 / 2,
            marginHorizontal: Dimensions.get("window").width * 0.43,
            marginVertical: Dimensions.get("window").width * 0.76,
            justifyContent: "center",
            alignItems: "center",
          }}
          underlayColor="#ccc"
        >
          <Text
            style={{
              fontSize: 20,
              color: "#000",
              fontFamily: "Montserrat_900Black",
            }}
          >
            &#x2715;
          </Text>
        </TouchableHighlight>
        {!isError ? (
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.modalHeaderCloseText}>X</Text>
            </TouchableOpacity>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <SuccessSvg />
                <Text style={styles.modalHeading}>
                  You have{" "}
                  <Text style={{ color: "#074A74" }}>successfully</Text> applied
                  for an E-loan
                </Text>

                {modalResponse && (
                  <Text
                    style={{
                      color: "#474A57",
                      fontFamily: "Montserrat_500Medium",
                      marginTop: 30,
                      marginHorizontal: 30,
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {modalResponse.message}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.modalHeaderCloseText}>X</Text>
            </TouchableOpacity>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableHighlight
                  style={{
                    borderRadius:
                      Math.round(
                        Dimensions.get("window").width +
                          Dimensions.get("window").height
                      ) / 2,
                    width: Dimensions.get("window").width * 0.3,
                    height: Dimensions.get("window").width * 0.3,
                    backgroundColor: "#DB2721",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  underlayColor="#ccc"
                >
                  <Text
                    style={{
                      fontSize: 68,
                      color: "#fff",
                      fontFamily: "Montserrat_900Black",
                    }}
                  >
                    &#x2715;
                  </Text>
                </TouchableHighlight>
                <Text style={styles.modalHeading}>
                  Sorry! Your Order is{" "}
                  <Text style={{ color: "red" }}>unsuccessful</Text>
                </Text>
                {modalResponse && (
                  <Text style={styles.errText}>
                    {modalResponse.error_message}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </Modal>
      <View style={styles.header}>
        <Header></Header>
        <TouchableOpacity>
          <Pressable onPress={toggleSideMenu}>
            <Hamburger style={styles.hamburger} />
          </Pressable>
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Text style={styles.name}>{state.user.attributes.first_name},</Text>
        <Text style={styles.message}>Welcome to your altara dashboard </Text>
        <View style={styles.cards}>
          <Cards
            title="Get a Loan Now!!!"
            amount="Up to ₦500,000"
            type="Loan"
            onRequest={handleRequest}
          />

          <Cards
            title="Order a Product Now!!!"
            amount="Up to ₦500,000"
            type="Product"
            onRequest={handleRequest}
          />
        </View>
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

  modalContainer: {
    height: Dimensions.get("screen").height / 2.1,
    alignItems: "center",
    marginTop: "auto",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  modalContent: {
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    backgroundColor: "white",
  },
  modalHeading: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 30,
    textAlign: "center",
    color: "black",
    marginTop: 20,
  },
  modalHeaderCloseText: {
    backgroundColor: "white",
    textAlign: "center",
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
    fontSize: 15,
    borderRadius: 50,
  },

  errText: {
    fontSize: 15,
    marginTop: 20,
    paddingHorizontal: 15,
    textAlign: "center",
	color:'#000'
  },
});
