import { Pressable, StyleSheet, Dimensions, Modal, TouchableWithoutFeedback, Image, TextInput, Button } from "react-native";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { CollapsableContainer } from "./CollapsibleContainer";
import UserCirclePlus from "../assets/svgs/UserCirclePlus.svg";
import { FontAwesome } from "@expo/vector-icons";
import { getOrdinal } from "../utilities/globalFunctions";


type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function FormItem({ setGuarantor, index }) {
    const [expanded, setExpanded] = useState(false);
    const [guarantorItem, setGuarantorItem] = useState({});
    const onItemPress = () => {
        setExpanded(!expanded);
    };
    const handleChange = (text, label) => {

        let ar = {};
        ar[label] = text;
        setGuarantorItem({ ...guarantorItem, ...ar });

    }
    const saveGuarantor = () => {
        setGuarantor(guarantorItem);
        setExpanded(!expanded);
    }

    return (
        <View style={{ backgroundColor: "transparent", borderTopWidth: 1, borderBottomWidth: 1, marginHorizontal: 8, borderColor: '#958A8A' }}>
            <View style={{ backgroundColor: "transparent", flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 5, alignItems: "center", justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', backgroundColor: "transparent", alignItems: "center" }}>
                    <UserCirclePlus></UserCirclePlus>
                    <Text style={{
                        color: "black",
                        marginHorizontal: 10,
                        fontFamily: 'Roboto',
                        fontSize: 16
                    }}>{index + 1}{getOrdinal(index + 1)} Guarantor</Text>
                </View>
                <View style={{ backgroundColor: "trransparent", flexDirection: 'row' }}>
                    <TouchableWithoutFeedback onPress={onItemPress}>
                        {expanded ? (<FontAwesome name="caret-up" size={24} color="#074A74" style={{ justifyContent: "flex-end" }} />) : (<FontAwesome name="caret-down" size={24} color="#074A74" style={{ justifyContent: "flex-end" }} />)}

                    </TouchableWithoutFeedback>

                    <FontAwesome name="trash" size={24} color="#DB2721" style={{ marginLeft: 20 }} />
                </View>

            </View>

            <CollapsableContainer expanded={expanded}>
                <View style={{
                    marginTop: 20, backgroundColor: 'transparent',
                    marginHorizontal: 0
                }}>
                    <View style={styles.data}>
                        <Text style={[styles.label]}>First Name</Text>
                        <TextInput
                            style={[styles.input,]}
                            onChangeText={(text) => handleChange(text, "first_name")}

                        >

                        </TextInput>
                    </View>
                    <View style={styles.data}>
                        <Text style={[styles.label]}>Last Name</Text>
                        <TextInput
                            style={[styles.input,]}
                            onChangeText={(event) => handleChange(event, "last_name")}

                        >

                        </TextInput>
                    </View>
                    <View style={styles.data}>
                        <Text style={[styles.label]}>Telephone</Text>
                        <TextInput
                            style={[styles.input,]}
                            onChangeText={(event) => handleChange(event, "phone_number")}

                        >

                        </TextInput>
                    </View>
                    <View style={styles.data}>
                        <Text style={[styles.label]}>Address</Text>
                        <TextInput
                            style={[styles.input,]}
                            onChangeText={(event) => handleChange(event, "home_address")}

                        >
                        </TextInput>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: "transparent",
                        width: "20%",
                        alignSelf: "flex-end",
                        marginBottom: 10
                    }}>
                    <Button
                        color="#074A74"
                        title={"Save"}
                        onPress={saveGuarantor}
                    ></Button>
                </View>





            </CollapsableContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 23,
    },
    totalText: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#9C9696",
    },
    modalText: {
        color: "#353232",
        fontFamily: "Montserrat_500Medium",
        marginTop: 30,
        marginHorizontal: 30,
        fontSize: 22,
        textAlign: "center",
        lineHeight: 35,
    },
    input: {
        backgroundColor: "#E8EBF7",
        color: "#72788D",
        paddingVertical: 2,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: "#aaa",
        paddingHorizontal: 10,
        fontSize: 15,
        fontFamily: "Montserrat_500Medium",
    },
    label: {
        color: "#000",
        fontFamily: "Montserrat_500Medium",
        paddingBottom: 3,
        fontSize: 13,
    },
    data: {
        backgroundColor: "transparent",
        marginBottom: 10,
        width: Dimensions.get("window").width * 0.8,
        marginLeft: 40
    },
    total: {
        position: "absolute",
        bottom: 0,
        marginHorizontal: -15,
        zIndex: 1000,
        height: 75,
        backgroundColor: "#F9FBFC",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        justifyContent: "space-between",
    },
    header: {
        backgroundColor: "#074A74",
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    toggle: {
        flexDirection: "row",
        width: 326,
        height: 50,
        borderRadius: 19,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: "#EEEFF0",
        alignItems: "center",
        paddingHorizontal: 1,
        justifyContent: "space-evenly",
    },
    headerText: {
        color: "white",
        textTransform: "uppercase",
        fontFamily: "Montserrat_700Bold",
        marginLeft: 90,
    },
    orderSummary: {
        flexDirection: "row",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        borderColor: "transparent",
        borderWidth: 1,
        borderRadius: 15,
        width: 162,
        height: 40,
    },

    toggleoff: {
        flexDirection: "row",
        backgroundColor: "#EEEFF0",
        width: 162,
        height: 40,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
    },
    orderDetail: {
        flex: 1,
        backgroundColor: "#fff",
    },
    orderStatus: {
        flex: 1,
        backgroundColor: "#fff",
    },
    leaf: {
        position: "absolute",
        right: 0,
    },

    statusText: {
        textAlign: "right",
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    cardContainer: {
        height: 200,
        width: 350,
        backgroundColor: "#074A74",
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        alignSelf: "center",
        paddingLeft: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    amortizationContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        flex: 1,
    },
    amorHeader: {
        fontFamily: "Montserrat_700Bold",
        color: "#074A74",
        fontSize: 19,
        marginVertical: 10,
    },
    statusBar: {
        height: 15,
        width: "100%",
        backgroundColor: "#EFF5F9",
        opacity: 0.7,
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 15,
    },
    repaymentStatus: {
        backgroundColor: "#074A74",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalContainer: {
        height: Dimensions.get("screen").height / 2.1,
        alignItems: "center",
        marginTop: "auto",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "white",
    },
    modalContent: {
        paddingVertical: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: "center",
        backgroundColor: "white",
    },
    modalHeading: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 30,
        textAlign: "center",
        color: "black",
        marginTop: 20,
    },
    modalHeaderCloseText: {
        backgroundColor: "white",
        textAlign: "center",
        paddingLeft: 5,
        paddingRight: 5,
        width: 30,
        fontSize: 15,
        borderRadius: 50,
    },
});
