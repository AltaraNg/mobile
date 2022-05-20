import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Touchable,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
  Platform,
  ScrollView,
  Modal,
  TouchableHighlight,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Button, Overlay, Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, RootTabParamList } from "../types";
import Cards from "../components/Cards";
import SideMenu from "./SideMenu";
import { FolderPlus, Rental, ProductLoan } from "../assets/svgs/svg";
import { AuthContext } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;
type Props = NativeStackScreenProps<RootTabParamList, "OrderRequest">;

export default function History({ navigation, route }: Props) {
  const { authData } = useContext(AuthContext);
  const [orderRequests, setOrderRequests] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const styleSVG = (item: any) => {
    if (item.status == 'approved') {
      return "#074A74";
    }
    if (item.status == 'pending' || item.status == 'processing') {
      return "#FDC228";
    }
    if (item.status == 'denied') {
      return "#FF4133";
    }
  };
  const toggleSideMenu = async () => {
    navigation.toggleDrawer();
  };

  const fetchOrderRequest = async () => {
    setShowLoader(true);
    try {
      let response = await axios({
        method: "GET",
        url: `/customers/${authData.user.id}/requests`,
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setShowLoader(false);
      const orderRequest = response.data.data.order_requests;
      setOrderRequests(orderRequest);
    } catch (error: any) {}
  };
  const viewDetail = (order) => {
    
  };

  useEffect(() => {
    fetchOrderRequest();
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
        <Text style={styles.name}>Order Request</Text>
        {showLoader ? (
          <Image
            source={require("../assets/gifs/loader.gif")}
            style={styles.image}
          />
        ) : (
          <View
            style={{
              backgroundColor: "#fff",
              marginBottom: 60,
            }}
          >
            {orderRequests?.length > 0 ? (
              <FlatList
                scrollEnabled={true}
                data={orderRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: "#fff" }}>
                    <Pressable onPress={() => viewDetail(item)}>
                      <View style={styles.order}>
                        <View style={styles.details}>
                          <FolderPlus color={styleSVG(item)} />
                          <View style={styles.title}>
                            <Text
                              style={{
                                color: "#074A74",
                                fontFamily: "Montserrat_700Bold",
                              }}
                              numberOfLines={1}
                              ellipsizeMode={"tail"}
                            >
                              {item.order_type}{" "}
                            </Text>
                            <Text style={{ color: "#000", fontSize: 12 }}>
                              Status: {item?.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ color: "#000", fontSize: 13, paddingRight:10 }}>
                          {new Date(item?.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "#fff",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../assets/images/zerostate2.png")}
                  style={styles.image}
                />
                <Text style={{ color: "black" }}>No History</Text>
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
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    backgroundColor: "#F9FBFC",
    marginLeft: 10,
    width: "65%",
  },
  details: {
    backgroundColor: "#F9FBFC",
    flexDirection: "row",
    alignItems: "center",
  },
  order: {
    backgroundColor: "#F9FBFC",
    flexDirection: "row",
    marginLeft: 26,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 7,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
  name: {
    marginHorizontal: 30,
    fontSize: 25,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
    marginBottom: 60,
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
    paddingHorizontal: 10,
    marginTop: "auto",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  modalContent: {
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  verticleLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
});
