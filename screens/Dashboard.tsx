import {
  Pressable,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  BackHandler,
  Platform,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
  RefreshControl,
  Image,
  Dimensions,
} from "react-native";
import { Button, Overlay, Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import {
  SuccessSvg,
  FailSvg,
  LogOut,Debited,Credited,
  User,
  Warning,
} from "../assets/svgs/svg";
import Header from "../components/Header";
import React, { useState, createRef, useEffect, useContext, } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import {
  DrawerParamList, 
} from "../types";
import Cards from "../components/Cards";
import SideMenu from "./SideMenu";
import { AuthContext } from "../context/AuthContext";
import {OrderContext} from "../context/OrderContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FlatList } from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import axios from "axios";
import { useFeatures } from "flagged";

type Props = DrawerScreenProps<DrawerParamList, "Home">;

export default function Dashboard({ navigation, route }: Props) {
  const { authData, setAuthData, showLoader, setShowLoader } =
    useContext(AuthContext);
  const {
    setOrderRequest,
    orderRequest,
    fetchOrderRequestContext,
    showLoader2,
  } = useContext(OrderContext);
  const [exitApp, setExitApp] = useState(1);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const [modalResponse, setModalResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [onBoarded, setOnBoarded] = useState(null);
  const [type, setType] = useState("");
  const [latefee, setlateFee] = useState(null);
  const [orders, setOrders] = useState(null)
  const amortization = orders?.included?.amortizations;
  const lateFees = orders?.included?.late_fees;
  const [uploaded, setUploaded] = useState(null);

  const toggleSideMenu = async () => {
    navigation.toggleDrawer();
  };

  const features = useFeatures();

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
  const fetchOrder = async () => {
    setShowLoader(true);
    try {
      let response = await axios({
        method: "GET",
        url: `/customers/${authData.user.id}/orders`,
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const order = response.data.data[0].included.orders[0];
      setOrders(order)
      
      const checkLateFee = order.some(function (item) {
           const lateFees = item?.included?.late_fees;
           const lateFeeDebt =
             lateFees?.reduce((accumulator, object) => {
               return accumulator + Number(object.amount_due);
             }, 0) -
             lateFees.reduce((accumulator, object) => {
               return accumulator + Number(object.amount_paid);
             }, 0);
           return item?.included?.late_fees.length > 0 && lateFeeDebt != 0;
      });
      setlateFee(checkLateFee);
    } catch (error: any) {}
  };
  function handleRequest(res: any, status: String, type: string) {
    status === "success" ? setIsError(false) : setIsError(true);
    setModalResponse(res);
    setType(type);
    
    setModalVisible(true);
  }

  const settUser = async () => {
    fetchOrder()
    fetchOrderRequestContext();
    setUser(authData?.user);
    setOnBoarded(authData?.user?.attributes?.on_boarded);
    const upload = Object?.values(authData?.user?.included?.verification || {'item': false}).every(
      (val) => val
    );
    setUploaded(upload);
    setShowLoader(true)
    setRefreshing(false);
  };
  const navigating = (first_choice, second_choice) => {
    if (!onBoarded) {
      return first_choice;
    }
    if ((onBoarded && !uploaded) || onBoarded) {
      return second_choice;
    }
  };
  const viewDetail = (item)=>{

  }
  const trackOrder = () => {
    navigation.navigate("OrderDetails", orders);
  };
  let totalDebt: number;
  	let paid_repayment = amortization?.map((item: { actual_amount: number }) => {
      return item.actual_amount;
    });
   let expected_repayment = amortization?.map(
     (item: { expected_amount: number }) => {
       return item.expected_amount;
     }
   );
   let total_expected_repayment = expected_repayment?.reduce((total, item) => {
     return total + item;
   });
   let totalPaid = paid_repayment?.reduce((total, item) => {
     return total + item;
   }); 
  totalDebt = total_expected_repayment - totalPaid;
  const progressBar =
    (totalPaid + orders?.attributes?.down_payment / total_expected_repayment) *
    100;
    const nextRepayment = amortization.find((payment) =>  payment.actual_amount== 0);
    console.log(nextRepayment);
  const recentActivities = [
    {
      id: '1',
      name: "Monthly Repayment",
      date: "01/11/2023",
      amount: "₦9,600",
    },
    {
      id: '2',
      name: "Monthly Repayment",
      date: "01/11/2023",
      amount: "₦9,500",
    },
    {
      id: '3',
      name: "Loan Approved",
      date: "01/11/2023",
      amount: "₦100,000",
    },
  ];
  const navigateHistory =()=>{
    const lateOrder = orders.find((order) =>{
      const lateFees = order?.included?.late_fees
      const lateFeeDebt = lateFees?.reduce((accumulator, object) => {
          return accumulator + Number(object.amount_due);
        }, 0) -
        lateFees.reduce((accumulator, object) => {
          return accumulator + Number(object.amount_paid);
        }, 0);
      return order?.included?.late_fees.length > 0 && lateFeeDebt != 0;
      });
    navigation.navigate("OrderDetails", lateOrder );
    
  }
  

  useEffect(() => {
    settUser();
  }, [authData,]);
    useEffect(() => {
      fetchOrder();
    }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={settUser} />
      }
    >
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

                <Text style={styles.errText}>
                  {modalResponse?.error_message}
                </Text>
              </View>
            </View>
          </View>
        )}
      </Modal>
      <View style={styles.header}>
        <Header navigation={navigation}></Header>
        <TouchableOpacity>
          <Pressable onPress={toggleSideMenu}>
            <Hamburger style={styles.hamburger} />
          </Pressable>
        </TouchableOpacity>
      </View>

      {!showLoader || showLoader2 ? (
        <Image
          source={require("../assets/gifs/loader.gif")}
          style={styles.image}
        />
      ) : (
        <View style={styles.main}>
          <Text style={styles.name}>
            {navigating("Hello ☺️", user?.attributes?.first_name)},
          </Text>
          <Text style={styles.message}>Welcome to your altara dashboard </Text>
          {!uploaded && (
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
                  <Text style={{ color: "#474A57", fontSize: 14 }}>
                    To fully activate your account please{" "}
                    {navigating(
                      " complete your profile",
                      "upload your document"
                    )}
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
                {!onBoarded && (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("CreateProfile", {
                        user: authData.user,
                      })
                    }
                  >
                    <Text
                      style={{
                        color: "#074A74",
                        fontFamily: "Montserrat_700Bold",
                        fontSize: 12,
                      }}
                    >
                      Complete your profile
                    </Text>
                  </Pressable>
                )}
                {onBoarded && !uploaded && (
                  <Pressable
                    onPress={() => {
                      navigation.navigate("UploadDocument", {
                        user: authData.user,
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: "#074A74",
                        fontFamily: "Montserrat_700Bold",
                        fontSize: 12,
                      }}
                    >
                      Upload your document
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
          {latefee && (
            <Pressable onPress={navigateHistory}>
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
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Warning />
                    <Text style={{ color: "#474A57", fontSize: 14 }}>
                      Your loan repayment is{" "}
                      <Text style={{ color: "red" }}>overdue</Text>
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
                  <Text
                    style={{
                      color: "#074A74",
                      fontFamily: "Montserrat_700Bold",
                      fontSize: 12,
                    }}
                  >
                    Check Order History
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          <View style={styles.cards}>
            <Cards
              title="Loan Balance"
              amount={
                totalDebt <= 0
                  ? 0
                  : `₦${totalDebt
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              }
              progressBar={progressBar}
              next_repayment={nextRepayment}
              type="cash"
              onRequest={handleRequest}
              trackOrder={trackOrder}
              isDisabled={!onBoarded}
              width={!onBoarded ? 300 : 0}
              height={!onBoarded ? 150 : 0}
              navigation={navigation}
            />
          </View>
          <Text style={styles.name}>Recent Activities</Text>
          <FlatList
            scrollEnabled={true}
            data={recentActivities}
            keyExtractor={(item) => item.id}
            extraData={recentActivities}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={fetchOrder} />
            // }
            renderItem={({ item }) => (
              <View style={{ backgroundColor: "transparent" }}>
                <Pressable onPress={() => viewDetail(item)}>
                  <View style={styles.order}>
                    <View style={styles.details}>
                      {item.name.includes("Approved") ? (
                        <Credited />
                      ) : (
                        <Debited />
                      )}
                      <View style={styles.title}>
                        <Text
                          style={{
                            color: "#333333",
                            fontFamily: "Montserrat_600SemiBold",
                          }}
                          numberOfLines={1}
                          ellipsizeMode={"tail"}
                        >
                          {item.name}{" "}
                        </Text>
                        <Text style={{ color: "#000", fontSize: 11 }}>
                          {item?.date}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 13,
                        marginRight: 59,
                        fontFamily: "Montserrat_600SemiBold",
                      }}
                    >
                      {item?.amount}
                    </Text>
                  </View>
                </Pressable>
              </View>
            )}
          />
        </View>
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
    width: Dimensions.get("window").height * 0.2,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "#EFF5F9",
    marginTop: Dimensions.get("window").height * 0.2,
    left: Dimensions.get("window").width * 0.25,
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
    backgroundColor: "#fff",
    marginLeft: 10,
    width: "65%",
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
    marginTop: 20,
  },
  name: {
    marginHorizontal: 30,
    fontSize: 20,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
  },
  message: {
    fontFamily: "Montserrat_400Regular",
    marginTop: 0,
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
  details: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  order: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginLeft: 26,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  errText: {
    fontSize: 15,
    marginTop: 20,
    paddingHorizontal: 15,
    textAlign: "center",
    color: "#000",
  },
});
