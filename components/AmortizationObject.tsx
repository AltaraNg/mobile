import React from "react";
import { Text, View } from "../components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import { formatAsMoney } from "../utilities/globalFunctions";

export default function AmortizationObject(props) {
    return (

        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#074A74",
                marginHorizontal: 15,
                borderRadius: 10,
                marginVertical: 5,
            }}
        >
            <LinearGradient colors={["#074A74", "#089CA4"]} style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: '100%',
                padding: 15,
                borderRadius: 10
            }} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                <Text>{`₦${formatAsMoney(props.item.expected_amount)}`}</Text>
                <Text>{new Date(props.item.expected_payment_date).toLocaleDateString()}</Text>
            </LinearGradient>
        </View >


    );
}
