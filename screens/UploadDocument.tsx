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
  Image,
  Alert,
  Dimensions,
  ScrollView,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { SuccessSvg, FailSvg, LogOut, Calender } from "../assets/svgs/svg";
import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import { CheckBox } from "react-native-elements";
import {
  DrawerParamList,
  RootStackParamList,
  RootTabParamList,
} from "../types";
import { Dropdown } from "react-native-element-dropdown";
import Cards from "../components/Cards";
import SideMenu from "./SideMenu";
import { AuthContext } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserInterfaceIdiom } from "expo-constants";
import axios from "axios";
import RadioButton from "../components/RadioButton";
type Props = NativeStackScreenProps<RootTabParamList, "Dashboard">;
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Upload from '../components/Upload'
let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

export default function Dashboard({ navigation, route }: Props) {
  const { authData } = useContext(AuthContext);
  const [exitApp, setExitApp] = useState(1);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onBoarded, setOnBoarded] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Enter Date");
 
  const toggleSideMenu = async () => {
    navigation.toggleDrawer();
  };

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
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      let result = await axios({
        method: "PATCH",
        url: `/customers/${authData.user.id}`,
        headers: { Authorization: `Bearer ${authData.token}` },
        data: user,
      });
      setLoading(false);
      ToastAndroid.showWithGravity(
        "Profile updated successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      console.log(user);
      navigation.navigate("View Profile");
    } catch (error) {
      ToastAndroid.showWithGravity(
        "Error! Request was not completed",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      let response = await axios({
        method: "GET",
        url: `/auth/user`,
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const user = response.data.data[0].attributes;
      setUser(user);
      setOnBoarded(user?.on_boarded);
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
    <ScrollView style={styles.container}>
      {showMenu && <SideMenu Logout="Logout" />}
      <View style={styles.header}>
        <Header></Header>
        <TouchableOpacity>
          <Pressable onPress={toggleSideMenu}>
            <Hamburger style={styles.hamburger} />
          </Pressable>
        </TouchableOpacity>
      </View>
      {user && (
        <ScrollView
          style={{
            backgroundColor: "#fff",
          }}
        >
          <View style={styles.main}>
            <Text style={styles.title}>Upload Document</Text>
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-evenly",
                backgroundColor: "white",
              }}
            >
              <Upload color="rgba(118, 104, 251, 0.13)" document="Passport" />
              <Upload
                color="rgba(246, 69, 97, 0.13)"
                document="Work Guarantor"
              />
              <Upload
                color="rgba(156, 197, 118, 0.13)"
                document="Proof Of Income"
              />
              <Upload
                color="rgba(253, 194, 40, 0.13)"
                document="Processing Fee"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                marginVertical: 15,
              }}
            >
              <LinearGradient
                colors={["#074A77", "#089CA4"]}
                style={styles.buttonContainer}
                start={{ x: 1, y: 0.5 }}
                end={{ x: 0, y: 0.5 }}
              >
                <Pressable style={[styles.button]} onPress={handleUpdate}>
                  {loading ? (
                    <Image
                      source={require("../assets/gifs/loader.gif")}
                      style={styles.image}
                    />
                  ) : (
                    <Text style={styles.buttonText}> Save </Text>
                  )}
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    position: "relative",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").height * 0.08,
    height: Dimensions.get("window").height * 0.08,
    marginVertical: -15,
  },
  buttonContainer: {
    flexDirection: "row",
    borderColor: "#074A74",
    borderWidth: 1,
    borderRadius: 3,
    width: Dimensions.get("window").width *0.9,
    paddingVertical: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    borderRadius: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
    fontSize: 18,
  },
  hamburger: {
    marginTop: 80,
    marginRight: 24,
  },
  cards: {
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  main: {
    flex: 3,
    backgroundColor: "#fff",
  },
  title: {
    marginHorizontal: 15,
    fontSize: 25,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
    marginBottom: 20,
    marginTop: 30,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
  container2: {
    backgroundColor: "#fff",
    width: 140,
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label2: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#72788D",
  },
  selectedTextStyle: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#72788D",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    color: "#72788D",
  },
});
