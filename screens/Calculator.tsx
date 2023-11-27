import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Switch, ToastAndroid } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CurrencyInput from "react-native-currency-input";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import businessTypes from "../lib/calculator.json";
import repaymentDurations from "../lib/repaymentDuration.json";
import { Ionicons } from "@expo/vector-icons";
import { logActivity } from "../utilities/globalFunctions";

// import {cashLoan, calculate} from '../lib/calculator';
const url = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.baseURL = url;

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function Calculator({ navigation }: Props) {
    const { authData } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [inputValue, setInputValue] = useState(0);
    const [sliderValue, setSliderValue] = useState(6);
    const [calculator, setCalculator] = useState([]);
    const [downPayment, setDownPayment] = useState("");
    const [repayment, setRepayment] = useState("");

    const [completeRepayment, setCompleteRepayment] = useState(0);
    const [isBiMonthly, setIsBiMonthly] = useState(false);
    const [isCollateral, setIsCollateral] = useState(false);
    const cashBusinessTypes = businessTypes.filter((item) => {
        return !(item.status == 0 || item.slug.includes("ac") || item.slug.includes("ap_products"));
    });

    const selectBusinessType = (amount) => {
        const res = cashBusinessTypes.find((item) => {
            if (amount >= 500000) {
                return item.slug == "ap_super_loan-new";
            } else if (amount > 120000 && amount < 500000 && !isCollateral) {
                return item.slug == "ap_cash_loan-no_collateral";
            } else if (amount && amount <= 120000 && !isCollateral) {
                return item.slug == "ap_starter_cash_loan-no_collateral";
            } else if (amount > 120000 && amount < 500000 && isCollateral) {
                return item.slug == "ap_cash_loan-product";
            } else if (amount && amount <= 120000 && isCollateral) {
                return item.slug == "ap_starter_cash_loan";
            }
        });
        return res;
    };

    async function doSome() {
        await logActivity(authData.token, 8);

        navigation.navigate("UploadDocument", {
            down_payment: parseInt(downPayment.replace(/[^0-9]/g, ""), 10),
            loan_amount: inputValue,
            repayment: completeRepayment,
            repayment_cycle_id: isBiMonthly ? 1 : 2,
        });
        setLoader(true);
    }

    const getCalc = (val = sliderValue, input = inputValue) => {
        try {
            const rDur = repaymentDurations.find((item) => {
                return item.numeral === val;
            });
            const data = {
                repayment_duration_id: rDur,
                payment_type_id: downPaymentRate,
            };
            const params = calculator.find((x) => {
                return (
                    x.business_type_id === selectBusinessType(input).id &&
                    x.down_payment_rate_id === downPaymentRate.id &&
                    x.repayment_duration_id === rDur.id
                );
            });
            if (params) {
                const { actualDownpayment, rePayment, biMonthlyRepayment } = cashLoan(input, data, params, 0);
                setDownPayment(
                    "₦" +
                        actualDownpayment
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                );
                setCompleteRepayment(rePayment);
                if (isBiMonthly) {
                    setRepayment(
                        "₦" +
                            (rePayment / val)
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    );
                } else {
                    setRepayment(
                        "₦" +
                            biMonthlyRepayment
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    );
                }
            } else {
                setDownPayment("₦0.00");
                setRepayment("₦0.00");
            }

            setSliderValue(val);
        } catch (error) {
            setRepayment("₦0.00");
            setDownPayment("₦0.00");
        }
    };

    const downPaymentRate = {
        id: 2,
        name: "twenty",
        percent: 20,
        status: 1,
    };

    const cashLoan = (productPrice, data, params, percentage_discount) => {
        const count = repaymentCount(data.repayment_duration_id.value, 14);
        const actualDownpayment = (data.payment_type_id.percent / 100) * productPrice;
        const residual = productPrice - actualDownpayment;
        const principal = residual / count;
        const interest = (params.interest / 100) * residual;
        const tempActualRepayment = (principal + interest) * count;
        const biMonthlyRepayment = Math.round(tempActualRepayment / count / 100) * 100;
        const actualRepayment = biMonthlyRepayment * count;
        let total = Math.ceil((actualDownpayment + actualRepayment) / 100) * 100;
        let rePayment = 0;
        if (percentage_discount > 0) {
            rePayment = actualRepayment - (actualRepayment * percentage_discount) / 100;
        } else {
            rePayment = actualRepayment;
        }
        total = actualRepayment + actualDownpayment;
        return { total, actualDownpayment, rePayment, biMonthlyRepayment };
    };

    const repaymentCount = (days, cycle) => {
        const result = days / cycle;
        if (result >= 24) {
            return 24;
        } else if (result >= 18) {
            return 18;
        } else if (result >= 12) {
            return 12;
        }
        if (result >= 6) {
            return 6;
        }
        return 3;
    };

    const fetchCalculator = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: `/price-calculators`,
                headers: { Authorization: `Bearer ${authData?.token}` },
            });
            setCalculator(response?.data?.data?.price_calculator);
        } catch (error) {
            ToastAndroid.showWithGravity("Unable to fetch calculator. Please try again later", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } finally {
            setLoader(false);
        }
    };
    const goBack = () => {
        navigation.goBack();
    };

    const onInputValueChange = async (value: number) => {
        setInputValue(value);
        if (value >= 500000) {
            const duration = 12;
            setSliderValue(duration);
            getCalc(duration, value);
            return;
        }
        getCalc(sliderValue, value);
    };
    const toggleSwitchM = () => {
        setIsBiMonthly((previousState) => !previousState);
        getCalc();
    };
    const toggleSwitchC = () => {
        setIsCollateral((previousState) => !previousState);
        getCalc();
    };

    useEffect(() => {
        fetchCalculator();
        getCalc(sliderValue, inputValue);
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: "transparent",
                    height: Dimensions.get("window").height * 0.27,
                    // marginLeft:
                }}
            >
                <Image style={[styles.leaf, { bottom: 0 }]} source={require("../assets/images/big_leaf.png")} />
                <Image style={[styles.leaf, { left: 0 }]} source={require("../assets/images/leaf.png")} />
                <Pressable
                    onPress={goBack}
                    style={{
                        width: "20%",
                        margin: 15,
                    }}
                >
                    <Ionicons name="ios-arrow-back-circle" size={30} color="white" />
                </Pressable>
                <Text style={{ textAlign: "center", fontFamily: "Montserrat_600SemiBold" }}>Your Downpayment</Text>
                <Text style={{ textAlign: "center", fontFamily: "Montserrat_700Bold", fontSize: 50, marginBottom: 20, marginTop: -5 }}>
                    {downPayment || "₦0.00"}
                </Text>
                <Text style={{ textAlign: "center", fontFamily: "Montserrat_600SemiBold" }}>Monthly Repayment: {repayment || "₦0.00"}</Text>
            </View>
            <View style={styles.calculator}>
                <View style={[styles.section, { marginTop: 60, paddingHorizontal: 20 }]}>
                    <Text style={{ color: "#074A74" }}>How much do you want to loan?</Text>
                    <CurrencyInput
                        style={[styles.input, { width: Dimensions.get("window").width * 0.9 }]}
                        value={inputValue}
                        onChangeValue={onInputValueChange}
                        prefix="₦"
                        delimiter=","
                        separator="."
                        precision={2}
                        minValue={0}
                        onChangeText={() => {}}
                    ></CurrencyInput>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: "white",
                            justifyContent: "space-between",
                            marginVertical: 15,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "white",
                                alignItems: "center",
                            }}
                        >
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isBiMonthly ? "#074A74" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchM}
                                value={isBiMonthly}
                            />
                            <Text style={{ color: "#074A74" }}>Bi-Monthly</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                backgroundColor: "white",
                                alignItems: "center",
                            }}
                        >
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isCollateral ? "#074A74" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchC}
                                value={isCollateral}
                            />
                            <Text style={{ color: "#074A74" }}>Collateral</Text>
                        </View>
                    </View>
                    <Text style={{ color: "#074A74" }}>Duration: 6 Months</Text>
                </View>

                <View style={styles.section}>
                    <LinearGradient
                        colors={["#074A74", "#089CA4"]}
                        style={
                            downPayment === "₦0.00"
                                ? [
                                      {
                                          backgroundColor: "rgba(7, 74, 116, 0.63)",
                                      },
                                      styles.button,
                                  ]
                                : styles.button
                        }
                        start={{ x: 1, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }}
                    >
                        <Pressable onPress={doSome} disabled={downPayment === "₦0.00"}>
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
                                <Text style={{ fontSize: 16, fontFamily: "Montserrat_600SemiBold", textAlign: "center" }}>Apply</Text>
                            )}
                        </Pressable>
                    </LinearGradient>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#074A74",
        flex: 1,
        paddingVertical: 30,
    },
    section: {
        backgroundColor: "transparent",
    },
    calculator: {
        marginTop: 20,
        backgroundColor: "white",
        height: Dimensions.get("window").height * 0.7,
        width: "100%",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        justifyContent: "space-between",
    },
    leaf: {
        position: "absolute",
        right: 0,
    },
    header: {
        fontFamily: "Montserrat_800ExtraBold",
        color: "#074A74",
        textAlign: "center",
        fontSize: 25,
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#E8EBF7",
        color: "#72788D",
        paddingVertical: 8,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: "#aaa",
        paddingHorizontal: 10,
        fontSize: 15,
        fontFamily: "Montserrat_600SemiBold",
        alignSelf: "center",
        marginVertical: 10,
    },
    button: {
        alignSelf: "center",
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
        width: Dimensions.get("window").width * 0.8,
        textAlign: "center",
    },
    label: {
        color: "#074A74",
    },
});
