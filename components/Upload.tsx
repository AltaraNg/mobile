import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ToastAndroid,
} from "react-native";
import { Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowUp } from "../assets/svgs/svg";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Constants from "expo-constants";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Upload(props) {
  let url = Constants?.manifest?.extra?.URL;
  axios.defaults.baseURL = url;
  const { authData, setAuthData } = useContext(AuthContext);
  const [showLoader, setShowLoader] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setShowLoader(true);
      // ImagePicker saves the taken photo to disk and returns a local URI to it
      let localUri = result.uri;
      let filename = localUri.split("/").pop();
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      formData.append("document", {
        uri: localUri,
        type: type,
        name: filename,
      });
      formData.append("type", props.type);
      let res = await fetch(`${url}document/upload`, {
        method: "post",
        body: formData,
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "multipart/form-data; ",
        },
      });
      let responseJson = await res.json();

      if (responseJson.status == "success") {
        setShowLoader(false);
        props.onRequest();
        setImage(result.uri);
        const res = responseJson.data.user
        setAuthData((prevState: object) => {
          return {
            ...prevState, user:{...res}}
        });
        ToastAndroid.showWithGravity(
          responseJson.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        setImage(null);
        props.onRequest();
        setShowLoader(false);
        ToastAndroid.showWithGravity(
          "The document failed to upload",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View
        style={[styles.container, (image || showLoader) && { display: "none" }]}
      >
        <View
          style={[
            styles.triangle,
            (image || showLoader) && { display: "none" },
          ]}
        >
          <View
            style={[styles.triangleCorner, showLoader && { display: "none" }]}
          ></View>
        </View>
        <ArrowUp />
        <View
          style={{
            alignItems: "center",
            flexDirection: "column",
            marginTop: 10,
          }}
        >
          <Text style={{ fontFamily: "Montserrat_700Bold", fontSize: 12 }}>
            {props.document}
          </Text>
          <Text style={{ color: "#888", textAlign: "center", fontSize: 10 }}>
            Click here to upload file
          </Text>
        </View>
      </View>
      {showLoader ? (
        <Image
          source={require("../assets/gifs/loader.gif")}
          style={{ width: 60, height: 60 }}
        />
      ) : (
        image && (
          <Image
            source={{ uri: image }}
            style={{ width: 120, height: 150, zIndex: 10 }}
          />
        )
      )}
    </TouchableOpacity>
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
