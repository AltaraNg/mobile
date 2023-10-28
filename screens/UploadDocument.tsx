import { Pressable, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import React, { useState, useEffect, useContext } from "react";
import Hamburger from "../assets/svgs/hamburger.svg";
import { Text, View } from "../components/Themed";
import { RootTabParamList } from "../types";
import SideMenu from "./SideMenu";
import { AuthContext, useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
type Props = NativeStackScreenProps<RootTabParamList, "Dashboard">;
import Upload from "../components/Upload";
const url = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.baseURL = url;

export default function UploadDocument({ navigation }: Props) {
    const auth = useAuth();

    const { authData } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading] = useState(null);
    const [showMenu] = useState(false);
    const [uploaded, setUploaded] = useState(null);

    const toggleSideMenu = async () => {
        navigation.toggleDrawer();
    };

    // const backAction = () => {
    // 	if (Platform.OS === 'ios') return;
    // 	setTimeout(() => {}, 3000);

    // 	if (exitApp === 0) {
    // 		setExitApp(exitApp + 1);

    // 		ToastAndroid.showWithGravity(
    // 			'press back button again to exit app',
    // 			ToastAndroid.SHORT,
    // 			ToastAndroid.CENTER
    // 		);
    // 	} else {
    // 		BackHandler.exitApp();
    // 	}
    // };

    const checkVerification = async () => {
        setUser(authData.user.attributes);
        const upload = Object.values(authData.user.included.verification).every((val) => val);
        setUploaded(upload);
        if (upload) {
            auth.saveProfile(authData.user);
        }
    };
    function handleRequest() {
        // fetchUser()
    }

    useEffect(() => {
        checkVerification();
    }, [authData]);

    return (
        <ScrollView style={styles.container}>
            {showMenu && <SideMenu Logout="Logout" />}
            <View style={styles.header}>
                <Header></Header>
                <TouchableOpacity>
                    <Pressable onPress={toggleSideMenu}>
                        <Hamburger style={styles.hamburger} />
                    </Pressable>
                </TouchableOpacity>
            </View>
            {user && (
                <ScrollView
                    style={{
                        backgroundColor: "#fff",
                    }}
                >
                    <View style={styles.main}>
                        <Text style={styles.title}>Upload Document</Text>
                        <Text style={styles.simple}>Hurray! This is the last step👍</Text>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "space-evenly",
                                backgroundColor: "white",
                                flexDirection: "row",
                                marginTop: 20,
                            }}
                        >
                            <Upload onRequest={handleRequest} document="Passport" type="passport" />
                            <Upload onRequest={handleRequest} document="ID Card" type="id_card" />
                        </View>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "space-evenly",
                                backgroundColor: "white",
                                flexDirection: "row",
                            }}
                        >
                            <Upload onRequest={handleRequest} document="Guarantor's ID" type="guarantor_id" />
                            <Upload onRequest={handleRequest} document="Bank Statement" type="proof_of_income" />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#fff",
                                marginBottom: 60,
                            }}
                        >
                            <LinearGradient
                                colors={["#074A77", "#089CA4"]}
                                style={!uploaded ? [styles.buttonContainer, { opacity: 0.5 }] : styles.buttonContainer}
                                start={{ x: 1, y: 0.5 }}
                                end={{ x: 0, y: 0.5 }}
                            >
                                <Pressable
                                    style={[styles.button]}
                                    disabled={!uploaded}
                                    //onPress={completeRegistration}
                                >
                                    {loading ? (
                                        <Image source={require("../assets/gifs/loader.gif")} style={styles.image} />
                                    ) : (
                                        <Text style={styles.buttonText}> Continue </Text>
                                    )}
                                </Pressable>
                            </LinearGradient>
                        </View>
                    </View>
                </ScrollView>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        position: "relative",
        backgroundColor: "#fff",
    },
    row: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginBottom: 10,
        alignItems: "center",
    },

    image: {
        width: Dimensions.get("window").height * 0.08,
        height: Dimensions.get("window").height * 0.08,
        marginVertical: -15,
    },
    buttonContainer: {
        flexDirection: "row",
        borderColor: "#074A74",
        borderWidth: 1,
        borderRadius: 3,
        width: Dimensions.get("window").width * 0.8,
        paddingVertical: 17,
        marginTop: 30,
    },
    button: {
        flex: 1,
        alignItems: "center",
        borderRadius: 2,
    },
    buttonText: {
        color: "#ffffff",
        fontFamily: "Montserrat_600SemiBold",
        textAlign: "center",
        fontSize: 18,
    },
    hamburger: {
        marginTop: 80,
        marginRight: 24,
    },
    cards: {
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "center",
    },
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },
    main: {
        flex: 3,
        backgroundColor: "#fff",
    },
    title: {
        marginHorizontal: 30,
        fontSize: 25,
        color: "#074A74",
        fontFamily: "Montserrat_700Bold",
        marginBottom: 8,
        marginTop: 40,
    },
    menu: {
        position: "absolute",
        right: 0,
    },
    container2: {
        backgroundColor: "#fff",
        width: 140,
    },
    dropdown: {
        height: 40,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label2: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
        color: "#72788D",
    },
    selectedTextStyle: {
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
        color: "#72788D",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
        color: "#72788D",
    },
    simple: {
        fontFamily: "Montserrat_400Regular",
        marginHorizontal: 30,
        fontSize: 14,
        color: "#72788D",
    },
});
