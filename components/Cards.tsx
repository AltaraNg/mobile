import React from "react";
import { StyleSheet, Pressable, Image } from "react-native";
import { Text, View } from "../components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { OrderContext } from "../context/OrderContext";
import Animated from "react-native-reanimated";

export default function Cards({ navigation, trackOrder, next_repayment, title, progressBar, amount, isDisabled, type, onRequest }) {
    const url = process.env.EXPO_PUBLIC_API_URL;
    axios.defaults.baseURL = url;
    const { authData } = useContext(AuthContext);
    const { setOrderRequest, orderRequest } = useContext(OrderContext);
    const [loader, setLoader] = useState(false);
    const [showButton, setShowButton] = useState(null);

    // const progressBar = ((totalPaid - order?.attributes?.down_payment) / order?.attributes?.repayment) * 100;

    async function doSome() {
        if (type === "cash") {
            navigation.navigate("Calculator");
        } else {
            setLoader(true);
            try {
                const res = await axios({
                    method: "POST",
                    data: {
                        order_type: type,
                    },
                    url: "/submit/request",
                    headers: { Authorization: `Bearer ${authData.token}` },
                });
                if (res.status === 200) {
                    setOrderRequest();
                    onRequest(res.data, "success", type);
                    setLoader(false);
                }
            } catch (error) {
                setLoader(false);
                onRequest(error.response.data, "failed", type);
            }
        }
    }
    const checkOrder = () => {
        const isPending = orderRequest?.some((item) => item.status === "pending");
        isPending ? setShowButton(false) : setShowButton(true);
    };

    useEffect(() => {
        checkOrder();
    }, [orderRequest]);

    return (
        <View style={styles.container}>
            <Image style={[styles.leaf, { bottom: 0 }]} source={require("../assets/images/big_leaf.png")} />
            <Image style={[styles.leaf, { left: 0 }]} source={require("../assets/images/leaf.png")} />

            <View style={styles.flex}>
                <View style={{ backgroundColor: "transparent" }}>
                    <Text style={styles.header}>{title}</Text>
                    <Text style={styles.amount}>{amount}</Text>
                </View>

                <View style={{ flexDirection: "row", backgroundColor: "transparent" }}>
                    {showButton ? (
                        <LinearGradient colors={["#fff", "#fff"]} style={styles.buttonContainer} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                            <Pressable style={[styles.button]} onPress={doSome} disabled={isDisabled}>
                                {loader ? (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "transparent",
                                        }}
                                    >
                                        <Image source={require("../assets/gifs/loader.gif")} style={{ width: 60, height: 27 }} />
                                    </View>
                                ) : (
                                    <Text style={styles.buttonText}>Order Now</Text>
                                )}
                            </Pressable>
                        </LinearGradient>
                    ) : (
                        <LinearGradient colors={["#fff", "#DADADA"]} style={styles.buttonContainer} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                            <Pressable style={[styles.button]} onPress={trackOrder} disabled={isDisabled}>
                                <Text style={[styles.buttonText, { color: "#074A74" }]}>Track Order</Text>
                            </Pressable>
                        </LinearGradient>
                    )}
                </View>
            </View>
            <View style={styles.statusBar}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: "#007AFF",
                            width: `${progressBar < 0 ? 0 : progressBar > 100 ? 100 : progressBar}%`,
                        },
                    ]}
                />
            </View>
            <Text>
                To pay {`₦${next_repayment.expected_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} on{" "}
                {next_repayment.expected_payment_date}{" "}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    statusBar: {
        height: 5,
        width: "100%",
        backgroundColor: "#fff",
        opacity: 1,
        borderWidth: 0,
        borderRadius: 10,
        marginVertical: 15,
    },
    flex: {
        flexDirection: "row",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "space-between",
    },
    container: {
        height: 150,
        width: 300,
        backgroundColor: "#074A74",
        borderRadius: 5,
        marginBottom: 17,
        padding: 10,
        paddingLeft: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    amount: {
        letterSpacing: 1,
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Montserrat_700Bold",
        color: "white",
    },
    leaf: {
        position: "absolute",
        right: 0,
    },
    header: {
        fontWeight: "bold",
        fontFamily: "Montserrat_700Bold",
        color: "#fff",
        paddingTop: 5,
        fontSize: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#074A74",
        borderWidth: 1,
        borderRadius: 100,
        width: 120,
        height: 40,
    },
    button: {
        paddingVertical: 4,
        borderRadius: 24,
    },
    buttonText: {
        color: "#074A74",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 14,
    },
});
