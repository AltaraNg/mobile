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
  Button
} from "react-native";
import DatePicker from "react-native-date-picker";
import { LinearGradient } from "expo-linear-gradient";
import { SuccessSvg, FailSvg, LogOut } from "../assets/svgs/svg";
import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel}  from "react-native-simple-radio-button";
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

type Props = NativeStackScreenProps<RootTabParamList, "Dashboard">;
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

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
  }
	const handleUpdate = async () => {
    setLoading(true);
		try {
			let result = await axios({
				method: 'PATCH',
				url: `/customers/${authData.user.id}`,
				headers: { Authorization: `Bearer ${authData.token}` },
				data: user,
			});
      setLoading(false);
			ToastAndroid.showWithGravity(
				'Profile updated successfully',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
      navigation.navigate('View Profile');
		} catch (error) {
			ToastAndroid.showWithGravity(
				'Error! Request was not completed',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
      setLoading(false);
		}
	};

	const fetchUser = async () => {
		try {
			let response = await axios({
				method: 'GET',
				url: `/auth/user`,
				headers: { 'Authorization': `Bearer ${authData.token}` },
			});
			const user = response.data.data[0].attributes;
			setUser(user);
      setOnBoarded(user?.on_boarded);
		} catch (error: any) {
			ToastAndroid.showWithGravity(
				'Unable to fetch user',
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
		}
	};
   
  const prefilledData = (data) => {
    return data == "N/A" ? "" : data;
  };
  const gender = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const city = [
    { label: "Apata, Ibadan", value: "Apata" },
    { label: "Dugbe, Ibadan", value: "Dugbe" },
    { label: "Gate, Ibadan", value: "Gate" },
    { label: "Bodija, Ibadan", value: "Bodija" },
    { label: "Iwo Road, Ibadan", value: "Iwo" },
    { label: "Challenge, Ibadan", value: "Challenge" },
    { label: "Iyana church, Ibadan", value: "Iyana_church" },
    { label: "Oyo Town", value: "Oyo" },
    { label: "Ogbomosho", value: "Ogbomosho" },
    { label: "Yoruba Road, Ilorin", value: "Yoruba_Road" },
    { label: "Gambari, Ilorin", value: "Gambari" },
    { label: "Taiwo Road, Ilorin", value: "Taiwo" },
  ];
  const civil_status = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
  ];
   const employment_status = [
     { label: "Employed", value: "Employed" },
     { label: "Self Employed", value: "Self_employed" },
   ];
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
        <ScrollView style={{ backgroundColor: "#EFF5F9" }}>
          <View style={styles.main}>
            <Text style={styles.title}>
              {!onBoarded ? "Create" : "Edit"} Profile
            </Text>
            <View style={styles.data}>
              <Text style={styles.label}> First Name </Text>
              <TextInput
                style={styles.input}
                value={prefilledData(user.first_name)}
                onChangeText={(txt) => setUser({ ...user, first_name: txt })}
              ></TextInput>
            </View>
            <View style={styles.data}>
              <Text style={styles.label}> Last Name </Text>
              <TextInput
                style={styles.input}
                value={prefilledData(user.last_name)}
                onChangeText={(txt) => setUser({ ...user, last_name: txt })}
              ></TextInput>
            </View>
            <View style={styles.data}>
              <Text style={styles.label}> Phone Number </Text>
              <TextInput
                style={styles.input}
                onChangeText={(txt) => setUser({ ...user, phone_number: txt })}
              >
                {prefilledData(user.phone_number)}
              </TextInput>
            </View>

            {!onBoarded && (
              <View style={{ backgroundColor: "#EFF5F9" }}>
                <View style={styles.row}>
                  <View style={styles.data}>
                    <Text style={styles.label}> Gender </Text>
                    <RadioForm
                      radio_props={gender}
                      initial={-1}
                      formHorizontal={true}
                      labelHorizontal={true}
                      buttonColor={"#074A77"}
                      animation={true}
                      onPress={(txt) => setUser({ ...user, gender: txt })}
                    />
                  </View>
                  <View style={styles.data}>
                    <View style={styles.container2}>
                      <Text style={styles.label}>City</Text>
                      <Dropdown
                        style={[
                          styles.input2,
                          isFocus && { borderColor: "blue" },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={city}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? "Select item" : "..."}
                        searchPlaceholder="Search..."
                        value={user.city}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(txt) => {
                          setUser({ ...user, city: txt.value });
                          setIsFocus(false);
                        }}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.data}>
                  <Text style={styles.label}> Street Name </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(txt) =>
                      setUser({ ...user, add_street: txt })
                    }
                  >
                    {prefilledData(user.add_street)}
                  </TextInput>
                </View>
                <View style={styles.data}>
                  <Text style={styles.label}> Date of Birth </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(txt) =>
                      setUser({ ...user, date_of_birth: txt })
                    }
                  >
                    {prefilledData(user.date_of_birth)}
                  </TextInput>
                </View>
                <View style={styles.row}>
                  <View style={styles.data}>
                    <View style={styles.container2}>
                      <Text style={styles.label}>Employment Status</Text>
                      <Dropdown
                        style={[
                          styles.input2,
                          isFocus && { borderColor: "blue" },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={employment_status}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        value={user.employment_status}
                        placeholder={!isFocus ? "Select item" : "..."}
                        searchPlaceholder="Search..."
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(txt) => {
                          setUser({ ...user, employment_status: txt.value });
                          setIsFocus(false);
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.data}>
                    <View style={styles.container2}>
                      <Text style={styles.label}>Civil Status</Text>
                      <Dropdown
                        style={[
                          styles.input2,
                          isFocus && { borderColor: "blue" },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={civil_status}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? "Select item" : "..."}
                        searchPlaceholder="Search..."
                        value={user.civil_status}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(txt) => {
                          setUser({ ...user, civil_status: txt.value });
                          setIsFocus(false);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EFF5F9",
                marginBottom: 15,
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
    backgroundColor: "#EFF5F9",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#EFF5F9",
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 30,
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
    borderRadius: 10,
    width: 250,
    paddingVertical: 10,
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
    paddingVertical: 5,
    borderColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  input2: {
    backgroundColor: "#E8EBF7",
    color: "#72788D",
    marginRight: 25,
    paddingVertical: 5,
    borderColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: 140,
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  label: {
    color: "#000",
    fontFamily: "Montserrat_500Medium",
    paddingBottom: 3,
    fontSize: 13,
  },
  data: {
    backgroundColor: "#EFF5F9",
    paddingLeft: 30,
    marginBottom: 20,
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
    marginBottom: 20,
    marginTop: 40,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
  container2: {
    backgroundColor: "#EFF5F9",
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
