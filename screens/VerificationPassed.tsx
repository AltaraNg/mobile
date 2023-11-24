import React from "react";
import { RefreshControl, StyleSheet, Dimensions, FlatList, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useContext, useEffect } from "react";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Verified } from "../assets/svgs/svg";
import { formatAsMoney } from "../utilities/globalFunctions";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;
const url = process.env.EXPO_PUBLIC_PORTAL_API_URL;
const loanAppKey = process.env.EXPO_PUBLIC_LOAN_APP_KEY;
const instance = axios.create({
    baseURL: url,
});

export default function VerificationPassed({ navigation, route }: Props) {
    const { authData, showLoader, setShowLoader } = useContext(AuthContext);
    const [orderDetails, setOrderDetails] = useState({});
    const [amortization, setAmortization] = useState(null);
    const refreshing = false;
    const creditChecker = route.params;

    const goBack = () => {
        navigation.goBack();
    };
    const previewOrder = async () => {
        setShowLoader(true);
        try {
            const result = await axios({
                method: "GET",
                url: `/credit-check-verification/${creditChecker?.id}`,
                headers: { Authorization: `Bearer ${authData.token}` },
            });
            const details = result.data.data.creditCheckerVerification;
            const getAmort = await instance({
                method: "POST",
                headers: { "LOAN-APP-API-KEY": loanAppKey },
                url: "/mobile-app/amortization/preview",
                data: {
                    credit_checker_verification_id: details.id,
                    product_price: parseInt(details.product.retail_price),
                    down_payment: (parseInt(details.product.retail_price) * details.down_payment_rate.percent) / 100,
                    repayment:
                        parseInt(details.product.retail_price) - (parseInt(details.product.retail_price) * details.down_payment_rate.percent) / 100,
                },
            });
            setOrderDetails(details);
            setAmortization(getAmort.data.data.preview);
            setShowLoader(false);
        } catch (error) {
            setShowLoader(false);
            throw error;
        }
    };

    const payDown = () => {
        const data: object = {
            credit_checker_verification_id: orderDetails?.id,
            product_price: parseInt(orderDetails?.product?.retail_price),
            down_payment: (parseInt(orderDetails?.product.retail_price) * orderDetails?.down_payment_rate.percent) / 100,
            repayment:
                parseInt(orderDetails?.product.retail_price) -
                (parseInt(orderDetails?.product?.retail_price) * orderDetails?.down_payment_rate?.percent) / 100,
        };
        navigation.navigate("OrderConfirmation", data);
    };

    useEffect(() => {
        previewOrder();
    }, []);

    return (
        <View style={styles.container}>
            {showLoader ? (
                <Image source={require("../assets/gifs/loader.gif")} style={styles.image} />
            ) : (
                <View style={styles.container}>
                    <View
                        style={{
                            backgroundColor: "transparent",
                            paddingVertical: 20,
                            position: "relative",
                        }}
                    >
                        <Pressable
                            onPress={goBack}
                            style={{
                                width: "20%",
                                padding: 15,
                                position: "absolute",
                                bottom: 0,
                                zIndex: 10,
                            }}
                        >
                            <Ionicons name="ios-arrow-back-circle" size={30} color="#074A74" />
                        </Pressable>
                        <View
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                            }}
                        >
                            <Text style={[styles.header, { marginRight: 3 }]}>Verified</Text>
                            <Verified />
                        </View>
                    </View>

                    <View style={styles.cardContainer}>
                        <Image style={[styles.leaf, { bottom: 0 }]} source={require("../assets/images/big_leaf.png")} />
                        <Image style={[styles.leaf, { left: 0 }]} source={require("../assets/images/leaf.png")} />
                        <Text style={[styles.modalText, { textAlign: "right" }]}>
                            Downpayment:{" "}
                            <Text style={{ fontFamily: "Montserrat_700Bold" }}>
                                {" "}
                                {`₦${((parseInt(orderDetails?.product?.retail_price) * orderDetails?.down_payment_rate?.percent) / 100).toFixed(2)}`}
                            </Text>
                        </Text>
                        <View style={{ backgroundColor: "transparent" }}>
                            <Text style={[styles.modalText, { lineHeight: 15 }]}>Loan Amount:</Text>
                            <Text style={[styles.modalText, { fontSize: 22, fontFamily: "Montserrat_700Bold", lineHeight: 25 }]}>{`₦${parseFloat(
                                orderDetails?.product?.retail_price
                            ).toFixed(2)}`}</Text>
                        </View>

                        <Text style={[styles.modalText, { textAlign: "right" }]}>
                            Total Repayment:{" "}
                            <Text style={{ fontFamily: "Montserrat_700Bold" }}>
                                {`₦${(
                                    parseInt(orderDetails?.product?.retail_price) -
                                    (parseInt(orderDetails?.product?.retail_price) * orderDetails?.down_payment_rate?.percent) / 100
                                ).toFixed(2)}`}
                            </Text>{" "}
                        </Text>
                    </View>

                    <View style={styles.container}>
                        <View
                            style={{
                                backgroundColor: "transparent",
                                padding: 15,
                                marginHorizontal: 20,
                                borderRadius: 2,
                                paddingBottom: 40,
                                shadowColor: "#D9D9D9",
                                elevation: 2,
                            }}
                        >
                            <Text style={[styles.amorHeader, { textAlign: "left", color: "#474A57" }]}>Repayments</Text>
                            <FlatList
                                scrollEnabled={true}
                                data={amortization}
                                numColumns={2}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={previewOrder} />}
                                renderItem={({ item }) => (
                                    <View
                                        style={{
                                            backgroundColor: "transparent",
                                            padding: 15,
                                            borderRadius: 2,
                                            width: "50%",
                                            borderColor: "#D9D9D9",
                                            borderWidth: 1,
                                            shadowColor: "#D9D9D9",
                                        }}
                                    >
                                        <Text style={{ color: "#474A57", textAlign: "center", fontSize: 12 }}>
                                            {new Date(item.expected_payment_date).toLocaleDateString()}
                                        </Text>
                                        <Text
                                            style={{ color: "#474A57", textAlign: "center", fontFamily: "Montserrat_600SemiBold" }}
                                        >{`₦${formatAsMoney(item.expected_amount)}`}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    <LinearGradient colors={["#074A74", "#089CA4"]} style={styles.buttonContainer} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                        <Pressable style={styles.button} onPress={payDown}>
                            <Text style={styles.buttonText}>Pay Downpayment</Text>
                        </Pressable>
                    </LinearGradient>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 15,
    },
    totalText: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#9C9696",
    },
    modalText: {
        color: "white",
        fontFamily: "Montserrat_400Regular",
        marginTop: 5,
        marginHorizontal: 10,
        fontSize: 12,
        textAlign: "left",
        lineHeight: 20,
        display: "flex",
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
        backgroundColor: "white",
        fontSize: 18,
        color: "#4A525C",

        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
    },
    image: {
        position: "absolute",
        width: Dimensions.get("window").width * 0.5,
        height: Dimensions.get("window").height * 0.2,
        backgroundColor: "#EFF5F9",
        marginTop: Dimensions.get("window").height * 0.4,
        left: Dimensions.get("window").width * 0.25,
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
        color: "#074A74",
        textTransform: "uppercase",
        fontFamily: "Montserrat_700Bold",
        fontSize: 20,
        textAlign: "center",
    },
    orderSummary: {
        flexDirection: "row",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        marginHorizontal: 40,
        marginVertical: 10,

        // position: "absolute",
        // bottom: 30,
        borderColor: "#074A74",
        borderWidth: 1,
        borderRadius: 10,
    },

    toggleoff: {
        flexDirection: "row",
        backgroundColor: "#EEEFF0",
        width: 162,
        height: 40,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
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
    leaf: {
        position: "absolute",
        right: 0,
    },
    cardContainer: {
        height: 120,
        width: Dimensions.get("screen").width * 0.91,
        backgroundColor: "#074A74",
        borderRadius: 2,
        marginBottom: 10,
        marginTop: 10,
        padding: 7,
        alignSelf: "center",
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
        marginVertical: 5,
        textAlign: "center",
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
