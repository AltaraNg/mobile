import React from "react";
import { Text, View } from "../components/Themed";

export default function AmortizationObject(props) {
    return (
        <View
            style={{
                padding: 15,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#074A74",
                marginHorizontal: 15,
                borderRadius: 10,
                marginVertical: 5,
            }}
        >
            <Text>{`₦${props.item.expected_amount}`}</Text>
            <Text>{new Date(props.item.expected_payment_date).toLocaleDateString()}</Text>
        </View>
    );
}
