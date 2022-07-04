import {
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef } from 'react';
import { post } from '../utilities/api';
import { Button, Overlay, Icon } from "react-native-elements";
import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
import Leaf from '../assets/svgs/leaf.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Cards from '../components/Cards';
import { FlatList } from 'react-native-gesture-handler';
import {
	OrderStatusPass,
	OrderStatusFail,
	OrderStatusPending,
	BackButton,
} from '../assets/svgs/svg';
import Animated from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export default function OrderDetails({ navigation, route }: Props) {
  const [lateFee, setLateFee] = useState(true);
  const [viewLateFee, setViewLateFee] = useState(null);
	const order: object = route.params;
	const amortization = order?.included?.amortizations;
  const lateFees = order?.included?.late_fees;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(true);
	let totalDebt, totalPaid: number;

	let newArray = amortization?.map((item: { actual_amount: number }) => {
		return item.actual_amount;
	});
	totalPaid =
		newArray?.reduce((total, item) => {
			return total + item;
		}) + order?.attributes?.down_payment;
	totalDebt = order?.attributes?.down_payment + order?.attributes?.repayment - totalPaid;

	const checkValid = (amor: object) => {
		let answer: boolean;
		amor?.actual_payment_date === null ? (answer = false) : (answer = true);
		return answer;
	};

	const progressBar = ((totalPaid - order?.attributes?.down_payment) / order?.attributes?.repayment) * 100;

	const orderStatusChi = (props) => {
		const totalDebt =
			props?.included?.amortizations.reduce((accumulator, object) => {
				return accumulator + object.expected_amount;
			}, 0) -
			props?.included?.amortizations.reduce((accumulator, object) => {
				return accumulator + object.actual_amount;
			}, 0);
		const Today = new Date();
		const expiryDate = new Date(
			props?.included?.amortizations.find(
				(item) => item.actual_amount == 0
			)?.expected_payment_date
		);

		if (totalDebt <= 0) {
			return 'Completed';
		}
		if (totalDebt > 0 && Today < expiryDate) {
			return 'In Progress';
		}
		if (totalDebt > 0 && Today > expiryDate) {
			return 'Overdue';
		}
	};

	const styleStatus = (props) => {
		if (orderStatusChi(props) == 'Completed') {
			return {
				backgroundColor: '#d0dce4',
				color: '#074a74',
				alignSelf: 'center',
				paddingHorizontal: 10,
				paddingVertical: 6,
				borderRadius: 6,
				fontFamily: 'Montserrat_700Bold',
			};
		}
		if (orderStatusChi(props) == 'In Progress') {
			return {
				backgroundColor: '#fff4d4',
				color: '#FDC228',
				alignSelf: 'center',
				paddingHorizontal: 10,
				paddingVertical: 6,
				borderRadius: 6,
				fontFamily: 'Montserrat_700Bold',
			};
		}
		if (orderStatusChi(props) == 'Overdue') {
			return {
				backgroundColor: '#ffd4d4',
				color: '#DB2721',
				alignSelf: 'center',
				paddingHorizontal: 10,
				paddingVertical: 6,
				borderRadius: 6,
				fontFamily: 'Montserrat_700Bold',
			};
		}
	};
	const nextRepayment = (props: Object) => {
		const nextDate = props?.included?.amortizations.find(
			(item) => item.actual_amount == 0
		);
		return nextDate?.expected_payment_date || 'Completed';
	};
	const orderStatus = (amor: object) => {
		let answer: string;

		let expectedDate = new Date(amor.expected_payment_date);
		let today = new Date();
		if (expectedDate.getTime() > today.getTime() && amor.actual_payment_date === null) {
			answer = 'pending';
			return answer;
		} else if (amor.actual_payment_date === null) {
			answer = 'fail';
		} else {
			answer = 'pass';
		}
		return answer;
	};
	const goBack = () => {
		navigation.goBack();
	};

	return (
    <View style={styles.container}>
      {lateFees?.length > 0 && (
        <View>
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
            {
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.modalHeaderCloseText}>X</Text>
                </TouchableOpacity>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Dear Customer, </Text>
                    <Text style={styles.modalText}>
                      Your loan repayment is <Text style={{color:'red'}}>overdue</Text> and it has led
                      to an extended repayment. Please pay up all your debt
                      completely to avoid further extension
                    </Text>
                  </View>
                </View>
              </View>
            }
          </Modal>
        </View>
      )}
      <View style={styles.header}>
        <View
          style={{
            backgroundColor: "#074A74",
            alignSelf: "center",
            // marginLeft:
          }}
        >
          <Pressable onPress={goBack}>
            <BackButton />
          </Pressable>
        </View>
        <Text style={styles.headerText}>Order Details</Text>
      </View>
      <View style={styles.orderSummary}>
        <View style={styles.orderDetail}>
          <Text
            style={{
              fontFamily: "Montserrat_400Regular",
              color: "#000000",
              fontSize: 11,
            }}
          >
            Order ID: {order?.attributes?.order_number}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 16,
              color: "#000000",
              marginRight: 10,
            }}
          >
            {order?.included?.product.name}
          </Text>
        </View>

        <Text style={styleStatus(order)}>{orderStatusChi(order)}</Text>
      </View>
      <View style={styles.cardContainer}>
        <View
          style={{
            backgroundColor: "rgba(156, 150, 150, 0.55)",

            position: "absolute",
            zIndex: 10,
          }}
        ></View>
        <Leaf style={styles.leaf} />

        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            right: -40,
            width: "50%",
            marginVertical: 8,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "Montserrat_400Regular",
              textAlign: "left",
              alignSelf: "auto",
              textTransform: "capitalize",
              fontSize: 12,
            }}
          >
            next repayment
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "Montserrat_700Bold",
              textAlign: "left",
              textTransform: "capitalize",
              fontSize: 14,
              alignSelf: "auto",
            }}
          >
            {nextRepayment(order)}
          </Text>
        </View>
        <Text
          style={{
            color: "white",
            fontFamily: "Montserrat_400Regular",
            marginTop: 35,
          }}
        >
          Product Price
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "Montserrat_700Bold",
            fontSize: 28,
          }}
        >
          ₦
          {order?.attributes?.product_price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
        <View style={styles.statusBar}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "#007AFF", width: `${progressBar}%` },
            ]}
          />
        </View>

        <View style={styles.repaymentStatus}>
          <Text style={{ color: "white", fontFamily: "Montserrat_400Regular" }}>
            Total Paid{" "}
            <Text style={{ color: "white", fontFamily: "Montserrat_700Bold" }}>
              ₦{totalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </Text>
          <Text style={{ color: "white", fontFamily: "Montserrat_400Regular" }}>
            Total Debt{" "}
            <Text style={{ color: "white", fontFamily: "Montserrat_700Bold" }}>
              ₦
              {totalDebt < 0
                ? 0
                : totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.amortizationContainer}>
        {lateFees?.length > 0 ? (
          <View style={styles.toggle}>
            <LinearGradient
              colors={
                !viewLateFee ? ["#074A74", "#089CA4"] : ["#EEEFF0", "#EEEFF0"]
              }
              style={!viewLateFee ? styles.buttonContainer : [styles.toggleoff]}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
            >
              <Pressable
                style={[styles.button]}
                onPress={() => setViewLateFee(false)}
              >
                <Text
                  style={
                    !viewLateFee
                      ? [styles.buttonText]
                      : {
                          color: "#9C9696",
                          textAlign: "left",
                          fontWeight: "bold",
                          fontSize: 15,
                        }
                  }
                >
                  Repayment
                </Text>
              </Pressable>
            </LinearGradient>
            <LinearGradient
              colors={
                viewLateFee ? ["#074A74", "#089CA4"] : ["#EEEFF0", "#EEEFF0"]
              }
              style={viewLateFee ? styles.buttonContainer : [styles.toggleoff]}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
            >
              <Pressable
                style={[styles.button]}
                onPress={() => setViewLateFee(true)}
              >
                <Text
                  style={
                    viewLateFee
                      ? [styles.buttonText]
                      : {
                          color: "#9C9696",
                          textAlign: "left",
                          fontWeight: "bold",
                          fontSize: 15,
                        }
                  }
                >
                  Late Fee
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
        ) : (
          <Text style={styles.amorHeader}>Repayments</Text>
        )}

        {(!lateFees?.length || !viewLateFee) && (
          <FlatList
            scrollEnabled={true}
            data={amortization}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#EFF5F9",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                  elevation: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    backgroundColor: "#EFF5F9",
                  }}
                >
                  <View
                    style={{ backgroundColor: "#EFF5F9", paddingRight: 10 }}
                  >
                    {orderStatus(item) === "fail" ? (
                      <OrderStatusFail />
                    ) : orderStatus(item) === "pending" ? (
                      <OrderStatusPending />
                    ) : (
                      <OrderStatusPass />
                    )}
                  </View>

                  <Text
                    style={{
                      fontFamily: "Montserrat_500Medium",
                      fontSize: 18,
                      color: "#074A74",
                    }}
                  >
                    ₦
                    {item.expected_amount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#000000",
                  }}
                >
                  {checkValid(item) ? "Payment date: " : "Due date: "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                      color: "#000000",
                    }}
                  >
                    {checkValid(item)
                      ? item.actual_payment_date
                      : item.expected_payment_date}
                  </Text>
                </Text>
              </View>
            )}
          />
        )}
        {lateFees?.length > 0 && viewLateFee && (
          <View
            style={{
              backgroundColor: "transparent",
              position: "relative",
              height: height * 0.5,
            }}
          >
            <FlatList
              scrollEnabled={true}
              data={lateFees}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "#EFF5F9",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 10,
                    elevation: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      backgroundColor: "#EFF5F9",
                    }}
                  >
                    <View
                      style={{ backgroundColor: "#EFF5F9", paddingRight: 10 }}
                    >
                      <OrderStatusFail />
                    </View>

                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        fontSize: 18,
                        color: "#074A74",
                      }}
                    >
                      ₦
                      {item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#000000",
                    }}
                  >
                    Penalty Date:
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 14,
                        color: "#000000",
                      }}
                    >
                      {new Date(item.date_created).toLocaleDateString()}
                    </Text>
                  </Text>
                </View>
              )}
            />
            <View style={[styles.total, { width: width }]}>
              <Text style={styles.totalText}>Total</Text>
              <LinearGradient
                colors={["#074A74", "#089CA4"]}
                style={[
                  styles.buttonContainer,
                  { alignItems: "center", justifyContent: "center" },
                ]}
                start={{ x: 1, y: 0.5 }}
                end={{ x: 0, y: 0.5 }}
              >
                <Text style={[styles.totalText, { color: "white" }]}>
                  {lateFees
                    ?.reduce((accumulator, object) => {
                      return accumulator + object.amount;
                    }, 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </LinearGradient>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 23,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#9C9696",
  },
  modalText:{
  color: "#353232",
  fontFamily: "Montserrat_500Medium",
  marginTop: 30,
  marginHorizontal: 30,
  fontSize: 22,
  textAlign: "center",
  lineHeight:35
},
  total: {
    position: "absolute",
    bottom: 0,
    marginHorizontal: -15,
    zIndex: 1000,
    height: 75,
    backgroundColor: "#F9FBFC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#074A74",
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  toggle: {
    flexDirection: "row",
    width: 326,
    height: 50,
    borderRadius: 19,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "#EEEFF0",
    alignItems: "center",
    paddingHorizontal: 1,
    justifyContent: "space-evenly",
  },
  headerText: {
    color: "white",
    textTransform: "uppercase",
    fontFamily: "Montserrat_700Bold",
    marginLeft: 90,
  },
  orderSummary: {
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 15,
    width: 162,
    height: 40,
  },

  toggleoff: {
    flexDirection: "row",
    backgroundColor: "#EEEFF0",
    width: 162,
    height: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  orderDetail: {
    flex: 1,
    backgroundColor: "#fff",
  },
  orderStatus: {
    flex: 1,
    backgroundColor: "#fff",
  },
  leaf: {
    position: "absolute",
    right: 0,
  },

  statusText: {
    textAlign: "right",
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  cardContainer: {
    height: 200,
    width: 350,
    backgroundColor: "#074A74",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    alignSelf: "center",
    paddingLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  amortizationContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    flex: 1,
  },
  amorHeader: {
    fontFamily: "Montserrat_700Bold",
    color: "#074A74",
    fontSize: 19,
    marginVertical: 10,
  },
  statusBar: {
    height: 15,
    width: "100%",
    backgroundColor: "#EFF5F9",
    opacity: 0.7,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 15,
  },
  repaymentStatus: {
    backgroundColor: "#074A74",
    flexDirection: "row",
    justifyContent: "space-between",
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
});
