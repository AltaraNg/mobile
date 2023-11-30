import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Switch, ToastAndroid } from "react-native";

import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CurrencyInput from "react-native-currency-input";
import { useContext, useEffect, useState } from "react";
import Leaf from "../assets/svgs/leaf.svg";

import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BackButton, BackButton2 } from "../assets/svgs/svg";
import FormItem from "../components/FormItem";

const url = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.baseURL = url;

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function Guarantors({ navigation }: Props) {
    const [guarantorList, setGuarantorList] = useState([{}])
    const goBack = () => {
        navigation.goBack();
    };
    const addMore = () => {
        setGuarantorList([...guarantorList, {}])
    }


    useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    zIndex: 1,
                    left: 20,
                    top: 60
                    // marginLeft:
                }}
            >
                <Pressable onPress={goBack} style={{
                    width: '100%'
                }}>
                    <Ionicons name="ios-arrow-back-circle" size={30} color={'white'} />
                </Pressable>
            </View>
            <View style={styles.header}>
                <Leaf style={styles.leaf} />
                <Image style={[styles.leaf, { left: 0 }]} source={require("../assets/images/leaf.png")} />

            </View>
            <View style={styles.overlay}>
                <View style={styles.textHeader}>
                    <Text style={{
                        textAlign: 'center',
                        color: '#074A74',
                        fontFamily: "Montserrat_700Bold",
                        fontSize: 22
                    }}>Enter Your Guarantors</Text>
                    <Text style={{
                        textAlign: 'center',
                        fontFamily: 'Roboto',
                        fontWeight: "500",
                        color: "#474A57",
                        fontSize: 15

                    }}>
                        Click + to add more
                    </Text>
                </View>

                <View style={{ backgroundColor: "transparent" }}>
                    {guarantorList.map((guarantor, index) => (
                        <FormItem key={index} guarantor={guarantor} index={index}></FormItem>
                    ))}

                </View>


            </View>
            {guarantorList.length < 2 && (
                <Pressable style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    bottom: 10,
                    right: 10
                }} onPress={addMore}>
                    <AntDesign name="pluscircle" size={36} color="#074A74" />

                </Pressable>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        paddingVertical: 30,
    },
    header: {
        height: Dimensions.get("window").height * 0.2,
        backgroundColor: '#074A74',
        flexDirection: 'row'
    },
    leaf: {
        position: "absolute",
        right: 0,
    },
    overlay: {
        position: "absolute",
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        top: Dimensions.get("window").height * 0.18,
        height: "100%"

    },
    textHeader: {
        backgroundColor: 'transparent',
        paddingVertical: 40,

    }

});
