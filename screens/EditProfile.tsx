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
  FlatList,
  ScrollView,
  Button
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { SuccessSvg, FailSvg, LogOut, Calender } from "../assets/svgs/svg";
import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import {CheckBox} from "react-native-elements"
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
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Enter Date");
  const [uploaded, setUploaded] = useState(null);
  const onChange= (event, selectedDate)=>{
    const currentDate = selectedDate|| date;
    setShow(Platform.OS == 'ios')
    setDate(currentDate)
    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    setText(fDate);
    setUser({ ...user, date_of_birth: selectedDate });

  }
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
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
      const res = result.data.data[0];
      setUser(res.attributes);
      setOnBoarded(res?.attributes?.on_boarded);
       const upload = Object.values(res?.included?.verification || {}).every(
         (val) => val === true
       );
       setUploaded(upload);
      uploaded && navigation.navigate("View Profile", {user:user})
      !uploaded && navigation.navigate("Upload Document", {user:user});
		} catch (error) {
			ToastAndroid.showWithGravity(
				'Error! Request was not completed, Please complete all fields',
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
  const displayDate =(user)=>{
    if(user !== 'N/A'){
      var date = new Date(user).toLocaleDateString();
      return date;
    }else return "Enter Date";
    
  }
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
      {user && (
        <View style={styles.main}>
          <Text style={styles.title}>
            {!onBoarded ? "Create" : "Edit"} Profile
          </Text>
          {!onBoarded && (
            <Text style={styles.simple}>We want to know you better</Text>
          )}
          <ScrollView
            style={{
              backgroundColor: "white",
              overflow: "scroll",
              paddingTop: 10,
            }}
          >
            <View style={{ backgroundColor: "white", paddingHorizontal: 15 }}>
              <View style={styles.data}>
                <Text
                  style={[
                    styles.label,
                    { width: Dimensions.get("window").width * 0.92 },
                  ]}
                >
                  {" "}
                  First Name{" "}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { width: Dimensions.get("window").width * 0.92 },
                  ]}
                  value={prefilledData(user.first_name)}
                  onChangeText={(txt) => setUser({ ...user, first_name: txt })}
                ></TextInput>
              </View>
              <View style={styles.data}>
                <Text
                  style={[
                    styles.label,
                    { width: Dimensions.get("window").width * 0.92 },
                  ]}
                >
                  {" "}
                  Last Name{" "}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { width: Dimensions.get("window").width * 0.92 },
                  ]}
                  value={prefilledData(user.last_name)}
                  onChangeText={(txt) => setUser({ ...user, last_name: txt })}
                ></TextInput>
              </View>
              <View style={styles.data}>
                <Text style={styles.label}> Phone Number </Text>
                <TextInput
                  style={[
                    styles.input,
                    { width: Dimensions.get("window").width * 0.92 },
                  ]}
                  onChangeText={(txt) =>
                    setUser({ ...user, phone_number: txt })
                  }
                >
                  {prefilledData(user.phone_number)}
                </TextInput>
              </View>
            </View>

            {!onBoarded && (
              <View
                style={{
                  backgroundColor: "#fff",
                  width: Dimensions.get("window").width,
                  paddingHorizontal: 15,
                }}
              >
                <View
                  style={[
                    styles.row,
                    {
                      width: Dimensions.get("window").width * 0.92,
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <View style={[styles.data]}>
                    <Text style={styles.label}> Gender </Text>

                    <View style={{ backgroundColor: "white" }}>
                      <RadioButton
                        value={prefilledData(user.gender)}
                        data={gender}
                        onSelect={(txt: any) =>
                          setUser({ ...user, gender: txt })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.data}>
                    <Text
                      style={[
                        styles.label,
                        { width: Dimensions.get("window").width * 0.42 },
                      ]}
                    >
                      {" "}
                      Date of Birth{" "}
                    </Text>
                    <View
                      style={[
                        styles.input,
                        {
                          width: Dimensions.get("window").width * 0.42,
                          height: 45,
                          paddingTop: 10,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onPress={() => showMode("date")}
                      >
                        <Text style={{ color: "#444" }}>
                          {displayDate(user.date_of_birth)}
                        </Text>
                        <Calender />
                      </TouchableOpacity>
                    </View>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.data}>
                  <Text
                    style={[
                      styles.label,
                      { width: Dimensions.get("window").width * 0.92 },
                    ]}
                  >
                    {" "}
                    Street Name{" "}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { width: Dimensions.get("window").width * 0.92 },
                    ]}
                    onChangeText={(txt) =>
                      setUser({ ...user, add_street: txt })
                    }
                  >
                    {prefilledData(user.add_street)}
                  </TextInput>
                </View>
                <View style={styles.data}>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      width: Dimensions.get("window").width * 0.92,
                    }}
                  >
                    <Text style={styles.label}>City</Text>
                    <Dropdown
                      style={[styles.input, isFocus && { borderColor: "blue" }]}
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

                <View style={styles.row}>
                  <View
                    style={[
                      styles.data,
                      { width: Dimensions.get("window").width * 0.46 },
                    ]}
                  >
                    <View style={styles.container2}>
                      <Text style={styles.label}>Employment Status</Text>
                      <Dropdown
                        style={[
                          styles.input2,
                          { width: Dimensions.get("window").width * 0.46 },
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
                  <View
                    style={[
                      styles.data,
                      { width: Dimensions.get("window").width * 0.46 },
                    ]}
                  >
                    <View style={styles.container2}>
                      <Text style={styles.label}>Civil Status</Text>
                      <Dropdown
                        style={[
                          styles.input2,
                          { width: Dimensions.get("window").width * 0.46 },
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
                backgroundColor: "#fff",
                marginBottom: 60,
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
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: Dimensions.get("window").width * 0.92,
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
    borderRadius: 3,
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
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 2,
    borderColor: "#aaa",
    paddingHorizontal: 10,
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
  },
  input2: {
    backgroundColor: "#E8EBF7",
    color: "#72788D",
    marginRight: 25,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderRadius: 2,
    borderColor: "#aaa",
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
    backgroundColor: "#fff",
    marginBottom: 20,
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
    flex: 4,
    backgroundColor: "#fff",
  },
  title: {
    marginHorizontal: 15,
    fontSize: 25,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
    marginBottom: 5,
    marginTop: 2,
  },
  menu: {
    position: "absolute",
    right: 0,
  },
  simple: {
    fontFamily: "Montserrat_400Regular",
    marginHorizontal: 20,
    fontSize: 14,
    color: "#72788D",
    marginBottom:20,
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
