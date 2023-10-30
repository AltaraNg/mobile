import { StyleSheet } from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { useState } from "react";
import { View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function OrderConfirmation({ navigation, route }: Props) {
    const [viewLateFee, setViewLateFee] = useState(null);
    const order: object = route.params;
    const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_KEY

    const createOrder = async () => {
        
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
                onSuccess={(res) => {
                    console.log(res)
                    navigation.navigate("Dashboard");

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
