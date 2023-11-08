// Intro.tsx
import React, { useRef } from "react";
import { SvgXml } from "react-native-svg";

import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';


import { View, SafeAreaView, Text, StyleSheet, StatusBar, Pressable } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { RootStackParamList } from "../types";
import Header from "../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BackButton } from "../assets/svgs/svg";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        position: "relative",
        backgroundColor: "#EFF5F9",
        paddingVertical: 40,
        paddingHorizontal: 15
    },
    icon: {
        textAlign: 'center'
    },
    header: {
        fontSize: 25,
        textAlign: 'center',
        fontFamily: 'Montserrat_700Bold'
    },
    body: {
        fontSize: 18,
        fontFamily: 'Montserrat_500Medium',
        lineHeight: 25,
        marginTop: 25
    },
    menu: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        paddingVertical: 20,
        alignItems: 'center'
    },
    subheader: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Montserrat_700Bold',
        paddingVertical: 10
    }
});


type Props = NativeStackScreenProps<RootStackParamList, "Intro">;
export const Support = ({ navigation }: Props) => {

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View
                    style={{
                        backgroundColor: "transparent",
                        // marginLeft:
                    }}
                >
                    <Pressable onPress={goBack} style={{
                        width: '20%'
                    }}>
                        <Ionicons name="ios-arrow-back-circle" size={30} color="#074A74" />
                    </Pressable>
                </View>
            <Text style={styles.icon}><MaterialIcons name="contact-support" size={50} color="#074A74" /></Text>
            <Text style={styles.header}>Help and Support</Text>
            <Text style={styles.body}>Have questions, feedback, or need assistance? We'd love to hear from you. Contact us using the information below:</Text>

            <View style={styles.menu}>
                <Text style={{
                    paddingHorizontal: 15
                }}>
                    <MaterialCommunityIcons name="home-city-outline" size={36} color="#074A74" />
                </Text>
                <Text style={{
                    fontSize: 18
                }}>46 Raymond Njoku, Ikoyi,
                    Ikoyi, Lagos, Nigeria.</Text>
            </View>

            <View style={styles.menu}>
                <Text style={{
                    paddingHorizontal: 15
                }}>
                    <FontAwesome name="phone-square" size={36} color="#074A74" />
                </Text>
                <Text style={{
                    fontSize: 18
                }}>+234 905 5493 652</Text>
            </View>

            <View style={styles.menu}>
                <Text style={{
                    paddingHorizontal: 15
                }}>
                    <MaterialCommunityIcons name="email-variant" size={36} color="#074A74" />
                </Text>
                <Text style={{
                    fontSize: 18
                }}>accounts@altaracredit.com</Text>
            </View>


            <View>
                <Text style={styles.subheader}>Opening Hours</Text>

                <Text style={{
                    fontSize: 18,
                    marginVertical: 5
                }}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
                 <Text style={{
                    fontSize: 18,
                    marginVertical: 5

                }}>Saturday: 10:00 AM - 4:00 PM</Text>
                 <Text style={{
                    fontSize: 18,
                    marginVertical: 5

                }}>Sunday: Closed</Text>
            </View>







        </View>
    );
};
