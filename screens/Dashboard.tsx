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
  Image,
	Dimensions,
} from 'react-native';
import { Button, Overlay, Icon } from "react-native-elements";
import { LinearGradient } from 'expo-linear-gradient';
import { SuccessSvg, FailSvg, LogOut, User } from '../assets/svgs/svg';

import Header from '../components/Header';
import React, { useState, createRef, useEffect, useContext } from 'react';
import Hamburger from '../assets/svgs/hamburger.svg';
import { Text, View } from '../components/Themed';
import { DrawerParamList, RootStackParamList, RootTabParamList } from '../types';
import Cards from '../components/Cards';
import SideMenu from './SideMenu';
import { AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import axios from "axios";
import { useFeatures } from 'flagged';

type Props = DrawerScreenProps<DrawerParamList, 'Home'>


export default function Dashboard({ navigation, route }: Props) {
	const {authData} = useContext(AuthContext);
	const [exitApp, setExitApp] = useState(1);
	const [isError, setIsError] = useState(false);
	const [user, setUser] = useState(null);
	const [modalResponse, setModalResponse] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
  const [onBoarded, setOnBoarded] = useState(null)
  const [showLoader, setShowLoader] = useState(false);
  const [type, setType] = useState("")
	const toggleSideMenu = async () => {
		navigation.toggleDrawer();
	};


  const features = useFeatures();
  console.log(features.admin);

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

	function handleRequest(res: object, status: String, type:string) {
		status === 'success' ? setIsError(false) : setIsError(true);
		setModalResponse(res);
    setType(type)
		setModalVisible(true);
	}
	const fetchUser = async () => {
    setShowLoader(true);
    try {
      let response = await axios({
        method: "GET",
        url: `/auth/user`,
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setShowLoader(false);
      const user = response.data.data[0];
      setUser(user);
      setOnBoarded(user?.attributes?.on_boarded)
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
                  for {type}
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

      {showLoader ? (
        <Image
          source={require("../assets/gifs/loader.gif")}
          style={styles.image}
        />
      ) : (
        <View style={styles.main}>
          <Text style={styles.name}>
            {!onBoarded ? "Hello 😊" : authData.user.attributes.first_name},
          </Text>
          <Text style={styles.message}>Welcome to your altara dashboard </Text>
          {!onBoarded && (
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#EFF5F9",
                marginBottom: 20,
              }}
            >
              <View style={styles.activate}>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <User />
                  <Text style={{ color: "#474A57", fontSize: 13 }}>
                    To fully activate your account, please complete your profile
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    width: 250,
                    backgroundColor: "#DADADA",
                    marginVertical: 8,
                    alignSelf: "center",
                  }}
                ></View>
                <Pressable
                  onPress={() =>
                    navigation.navigate("Create Profile", { user: authData.user })
                  }
                >
                  <Text
                    style={{
                      color: "#074A74",
                      fontFamily: "Montserrat_700Bold",
                      fontSize:12
                    }}
                  >
                    Complete your profile
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.cards}>
            <Cards
              title="Get a Loan Now!!!"
              amount="Up to ₦500,000"
              type="an E-Loan"
              onRequest={handleRequest}
              isDisabled={!onBoarded}
              width={!onBoarded ? 300 : 0}
              height={!onBoarded ? 150 : 0}
            />

            <Cards
              title="Order a Product Now!!!"
              amount="Up to ₦500,000"
              type="a Product"
              onRequest={handleRequest}
              isDisabled={!onBoarded}
              width={!onBoarded ? 300 : 0}
              height={!onBoarded ? 150 : 0}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  activate: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "rgba(7, 74, 116, 0.9)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: 300,
    height: 95,
    padding: 15,
  },
  image: {
    width: Dimensions.get("window").height * 0.46,
    height: Dimensions.get("window").height * 0.46,
    backgroundColor: "#EFF5F9",
    position:'absolute',
    marginTop:250
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
    paddingBottom: 20,
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
    color: "#000",
  },
});
