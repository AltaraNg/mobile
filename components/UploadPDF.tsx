import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ToastAndroid, TouchableOpacity } from "react-native";
import { ArrowUp } from "../assets/svgs/svg";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function UploadPDF(props) {
    const url = process.env.EXPO_PUBLIC_API_URL;
    axios.defaults.baseURL = url;
    const { authData, setAuthData } = useContext(AuthContext);
    const [showLoader, setShowLoader] = useState(false);
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(null);

    const pickImage = async () => {
        const result = await DocumentPicker.getDocumentAsync({});
        if (!result.canceled) {
            setShowLoader(true);
            // ImagePicker saves the taken photo to disk and returns a local URI to it
            const localUri = result.assets[0].uri;
            const filename = localUri.split("/").pop();
            // Infer the type of the image
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `pdf/${match[1]}` : `pdf`;

            // Upload the image using the fetch and FormData APIs
            const formData = new FormData();
            formData.append("document", {
                uri: localUri,
                type: type,
                name: filename,
            });
            formData.append("type", props.type);
            const res = await fetch(
                `${url}upload/document/s3
`,
                {
                    method: "post",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                        "Content-Type": "multipart/form-data; ",
                    },
                }
            );
            const responseJson = await res.json();
            if (responseJson.status == "success") {
                setShowLoader(false);
                props.onRequest();
                setImage(result.assets[0].uri);
                setImageName(result.assets[0].name);

                const res = responseJson.data.document;
                setAuthData((prevState: object) => {
                    const updatedState = {
                        ...prevState,
                    };
                    updatedState.documents = updatedState.documents || [];
                    updatedState.documents.push({ name: props.type, url: res });
                    return updatedState;
                });

                ToastAndroid.showWithGravity(responseJson.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
            } else {
                setImage(null);
                props.onRequest();
                setShowLoader(false);
                ToastAndroid.showWithGravity("The document failed to upload", ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={pickImage}>
                <View style={[styles.container, (image || showLoader) && { display: "none" }]}>
                    <View style={[styles.triangle, (image || showLoader) && { display: "none" }]}>
                        <View style={[styles.triangleCorner, showLoader && { display: "none" }]}></View>
                    </View>
                    <ArrowUp />
                    <View
                        style={{
                            alignItems: "center",
                            flexDirection: "column",
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 11 }}>{props.document}</Text>
                        <Text style={{ color: "#888", textAlign: "center", fontSize: 10 }}>Click here to upload file</Text>
                    </View>
                </View>
                {showLoader ? (
                    <Image source={require("../assets/gifs/loader.gif")} style={{ width: 60, height: 60 }} />
                ) : (
                    image && <Image source={require("../assets/images/pdf_logo.png")} style={{ width: 120, height: 150, zIndex: 10 }} />
                )}
                {
                    image &&
                    <Text style={{ color: "#888", textAlign: "center", fontSize: 10 }}>{imageName}</Text>

                }

            </TouchableOpacity>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        height: 150,
        width: 120,
        flexDirection: "column",
        borderRadius: 3,
        alignItems: "center",
        paddingHorizontal: 10,
        justifyContent: "center",
        marginBottom: 30,
        marginTop: 10,
        borderStyle: "dashed",
        borderWidth: 1.2,
        borderColor: "#074A74",
        zIndex: 1,
        position: "relative",
    },
    triangle: {
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderTopWidth: 0,
        borderRightWidth: 30,
        borderBottomWidth: 30,
        borderLeftWidth: 0,
        borderTopColor: "transparent",
        borderRightColor: "#fff",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        position: "absolute",
        right: -3,
        top: -3,
        zIndex: 20,
    },
    triangleCorner: {
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderTopWidth: 28,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 28,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: "#074A74",
        position: "absolute",
        right: -29,
        top: 2,
        zIndex: 2,
        shadowColor: "rgba(0,0,0,0.20)",
        elevation: 20,
    },
});
