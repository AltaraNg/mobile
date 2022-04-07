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
import { ELoan, Rental, ProductLoan } from "../assets/svgs/svg";
import { Context as AuthContext } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;
type Props = NativeStackScreenProps<RootTabParamList, "History">;

export default function History({ navigation, route }: Props) {
  const { state } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [exitApp, setExitApp] = useState(1);
  const [pressedOrder, setPressedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [OrderStatus, setOrderStatus] = useState("")
  const styleSVG = (item:any) => {
    const totalDebt =
      item?.attributes?.repayment -
      item?.included?.amortizations.reduce((accumulator, object) => {
        return accumulator + object.actual_amount;
      }, 0);
    const Today = new Date()
    const expiryDate = new Date(
      item?.included?.amortizations.find(
        (item) => item.actual_amount == 0
      )?.expected_payment_date
    )

    if (totalDebt <= 0 ) {
      return "#074A74";
    }
    if (totalDebt > 0 && Today < expiryDate) {
      return "#FDC228";
    } else {
      return "#FF4133";
    }
   
  };
  const toggleSideMenu = async () => {
    navigation.toggleDrawer();
  };

  const fetchOrder = async () => {
    try {
      let response = await axios({
        method: "GET",
        url: `/customers/${state.user.id}/orders`,
        headers: { Authorization: `Bearer ${state.token}` },
      });

      const order = response.data.data[0].included.orders;
      setOrders(order);
      console.log(order)
    } catch (error: any) {}
  };
  const viewDetail = (item) => {
    setModalVisible(true);
    setPressedOrder(item);
  };
  const monthlyRepayment= (props)=>{

	  return props?.item?.included?.amortizations[0].expected_amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const orderStatus =(props)=>{
	const totalDebt = props?.item?.attributes?.repayment - props?.item?.included?.amortizations.reduce((accumulator, object) => {
        return accumulator + object.actual_amount;
      }, 0) 
	  const Today = new Date()
	  const expiryDate = new Date(
      props?.item?.included?.amortizations.find(
        (item) => item.actual_amount == 0
      )?.expected_payment_date
    )
	
	  if (totalDebt <= 0 ) {
      return "Completed";
    }
	  if ((totalDebt > 0) && (Today < expiryDate) ){
		  return 'In Progress'
	  }else  {
		  return 'Overdue'
	  }
	 
     
  }
  const styleStatus= (props)=>{
	  if (orderStatus(props) == 'Completed'){
		  return {
        backgroundColor: "#d0dce4",
        color: "#074a74",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        fontFamily: "Montserrat_700Bold",
      };
	  }
	  	  if (orderStatus(props) == "In Progress") {
          return {
            backgroundColor: "#fff4d4",
            color: "#FDC228",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            fontFamily: "Montserrat_700Bold",
          };
        }
			  if (orderStatus(props) == "Overdue") {
          return {
            backgroundColor: "#ffd4d4",
            color: "#DB2721",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            fontFamily: "Montserrat_700Bold",
          };
        }
  }

  const nextRepayment =(props:Object)=>{
	 const nextDate = props?.item?.included?.amortizations.find((item)=>  item.actual_amount == 0)
	return nextDate?.expected_payment_date || 'Completed'
  }

  const OrderDetails = function (props: any) {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          style={{
            justifyContent: "flex-end",
            margin: 0,
            position: "relative",
          }}
        >
          <TouchableHighlight
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              borderRadius:
                Math.round(
                  Dimensions.get("window").width +
                    Dimensions.get("window").height
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

          <View style={styles.modalContainer}>
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
            >
              <View style={styles.modalContent}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ backgroundColor: "#fff" }}>
                    <Text style={{ color: "#000", fontSize: 11 }}>
                      Order ID: {props?.item?.attributes?.order_number}
                    </Text>
                    <Text
                      style={{
                        color: "#000",
                        fontFamily: "Montserrat_700Bold",
                        width: 230,
                        fontSize: 11,
                      }}
                    >
                      {props?.item?.included?.product?.name}{" "}
                    </Text>
                  </View>
                  <Text style={styleStatus(props)}>{orderStatus(props)}</Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#000",
                      width: Dimensions.get("window").width * 0.25,
                    }}
                  >
                    {props?.item?.included?.order_type?.name}{" "}
                    {props?.item?.included?.down_payment_rate?.percent}% Rate @{" "}
                    {props?.item?.included?.repayment_duration?.name}
                  </Text>
                  <View style={styles.verticleLine}></View>
                  <View style={{ backgroundColor: "white", marginLeft: 5 }}>
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width * 0.65,
                        marginBottom: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: "#474a57",
                          fontFamily: "Montserrat_400Regular",
                          fontSize: 12,
                        }}
                      >
                        Downpayment:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#000",
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 14,
                        }}
                      >
                        ₦
                        {props?.item?.attributes?.down_payment
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width * 0.65,
                        marginBottom: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: "#474a57",
                          fontFamily: "Montserrat_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {props?.item?.included?.repayment_cycle?.name
                          .charAt(0)
                          .toUpperCase() +
                          props?.item?.included?.repayment_cycle?.name.slice(
                            1
                          )}{" "}
                        Repayment:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#000",
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 14,
                        }}
                      >
                        ₦{monthlyRepayment(props)}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width * 0.65,
                        marginBottom: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: "#474a57",
                          fontFamily: "Montserrat_400Regular",
                          fontSize: 12,
                        }}
                      >
                        Product Price:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#000",
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 14,
                        }}
                      >
                        ₦
                        {props?.item?.attributes?.product_price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width * 0.65,
                        marginBottom: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: "#474a57",
                          fontFamily: "Montserrat_400Regular",
                          fontSize: 12,
                        }}
                      >
                        Total Debt:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#000",
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 14,
                        }}
                      >
                        ₦
                        {Math.floor(
                          props?.item?.included?.amortizations.reduce(
                            (accumulator, object) => {
                              return accumulator + object.expected_amount;
                            },
                            0
                          ) -
                            props?.item?.included?.amortizations.reduce(
                              (accumulator, object) => {
                                return accumulator + object.actual_amount;
                              },
                              0
                            )
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "white",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width * 0.65,
                        marginBottom: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: "#474a57",
                          fontFamily: "Montserrat_400Regular",
                          fontSize: 12,
                        }}
                      >
                        Total Amount Paid:{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#000",
                          fontFamily: "Montserrat_700Bold",
                          fontSize: 14,
                        }}
                      >
                        ₦
                        {Math.floor(
                          props?.item?.attributes?.down_payment +
                            props?.item?.included?.amortizations.reduce(
                              (accumulator, object) => {
                                return accumulator + object.actual_amount;
                              },
                              0
                            )
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomColor: "gray",
                    borderBottomWidth: 1,
                    marginTop: 3,
                  }}
                />
                <View style={{ backgroundColor: "white" }}>
                  <Text style={{ color: "black" }}>
                    Next Repayment:{" "}
                    <Text
                      style={{
                        color: "black",
                        fontFamily: "Montserrat_700Bold",
                      }}
                    >
                      {nextRepayment(props)}
                    </Text>
                    {}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <View style={styles.container}>
      <Overlay
        // ModalComponent={Modal}
        isVisible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(!modalVisible);
        }}
      />

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
        {orders && (
          <FlatList
            scrollEnabled={true}
            data={orders}
            keyExtractor={(item) => item.id}
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
                <OrderDetails item={pressedOrder} />
              </View>
            )}
          />
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
