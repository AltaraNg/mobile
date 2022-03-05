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
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SuccessSvg, FailSvg, LogOut } from "../assets/svgs/svg";

import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import {
  DrawerParamList,
  RootStackParamList,
  RootTabParamList,
} from "../types";
import Cards from "../components/Cards";
import SideMenu from "./SideMenu";
import { Context as AuthContext } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootTabParamList, "Dashboard">;

export default function Dashboard({ navigation, route }: Props) {
  const { state } = useContext(AuthContext);
  const [exitApp, setExitApp] = useState(1);
  const [isError, setIsError] = useState(false);

  const [modalResponse, setModalResponse] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const toggleSideMenu = async () => {
    navigation.toggleDrawer();
  };
  let successMessage = "You have successfully applied for  an E-loan";
  let errorMessage = "Sorry! Your Order is unsuccessful";

  const backAction = () => {
    if (Platform.OS === "ios") return;
    setTimeout(() => {}, 3000);

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      ToastAndroid.showWithGravity(
        "press back button again to exit app",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      BackHandler.exitApp();
    }

    return true;
  };

  function handleRequest(res: object, status: String) {
    status === "success" ? setIsError(false) : setIsError(true);
    setModalResponse(res);
    setModalVisible(true);
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const logout = () => {
    navigation.navigate("Login");
  };
  return (
    <View style={styles.container}>
      {showMenu && <SideMenu Logout="Logout" />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
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
                <FailSvg />
                <Text style={styles.modalHeading}>
                  Sorry! Your Order is{" "}
                  <Text style={{ color: "red" }}>unsuccessful</Text>
                </Text>
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
        
        <View style={styles.cards}>
          

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
    borderRadius: 15,
  },
  modalContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  modalHeading: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 30,
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
});
