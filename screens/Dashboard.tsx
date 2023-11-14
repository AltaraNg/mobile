import { Pressable, StyleSheet, TouchableOpacity, RefreshControl, Image, Dimensions, ScrollView, FlatList } from "react-native";
import { Overlay } from "react-native-elements";
import { MaterialIcons } from '@expo/vector-icons';

import { Hamburger, Debited, Credited, SmallCancel } from "../assets/svgs/svg";
import Header from "../components/Header";
import { useState, useEffect, useContext } from "react";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import Cards from "../components/Cards";
import { AuthContext, useAuth } from "../context/AuthContext";
import axios from "axios";
import { timeFromNow } from "../utilities/moment";
import { formatAsMoney, logActivity } from "../utilities/globalFunctions";

type Props = RootStackScreenProps<"Dashboard">;

export default function Dashboard({ navigation }: Props) {
    const auth = useAuth();

    const { authData, showLoader, setShowLoader } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [recentActivities, setRecentActivities] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    // const [amortization, setAmortization] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [orders, setOrders] = useState(null);
    const [creditChecker, setCreditChecker] = useState(authData?.user?.included?.creditCheckerVerifications[0]);
    const [nextExpectedRepayment, setNextRepayment] = useState({
        expected_amount: 0,
    });
    const amortization = orders?.included?.amortizations;

    const toggleSideMenu = async () => {
        navigation.toggleDrawer();
    };

    const fetchOrder = async () => {
        setShowLoader(true);
        const response = await axios({
            method: "GET",
            url: `/customers/${authData.user.id}/orders`,
            headers: { Authorization: `Bearer ${authData.token}` },
        });
        const order = response.data.data[0].included.orders[0];
        let user = response.data.data[0];
        auth.saveProfile(user);
        setOrders(order);
        setUser(user);
        setCreditChecker(user.included.creditCheckerVerifications[0]);
        const nextRepayment = order?.included?.amortizations?.find((payment: { actual_amount: number }) => payment.actual_amount == 0);
        setNextRepayment(nextRepayment);
        await previewOrder();
        await recentActivity();
        setShowLoader(false);
    };

    const recentActivity = async () => {
        const response = await axios({
            method: "GET",
            url: `/recent/activities`,
            headers: { Authorization: `Bearer ${authData.token}` },
        });
        let activities = response?.data?.data?.activities;
        console.log(activities);
        let filteredList = activities.filter(item => {
            return item.mobile_app_activity.is_admin === 0;
        })
        setRecentActivities(filteredList);
    }

    const listEmptyCOmponent = () => {
        return (
            <View style={{
                backgroundColor: 'transparent',
                marginHorizontal: 30,
                marginVertical: 15
                // flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#074A74',
                    fontFamily: "Montserrat_400Regular",
                    textAlign: 'center'

                }}>
                    You have no recent activity to view. Start getting busy
                </Text>
            </View>
        )
    }

    const previewOrder = async () => {
        try {
            const result = await axios({
                method: "GET",
                url: `/credit-check-verification/${creditChecker?.id}`,
                headers: { Authorization: `Bearer ${authData.token}` },
            });
            let details = result.data.data.creditCheckerVerification;

            setOrderDetails(details);
        } catch (error) { }
    };

    const actionActivity = async (item) => {
        console.log(item)
        if (item?.mobile_app_activity?.name === "Loan Request") {
            navigation.navigate("VerificationPending", item?.meta?.credit_check);
        }
    }


    const performAction = async () => {
        if (orders?.included?.orderStatus?.name === 'Active') {
            navigation.navigate("OrderDetails", orders);
        }
        else if (creditChecker?.status === "passed") {
            navigation.navigate("VerificationPassed", creditChecker);
        }
        else if (creditChecker?.status !== "pending") {
            await logActivity(authData.token, 9);
            navigation.navigate("Calculator");
        }
        else if (creditChecker?.status === "pending") {
            navigation.navigate("VerificationPending", creditChecker);
        }
    };

    const paid_repayment = amortization?.map((item: { actual_amount: number }) => {
        return item.actual_amount;
    });
    const expected_repayment = amortization?.map((item: { expected_amount: number }) => {
        return item.expected_amount;
    });
    const total_expected_repayment = expected_repayment?.reduce((total, item) => {
        return total + item;
    });
    const totalPaid = paid_repayment?.reduce((total, item) => {
        return total + item;
    });
    const totalDebt = total_expected_repayment - totalPaid;
    const progressBar = (totalPaid + orders?.attributes?.down_payment / total_expected_repayment) * 100;
    const testNav = () => {
        navigation.navigate("OrderConfirmation");
    };

    const recommendedLoans = [
        {
            id: "1",
            name: "Loan",
            downpayment: "₦40,000",
            amount: "₦200,000",
            color: "#FFFDD2",
        },
        {
            id: "2",
            name: "Loan",
            downpayment: "₦20,000",
            amount: "₦100,000",
            color: "#EAFFED",
        },
    ];

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchOrder();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Overlay
                isVisible={modalVisible}
                onBackdropPress={() => {
                    setModalVisible(!modalVisible);
                }}
            />

            <View style={styles.header}>
                <Header navigation={navigation}></Header>
                <TouchableOpacity>
                    <Pressable onPress={toggleSideMenu}>
                        <View style={styles.hamburger}>
                            <Hamburger />
                        </View>
                    </Pressable>
                </TouchableOpacity>
            </View>

            {showLoader ? (
                <Image source={require("../assets/gifs/loader.gif")} style={styles.image} />
            ) : (
                <View style={styles.main}>
                    <Text style={[styles.name]}>Hi {user?.attributes?.first_name},</Text>
                    <Text style={styles.message}>Welcome to your altara dashboard </Text>

                    <View style={styles.cards}>
                        <Cards
                            haveActiveOrder={orders?.included}
                            title="Loan Balance"
                            amount={!totalDebt ? "₦0.00" : `₦${totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            progressBar={progressBar}
                            next_repayment={nextExpectedRepayment}
                            performAction={performAction}
                            creditChecker={creditChecker}
                        />
                    </View>
                    <ScrollView>
                        {amortization?.length > 0 && (
                            <View style={styles.main}>
                                {amortization?.length > 0 && (
                                    <Text style={[styles.name, creditChecker?.id && { color: "grey" }]}>
                                        Upcoming Repayments
                                    </Text>
                                )}

                                <FlatList
                                    scrollEnabled={false}
                                    data={amortization?.slice(0, 3)}
                                    keyExtractor={(item) => item.id}
                                    extraData={amortization}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrder} />}
                                    renderItem={({ item }) => (
                                        <View style={{ backgroundColor: "transparent" }}>
                                            <Pressable>
                                                <View style={styles.order}>
                                                    <View style={styles.details}>
                                                        <Credited />
                                                        <View style={styles.title}>
                                                            <Text
                                                                style={{
                                                                    color: "#333333",
                                                                    fontFamily: "Montserrat_600SemiBold",
                                                                }}
                                                                numberOfLines={1}
                                                                ellipsizeMode={"tail"}
                                                            >
                                                                {item.expected_payment_date}{" "}
                                                            </Text>
                                                            {/* <Text style={{ color: "#000", fontSize: 11 }}>{item?.date}</Text> */}
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
                                                        {`₦${formatAsMoney(item.expected_amount)}`}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    )}
                                />
                            </View>
                        )}

                        {creditChecker?.status === 'pending' && (
                            <View style={{ backgroundColor: "transparent", position: "relative" }}>
                                <Text style={[styles.name]}>
                                    Loan Request
                                </Text>
                                <View
                                    style={[
                                        styles.order,
                                        {
                                            backgroundColor: '#FFFDD2',
                                            display: "flex",
                                            alignItems: "center",
                                            height: 130,
                                            paddingHorizontal: 10,
                                        },
                                    ]}
                                >
                                    <Image
                                        source={require("../assets/images/cashloan.png")}
                                        style={{ width: Dimensions.get("window").width * 0.3 }}
                                    />
                                    <View
                                        style={{
                                            backgroundColor: "transparent",
                                            paddingLeft: 5,
                                            width: Dimensions.get("window").width * 0.6,
                                        }}
                                    >
                                        <Text style={[styles.name, { marginHorizontal: 0, marginBottom: 6 }]}>Loan</Text>
                                        <View
                                            style={{
                                                backgroundColor: "transparent",
                                                paddingVertical: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <View style={{ backgroundColor: "transparent", marginRight: 13 }}>
                                                <Text style={[styles.message, { paddingBottom: 3, marginHorizontal: 0 }]}>Amount</Text>
                                                <Text
                                                    style={[
                                                        styles.message,
                                                        { fontFamily: "Montserrat_600SemiBold", marginHorizontal: 0 },
                                                    ]}
                                                >
                                                    {`₦${formatAsMoney(orderDetails?.product?.retail_price)}`}
                                                </Text>
                                            </View>
                                            <View style={{ backgroundColor: "transparent" }}>
                                                <Text style={[styles.message, { paddingBottom: 3, marginHorizontal: 0 }]}>
                                                    Downpayment
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.message,
                                                        { fontFamily: "Montserrat_600SemiBold", marginHorizontal: 0 },
                                                    ]}
                                                >
                                                    {`₦${formatAsMoney((parseInt(orderDetails?.product?.retail_price) * orderDetails?.down_payment_rate?.percent) / 100)}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {!creditChecker?.id && (
                            <View style={{ backgroundColor: "transparent", position: "relative" }}>
                                {creditChecker?.id && (
                                    <View
                                        style={{
                                            position: "absolute",
                                            width: Dimensions.get("window").width * 1,
                                            height: Dimensions.get("window").height * 0.6,
                                            zIndex: 1,
                                            backgroundColor: "#fafafa",
                                            opacity: 0.7,
                                        }}
                                    ></View>
                                )}
                                <Text style={[styles.name, creditChecker?.id && { color: "grey" }]}>
                                    Recommended Loans
                                </Text>
                                <FlatList
                                    scrollEnabled={false}
                                    data={recommendedLoans}
                                    keyExtractor={(item) => item.id}
                                    extraData={recommendedLoans}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrder} />}
                                    renderItem={({ item }) => (
                                        <View style={{ backgroundColor: "transparent" }}>
                                            <Pressable>
                                                <View
                                                    style={[
                                                        styles.order,
                                                        {
                                                            backgroundColor: item.color,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            height: 130,
                                                            paddingHorizontal: 10,
                                                        },
                                                    ]}
                                                >
                                                    <Image
                                                        source={require("../assets/images/cashloan.png")}
                                                        style={{ width: Dimensions.get("window").width * 0.3 }}
                                                    />
                                                    <View
                                                        style={{
                                                            backgroundColor: "transparent",
                                                            paddingLeft: 5,
                                                            width: Dimensions.get("window").width * 0.6,
                                                        }}
                                                    >
                                                        <Text style={[styles.name, { marginHorizontal: 0, marginBottom: 6 }]}>Loan</Text>
                                                        <View
                                                            style={{
                                                                backgroundColor: "transparent",
                                                                paddingVertical: 3,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                flexDirection: "row",
                                                                justifyContent: "flex-start",
                                                            }}
                                                        >
                                                            <View style={{ backgroundColor: "transparent", marginRight: 13 }}>
                                                                <Text style={[styles.message, { paddingBottom: 3, marginHorizontal: 0 }]}>Amount</Text>
                                                                <Text
                                                                    style={[
                                                                        styles.message,
                                                                        { fontFamily: "Montserrat_600SemiBold", marginHorizontal: 0 },
                                                                    ]}
                                                                >
                                                                    {item.amount}
                                                                </Text>
                                                            </View>
                                                            <View style={{ backgroundColor: "transparent" }}>
                                                                <Text style={[styles.message, { paddingBottom: 3, marginHorizontal: 0 }]}>
                                                                    Downpayment
                                                                </Text>
                                                                <Text
                                                                    style={[
                                                                        styles.message,
                                                                        { fontFamily: "Montserrat_600SemiBold", marginHorizontal: 0 },
                                                                    ]}
                                                                >
                                                                    {item.downpayment}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Pressable>
                                        </View>
                                    )}
                                />
                            </View>
                        )}




                        {recentActivities?.length > 0 && (
                            <View style={{ backgroundColor: 'transparent' }}>
                                <Text style={[styles.name]}>
                                    Recent Activities
                                </Text>
                                <FlatList
                                    scrollEnabled={false}
                                    data={recentActivities.slice(0, 3)}
                                    ListEmptyComponent={listEmptyCOmponent}
                                    keyExtractor={(item) => item.id}
                                    extraData={recentActivities}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrder} />}
                                    renderItem={({ item }) => (
                                        <View style={{ backgroundColor: "transparent" }}>
                                            <Pressable onPress={() => {actionActivity(item)}}>
                                                <View style={styles.order}>
                                                    <View style={styles.details}>
                                                        {item?.name?.includes("Approved") ? <Credited /> : <Debited />}
                                                        <View style={styles.title}>
                                                            <Text
                                                                style={{
                                                                    color: "#333333",
                                                                    fontFamily: "Montserrat_600SemiBold",
                                                                }}
                                                                numberOfLines={1}
                                                                ellipsizeMode={"tail"}
                                                            >
                                                                {item?.mobile_app_activity?.name}
                                                            </Text>
                                                            <Text style={{ color: "#000", fontSize: 11 }}>{timeFromNow(item?.created_at)}</Text>
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

                                                    </Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    )}
                                />
                            </View>


                        )}

                    </ScrollView>
                </View>

            )}

        </View>
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
        position: "absolute",
        width: Dimensions.get("window").width * 0.5,
        height: Dimensions.get("window").height * 0.2,
        backgroundColor: "#EFF5F9",
        marginTop: Dimensions.get("window").height * 0.4,
        left: Dimensions.get("window").width * 0.25,
    },
    hamburger: {
        marginTop: 80,
        marginRight: 24,
        backgroundColor: "transparent",
    },
    scrollView: {
        backgroundColor: "transparent",

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
        marginTop: 0,
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
