import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "../components/Themed";

export default function MenuItems(props:any) {
  return (
    <View style={styles.container}>
      <slot></slot>
      <Text>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection:"row"
  },
  text:{
      color:'black'
  }
});