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
      <View style={styles.header}>
        <Header></Header>
        <TouchableOpacity>
          <Pressable onPress={toggleSideMenu}>
            <Hamburger style={styles.hamburger} />
          </Pressable>
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.data}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.input}>{state.user.attributes.first_name}</Text>
        </View>
        <View style={styles.data}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.input}>{state.user.attributes.last_name}</Text>
        </View>
        <View style={styles.data}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.input}>{state.user.attributes.phone_number}</Text>
        </View>
        <View style={styles.data}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.input}>
            {state.user.attributes.email_address}
          </Text>
        </View>
        <LinearGradient
          colors={["#074A77", "#089CA4"]}
          style={styles.buttonContainer}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
        >
          <Pressable style={[styles.button]} >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </LinearGradient>
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
  buttonContainer: {
    flexDirection: "row",
    borderColor: "#074A74",
    borderWidth: 1,
    borderRadius: 10,
    width: 250,
    paddingVertical: 10,
    marginHorizontal: Dimensions.get("window").width * 0.15,
  },
  button: {
    flex: 1,
    alignItems: "center",
    borderRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#E8EBF7",
    color: "#72788D",
    marginRight: 25,
    paddingVertical: 13,
    borderColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  label: {
    color: "#000",
    fontFamily: "Montserrat_500Medium",
    paddingBottom: 3,
  },
  data: {
    backgroundColor: "#EFF5F9",
    paddingLeft: 30,
    marginBottom: 30,
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
  title: {
    marginHorizontal: 30,
    fontSize: 25,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
    marginBottom: 45,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
});
