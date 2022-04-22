import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {ArrowUp} from "../assets/svgs/svg"
import * as ImagePicker from "expo-image-picker";
export default function Upload({ document, }) {
    const [image, setImage] = useState(null);

     const pickImage = async () => {
       // No permissions request is necessary for launching the image library
       let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
       });

       if (!result.cancelled) {
         setImage(result.uri)
       }
     };
  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={[styles.container, image && { display: "none" }]}>
        <View style={[styles.triangle]}>
          <View
            style={[styles.triangleCorner, image && { display: "none" }]}
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
            {document}
          </Text>
          <Text style={{ color: "#888", textAlign: "center", fontSize: 10 }}>
            Click here to upload file
          </Text>
        </View>
      </View>
      {image && (
        <Image source={{ uri: image }} style={{ width: 120, height: 150, zIndex:10 }} />
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
