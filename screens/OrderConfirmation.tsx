import { StyleSheet } from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";


const url = process.env.EXPO_PUBLIC_PORTAL_API_URL;
const instance = axios.create({
    baseURL: url
});
type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function OrderConfirmation({ navigation, route }: Props) {
    const order: object = route.params;
    const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_KEY

    const createOrder = async () => {
        let data = {
            "down_payment": 16000,
            "product_price": 80000,
            "repayment": 64000,
            "credit_checker_verification_id": 387
        }
        try {
            const result = await instance({
                method: "POST",
                url: `/mobile-app/create/loan`,
                headers: { "LOAN-APP-API-KEY": "LAAKswUiUtYsj98CXRG0EDrKmF0m2VbkGUwCx64zALrKEY" },
                data: data,
            });
            console.log(result.data);
            navigation.navigate("OrderSuccess", );


        } catch (error) {
            console.log(error.response)
            console.log(url);
            // navigation.navigate("Dashboard");

        }
    }




    return (
        <View style={styles.container}>
            <Paystack
                paystackKey={paystackKey}
                amount={'25000.00'}
                billingEmail="admin@altaracredit.com"
                activityIndicatorColor="green"
                onCancel={(e) => {
                    console.log(e);
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
