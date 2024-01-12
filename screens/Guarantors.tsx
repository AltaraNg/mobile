import { Dimensions, Image, Pressable, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Leaf from "../assets/svgs/leaf.svg";

import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import FormItem from "../components/FormItem";
import { LinearGradient } from "expo-linear-gradient";
import { logActivity } from "../utilities/globalFunctions";


const url = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.baseURL = url;

type Props = NativeStackScreenProps<RootStackParamList, "UploadDocument">;

export default function Guarantors({ navigation, route }: Props) {
    const [guarantorList, setGuarantorList] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [main, setMain] = useState([]);
    let orderDetails: object = route.params;

    const goBack = () => {
        navigation.goBack();
    };
    const addMore = () => {
        setGuarantorList([...guarantorList, {}])
    };
    const goToUploads = () => {
        orderDetails = { ...orderDetails, guarantors: main }
        navigation.navigate("UploadDocument", orderDetails);
    }
    const setGuarantor = (guarantor) => {
        if (guarantorList.length < 2) {
            setGuarantorList([...guarantorList, guarantor]);

        }
        setMain([...main, guarantor]);
        // if (guarantorList.length < 1){
        //     addMore();
        // }
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
                <View style={{
                    backgroundColor: "transparent"
                }}>
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

                    <View style={{ backgroundColor: "transparent", marginHorizontal: 0 }}>
                        {guarantorList.map((guarantor, index) => (
                            <FormItem key={index} setGuarantor={setGuarantor} index={index} ></FormItem>
                        ))}

                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: "transparent",
                        flexDirection: "column"
                    }}>


                    <LinearGradient
                        colors={["#074A74", "#089CA4"]}
                        style={styles.buttonContainer}
                        start={{ x: 1, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }}
                    >
                        <Pressable style={[styles.button]} onPress={goToUploads}>
                            {loading ? (
                                <Image source={require("../assets/gifs/loader.gif")} style={styles.image} />
                            ) : (
                                <Text style={styles.buttonText}>Next</Text>
                            )}
                        </Pressable>
                    </LinearGradient>

                </View>





            </View>

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
    image: {
        width: Dimensions.get("window").height * 0.08,
        height: Dimensions.get("window").height * 0.08,
        marginVertical: -15,
    },
    overlay: {
        position: "absolute",
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        top: Dimensions.get("window").height * 0.18,
        height: "85%"

    },
    textHeader: {
        backgroundColor: 'transparent',
        paddingVertical: 40,

    },
    buttonContainer: {
        flexDirection: "row",
        marginHorizontal: 40,
        borderColor: "#074A74",
        borderWidth: 1,
        borderRadius: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 8,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },

});
