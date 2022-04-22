import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pressable } from "react-native";
export default function RadioButton({ data, onSelect }) {
const [userOption, setUserOption] = useState(null);
const selectHandler = (value) => {
  onSelect(value);
  setUserOption(value);
};
  return (
    <View style={{ flexDirection: "row" }}>
      {data.map((item) => {
        return (
          <View style={{ flexDirection: "row" }} key={item.label}>
            <Pressable
              style={{ flexDirection: "row" }}
              onPress={() => selectHandler(item.value)}
            >
              <View style={styles.circle}>
                <View
                  style={[
                    styles.circle2,
                    item.value === userOption
                      ? { backgroundColor: "#aaa" }
                      : { backgroundColor: "#fff" },
                  ]}
                ></View>
              </View>
              <Text style={{ paddingRight: 25 }} key={item.label}>
                {" "}
                {item.value}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  option: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    flexDirection: "row",
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
