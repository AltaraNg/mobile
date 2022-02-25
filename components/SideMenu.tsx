import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "../components/Themed";
import Header from '../components/Header'
import MenuItems from "./MenuItems";

export default function SideMenu() {
  return (
    <View style={styles.container}>
      <Header backgroundColor='white' />
      <View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    left:0,
    zIndex:10,
    width:230,
    height:'93%',
    backgroundColor:'white'
  },
  text:{
      color:'black'
  }
});