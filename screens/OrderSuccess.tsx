import { StyleSheet } from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { post } from "../utilities/api";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function OrderSuccess({ navigation, route }: Props) {
    const order: object = route.params;
    const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_KEY;

    const createOrder = async () => {
        let data = {
            down_payment: 16000,
            product_price: 80000,
            repayment: 64000,
            credit_checker_verification_id: 14,
        };
        try {
            let res = await post("/mobile-app/create/loan", data);
            console.log(res);
            navigation.navigate("OrderSuccess");
        } catch (error) {
            console.log(error.response);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Order Successful</Text>
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
