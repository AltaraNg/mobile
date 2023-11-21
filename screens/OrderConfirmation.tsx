import { StyleSheet } from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logActivity } from "../utilities/globalFunctions";

const url = process.env.EXPO_PUBLIC_PORTAL_API_URL;
const loanAppKey = process.env.EXPO_PUBLIC_LOAN_APP_KEY;
const accountEmail = process.env.EXPO_PUBLIC_ACCOUNT_EMAIL;

const instance = axios.create({
    baseURL: url,
});
type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function OrderConfirmation({ navigation, route }: Props) {
    const { authData, showLoader, setShowLoader } = useContext(AuthContext);

    const order: object = route.params;
    const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_KEY;

    const createOrder = async () => {
        try {
            setShowLoader(true);
            const result = await instance({
                method: "POST",
                url: `/mobile-app/create/loan`,
                headers: { "LOAN-APP-API-KEY": loanAppKey },
                data: order,
            });
            setShowLoader(false);
            navigation.navigate("Dashboard");
        } catch (error) {
            // navigation.navigate("Dashboard");
        }
    };

    return (
        <View style={styles.container}>
            <Paystack
                paystackKey={paystackKey}
                amount={order.down_payment}
                billingEmail={accountEmail}
                activityIndicatorColor="green"
                onCancel={(e) => {
                    navigation.navigate("Dashboard");
                }}
                onSuccess={() => {
                    createOrder();
                }}
                autoStart={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 23,
    },
});
