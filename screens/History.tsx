import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import { RootStackParamList, RootTabParamList } from "../types";

import { ELoan, Rental, ProductLoan } from "../assets/svgs/svg";
import { AuthContext } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import axios from "axios";
import { FlatList } from "react-native";

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
    // if(orders.length){
    //   return;
    // }
    fetchOrder();
    // return () => mounted = false;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header navigation={navigation}></Header>
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
            style={styles.image2}
          />
        ) : (
          <View
            style={{
              backgroundColor: "#fff",
              marginBottom: 100,
            }}
          >
            {refreshing ? <ActivityIndicator /> : null}
            {orders?.length > 0 ? (
              <FlatList
                scrollEnabled={true}
                data={orders}
                keyExtractor={(item) => item.id}
                extraData={orders}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchOrder}
                  />
                }
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: "#fff" }}>
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
                        <Text
                          style={{
                            color: "#000",
                            fontSize: 13,
                            marginRight: 59,
                          }}
                        >
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
    backgroundColor: "white",

  },
  image: {
    width: Dimensions.get("window").height * 0.46,
    height: Dimensions.get("window").height * 0.46,
  },
  image2: {
    width: Dimensions.get("window").height * 0.2,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#fff",
    position: "absolute",
    top: Dimensions.get("window").height * 0.2,
    left: Dimensions.get("window").width * 0.25,
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
    backgroundColor: "#fff",
    marginLeft: 10,
    width: "65%",
  },
  details: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    
  },
  order: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginLeft: 26,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 7,
    paddingRight: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  main: {
    flex: 3,
    backgroundColor: "#fff",
    marginTop:40

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
