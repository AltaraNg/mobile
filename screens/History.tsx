import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
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
import { ELoan, Rental, ProductLoan } from "../assets/svgs/svg";
import { AuthContext } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;
type Props = NativeStackScreenProps<RootTabParamList, "History">;

export default function History({ navigation, route }: Props) {
  const [refreshing, setRefreshing] = useState(true)
  const { authData } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [pressedOrder, setPressedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  let mounted = true;
  const styleSVG = (item: any) => {
    const totalDebt =
      item?.included?.amortizations.reduce(
        (accumulator, object) => {
          return accumulator + object.expected_amount;
        },
        0
      ) -
      item?.included?.amortizations.reduce((accumulator, object) => {
        return accumulator + object.actual_amount;
      }, 0);
    const Today = new Date()
    const expiryDate = new Date(
      item?.included?.amortizations.find(
        (item) => item.actual_amount == 0
      )?.expected_payment_date
    )

    if (totalDebt <= 0) {
      return "#074A74";
    }
    if (totalDebt > 0 && Today < expiryDate) {
      return "#FDC228";
    }
    if (totalDebt > 0 && Today > expiryDate) {
      return "#FF4133";
    }

  };
  const toggleSideMenu = async () => {
    navigation.toggleDrawer();
  };

  const fetchOrder = async () => {
    setShowLoader(true);
    console.log('u called me')
    try {
      let response = await axios({
        method: "GET",
        url: `/customers/${authData.user.id}/orders`,
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setShowLoader(false);
      setRefreshing(false);
      const order = response.data.data[0].included.orders;
      setOrders(order);

    } catch (error: any) {
     }
  };
  const viewDetail = (order) => {
    navigation.navigate('OrderDetails', order);
  };


  useEffect(() => {
    if(orders.length){
      return;
    }
    fetchOrder();
    return () => mounted = false;
  }, [alert, orders]);
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
        <Text style={styles.name}>{"History"}</Text>
        {showLoader ? (
          <Image
            source={require("../assets/gifs/loader.gif")}
            style={styles.image}
          />
        ) : (
          <View
            style={{
              backgroundColor: "#EFF5F9",
              marginBottom: 60,
            }}
          >
            {refreshing ? <ActivityIndicator /> : null}
            {orders?.length > 0 ? (
              <FlatList
                scrollEnabled={true}
                data={orders}
                keyExtractor={(item) => item.id}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={fetchOrder} />
                }
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: "#EFF5F9" }}>
                    <Pressable onPress={() => viewDetail(item)}>
                      <View style={styles.order}>
                        <View style={styles.details}>
                          <ELoan color={styleSVG(item)} />
                          <View style={styles.title}>
                            <Text
                              style={{
                                color: "#074A74",
                                fontFamily: "Montserrat_700Bold",
                              }}
                              numberOfLines={1}
                              ellipsizeMode={"tail"}
                            >
                              {item.included.product.name}{" "}
                            </Text>
                            <Text style={{ color: "#000", fontSize: 12 }}>
                              Order ID: {item?.attributes?.order_number}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ color: "#000", fontSize: 13 }}>
                          {item?.attributes?.order_date}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "#EFF5F9",
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
    backgroundColor: "#EFF5F9",
    flexDirection: "column",
    alignItems: "center",
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
    flexDirection: "row",
    marginLeft: 26,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
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
