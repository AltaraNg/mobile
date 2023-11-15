import { RefreshControl, StyleSheet, Dimensions, FlatList, Image, Pressable } from "react-native";

import { useState, useContext, useEffect } from "react";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;
const url = process.env.EXPO_PUBLIC_PORTAL_API_URL;
const loanAppKey = process.env.EXPO_PUBLIC_LOAN_APP_KEY;
const instance = axios.create({
    baseURL: url,
});

export default function VerificationPending({ navigation, route }: Props) {
    const { authData, showLoader, setShowLoader } = useContext(AuthContext);
    const [orderDetails, setOrderDetails] = useState({});
    const [amortization, setAmortization] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const creditChecker = route.params;


    const previewOrder = async () => {
        setShowLoader(true);
        try {
            const result = await axios({
                method: "GET",
                url: `/credit-check-verification/${creditChecker?.id}`,
                headers: { Authorization: `Bearer ${authData.token}` },
            });
            let details = result.data.data.creditCheckerVerification;
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
        } catch (error) { }
    };

   

    const goBack = () => {
        navigation.navigate('Dashboard');
    };

    useEffect(() => {
        // previewOrder();
    }, []);

    return (
        <View style={styles.container}>

            {showLoader ? (
                <Image source={require("../assets/gifs/loader.gif")} style={styles.image} />
            ) : (
                <View style={styles.container}>
                    <Image source={require("../assets/gifs/waiting.gif")} style={{
                        alignSelf: 'center'
                    }} />
                    <Text style={styles.headerText}>Awaiting Verification</Text>
                    <Text style={styles.modalText}>
                    Thank you for submitting your loan application. Your request is currently being reviewed and processed. We appreciate your patience while our team verifies all the information you have provided.
                    </Text>

                    <LinearGradient colors={["#074A74", "#089CA4"]} style={styles.buttonContainer} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                        <Pressable style={styles.button} onPress={goBack}>
                            <Text style={styles.buttonText}>Go Back</Text>
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
        paddingTop: 15
    },
    totalText: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#9C9696",
    },
    modalText: {
        color: "#074A74",
        fontFamily: "Montserrat_500Medium",
        marginTop: 5,
        marginHorizontal: 10,
        fontSize: 15,
        textAlign: "center",
        lineHeight: 35,
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
        padding: 20,
        fontSize: 25,
        color: '#074A74',

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
    cardContainer: {
        height: 200,
        width: 350,
        // backgroundColor: "#074A74",
        backgroundColor: '#FFFDD2',
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
        textAlign: 'center'
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
