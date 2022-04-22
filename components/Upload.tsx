import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Pressable } from "react-native";
import {ArrowUp} from "../assets/svgs/svg"
export default function Upload({color, document  }) {
  const [userOption, setUserOption] = useState(null);
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <ArrowUp />
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontFamily: "Montserrat_700Bold" }}>{document}</Text>
        <Text style={{ color: "#888" }}>Click here to upload file</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 90,
    width: Dimensions.get("window").width * 0.94,
    flexDirection: "row",
    borderRadius:3,
    alignItems:'center',
    justifyContent:'space-evenly',
    marginBottom:10,

  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#aaa",
  },
  circle2: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 0.5,
    borderColor: "#aaa",
  },
});
