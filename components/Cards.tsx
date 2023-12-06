import React from "react";
import { StyleSheet, Pressable, Image } from "react-native";
import { Text, View } from "../components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Animated from "react-native-reanimated";

export default function Cards({ haveActiveOrder, performAction, next_repayment, title, progressBar, amount, creditChecker, hasCompletedOrder }) {

    const statesColor = {
        pending: "#FDC228",
        passed: "#074A74",
        rejected: "#DB2721",
    };


    const url = process.env.EXPO_PUBLIC_API_URL;

    axios.defaults.baseURL = url;


    return (
        <View style={[styles.container, haveActiveOrder ? { height: 150 } : { height: 100, paddingTop: 10 }]}>
            <Image style={[styles.leaf, { bottom: 0 }]} source={require("../assets/images/big_leaf.png")} />
            <Image style={[styles.leaf, { left: 0 }]} source={require("../assets/images/leaf.png")} />

            <View style={styles.flex}>
                <View style={{ backgroundColor: "transparent" }}>
                    <Text style={styles.header}>{title}</Text>
                    <Text style={styles.amount}>{amount}</Text>
                </View>

                <View style={{ flexDirection: "row", backgroundColor: "transparent" }}>
                    {(!haveActiveOrder && creditChecker?.status !== "pending" && creditChecker?.status !== "passed") && (
                        <LinearGradient colors={["#fff", "#DADADA"]} style={styles.buttonContainer} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                            <Pressable style={[styles.button]} onPress={performAction}>
                                <Text
                                    style={[styles.buttonText, { color: "#074A74" }, creditChecker?.id && { color: statesColor[creditChecker.status] }]}
                                >
                                    {haveActiveOrder ? "Track Order" : !creditChecker ? "Request Loan" : creditChecker?.status === "pending" ? "" : creditChecker?.status !== "completed" ? creditChecker?.status : "Request Loan"}
                                </Text>
                            </Pressable>
                        </LinearGradient>
                    )}

                </View>
            </View>
            {haveActiveOrder && (
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
            )}
            {haveActiveOrder && (
                <Text>
                    {next_repayment
                        ? `To pay ${`₦${next_repayment?.expected_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} on ${" "}${next_repayment?.expected_payment_date} ${" "}`
                        : `Repayment Completed`}
                </Text>
            )}
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
        width: "87%",
        height: "auto",
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
        textTransform: "capitalize",
    },
});
