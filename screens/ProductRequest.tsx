import { Dimensions, Image, Modal, Pressable, StyleSheet, ToastAndroid, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import Constants from 'expo-constants';
import { Overlay } from 'react-native-elements';
import { SuccessSvg } from '../assets/svgs/svg';
import { OrderContext } from '../context/OrderContext';
import { TextInput } from 'react-native-gesture-handler';
let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export default function ProductRequest({ navigation, route }: Props) {
    const { authData, setAuthData, showLoader, setShowLoader } =
        useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [staffName, setStaffName] = useState("");
    const [branch, setBranch] = useState(null);
    const [branches, setBranches] = useState([]);
    const [modalResponse, setModalResponse] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    const {

        fetchOrderRequestContext,

    } = useContext(OrderContext);




    async function doSome() {


        setLoader(true);
        try {
            let res = await axios({
                method: "POST",
                data: {
                    order_type: 'product',
                    branch: branch,
                    staff_name: staffName
                },
                url: "/submit/request",
                headers: { Authorization: `Bearer ${authData.token}` },
            });

            res.status === 200 ? setIsError(false) : setIsError(true);
            setModalResponse(res);
            setModalVisible(true);
            fetchOrderRequestContext();


        } catch (error) {
            ToastAndroid.showWithGravity(
                "Unable to submit request. Please try again later",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            setLoader(false);

        } finally {
            setLoader(false);

        }


    }

    const fetchBranches = async () => {
        setShowLoader(true);
        try {
            let response = await axios({
                method: 'GET',
                url: `/branches`,
                headers: { Authorization: `Bearer ${authData.token}` },
            });
            setBranches(response?.data?.data?.branch);

            // console.log(response.data.data.price_calculator);
        } catch (error: any) {
            ToastAndroid.showWithGravity(
                "Unable to fetch branches. Please try again later",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }




    useEffect(() => {
        fetchBranches();
    }, []);

    return (
        <View style={styles.container}>
            <Overlay
                isVisible={modalVisible}
                onBackdropPress={() => {
                    setModalVisible(!modalVisible);
                }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                style={{ justifyContent: "flex-end", margin: 0, position: "relative" }}
            >
                <TouchableHighlight
                    onPress={() => {
                        setModalVisible(!modalVisible);
                        navigation.navigate('Dashboard')
                    }}
                    style={{
                        borderRadius:
                            Math.round(
                                Dimensions.get("window").width + Dimensions.get("window").height
                            ) / 2,
                        width: Dimensions.get("window").width * 0.13,
                        height: Dimensions.get("window").width * 0.13,
                        backgroundColor: "#fff",
                        position: "absolute",
                        //   top: 1 / 2,
                        marginHorizontal: Dimensions.get("window").width * 0.43,
                        marginVertical: Dimensions.get("window").width * 0.76,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    underlayColor="#ccc"
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: "#000",
                            fontFamily: "Montserrat_900Black",
                        }}
                    >
                        &#x2715;
                    </Text>
                </TouchableHighlight>
                {!isError ? (
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.modalHeaderCloseText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <SuccessSvg />
                                <Text style={styles.modalHeading}>
                                    You have{" "}
                                    <Text style={{ color: "#074A74" }}>successfully</Text> applied
                                    for {"Product Loan"}
                                </Text>

                                {modalResponse && (
                                    <Text
                                        style={{
                                            color: "#474A57",
                                            fontFamily: "Montserrat_500Medium",
                                            marginTop: 30,
                                            marginHorizontal: 30,
                                            fontSize: 12,
                                            textAlign: "center",
                                        }}
                                    >
                                        {modalResponse.message}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.modalHeaderCloseText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableHighlight
                                    style={{
                                        borderRadius:
                                            Math.round(
                                                Dimensions.get("window").width +
                                                Dimensions.get("window").height
                                            ) / 2,
                                        width: Dimensions.get("window").width * 0.3,
                                        height: Dimensions.get("window").width * 0.3,
                                        backgroundColor: "#DB2721",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    underlayColor="#ccc"
                                >
                                    <Text
                                        style={{
                                            fontSize: 68,
                                            color: "#fff",
                                            fontFamily: "Montserrat_900Black",
                                        }}
                                    >
                                        &#x2715;
                                    </Text>
                                </TouchableHighlight>
                                <Text style={styles.modalHeading}>
                                    Sorry! Your Order Request is{" "}
                                    <Text style={{ color: "red" }}>unsuccessful</Text>
                                </Text>

                                <Text style={styles.errText}>
                                    {modalResponse?.error_message}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>

            <View style={styles.calculator}>
                <Text style={styles.header}>Product Request</Text>



                <View
                    style={{
                        backgroundColor: 'white',
                        marginVertical: 3,
                    }}
                >


                </View>

                <View
                    style={{
                        backgroundColor: 'white',
                        marginVertical: 20,
                        zIndex: 1
                    }}>
                    <Text
                        style={{
                            color: '#074A74',
                            fontFamily: 'Montserrat_500Medium',
                            fontSize: 12,
                            marginBottom: 10,
                        }}>Branch (Optional)</Text>
                    <DropDownPicker
                        placeholder='Select Branch'
                        placeholderStyle={{
                            color: "#074A74",
                            fontFamily: 'Montserrat_500Medium',
                        }}
                        selectedItemContainerStyle={{
                            backgroundColor: '#E8EBF7',

                        }}
                        containerStyle={{
                            borderColor: "#074A74"
                        }}
                        listMode='MODAL'
                        open={open}
                        value={branch}
                        items={branches}
                        setOpen={setOpen}
                        setValue={setBranch}
                        setItems={setBranches}
                        dropDownContainerStyle={{
                            zIndex: 1,
                            backgroundColor: "#E8EBF7",
                        }}
                        listItemLabelStyle={{
                            color: "#074A74",
                            fontFamily: 'Montserrat_500Medium',
                        }}
                        schema={{
                            label: 'name',
                            value: 'name',
                        }} />
                </View>

                <View
                    style={{
                        backgroundColor: 'white',
                        marginVertical: 20,
                    }}>
                    <Text
                        style={{
                            color: '#074A74',
                            fontFamily: 'Montserrat_500Medium',
                            fontSize: 12,
                            marginBottom: 10,
                        }}>Agent (Optional)</Text>
                    <TextInput style={{
                        backgroundColor: "#E8EBF7",
                        color: "#72788D",
                        paddingVertical: 8,
                        borderWidth: 0.5,
                        borderRadius: 2,
                        borderColor: "#aaa",
                        paddingHorizontal: 10,
                        fontSize: 15,
                        fontFamily: "Montserrat_600SemiBold",
                    }}
                        value={staffName}
                        onChangeText={setStaffName}
                    ></TextInput>
                </View>
                <Pressable
                    style={{
                        backgroundColor: '#074A74',
                        alignItems: 'center',
                        paddingVertical: 15,
                        borderRadius: 5,
                        marginVertical: 10,
                    }}
                    onPress={doSome}
                >
                    {loader ? (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                            }}
                        >
                            <Image
                                source={require("../assets/gifs/loader.gif")}
                                style={{ width: 60, height: 27 }}
                            />
                        </View>
                    ) : (<Text style={{ fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: 'white' }}>
                        Apply
                    </Text>)}

                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingVertical: 30,
    },
    calculator: {
        flex: 1,

        marginTop: 20,
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    header: {
        fontFamily: 'Montserrat_800ExtraBold',
        color: '#074A74',
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#E8EBF7',
        color: '#72788D',
        paddingVertical: 8,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#aaa',
        paddingHorizontal: 10,
        fontSize: 15,
        fontFamily: 'Montserrat_600SemiBold',
        alignSelf: 'center',
        marginVertical: 10,
    },
    label: {
        color: '#074A74',
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
    errText: {
        fontSize: 15,
        marginTop: 20,
        paddingHorizontal: 15,
        textAlign: "center",
        color: "#000",
    },

});
