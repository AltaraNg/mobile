import { Pressable, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "PaymentCompleted">;

export default function PaymentCompleted({ navigation }: Props) {
    const NavigateDashboard = async () => {
        navigation.navigate("Dashboard");
    };
    return (
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "white", height: "100%" }}>
            <Image style={{}} source={require("../assets/images/paymentcompleted.png")} />
            <Text style={{ color: "#474A57", fontSize: 25, fontFamily: "Montserrat_600SemiBold", marginTop: 20 }}>Congratulations!!</Text>
            <Text
                style={{
                    color: "#474A57",
                    fontSize: 12,
                    fontFamily: "Montserrat_500Medium",
                    textAlign: "center",
                    paddingHorizontal: 35,
                    marginTop: 10,
                }}
            >
                Your approved funds will be sent to your account shortly.
            </Text>
            <LinearGradient colors={["#074A74", "#089CA4"]} style={styles.button} start={{ x: 1, y: 0.5 }} end={{ x: 0, y: 0.5 }}>
                <Pressable onPress={NavigateDashboard}>
                    {<Text style={{ fontSize: 16, fontFamily: "Montserrat_600SemiBold", textAlign: "center" }}>Back to Dashboard</Text>}
                </Pressable>
            </LinearGradient>
            {/* </View>)} */}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
        width: Dimensions.get("window").width * 0.8,
        textAlign: "center",
        position: "absolute",
        bottom: 0,
    },
});
