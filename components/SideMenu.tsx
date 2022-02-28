import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "../components/Themed";
import Header from "../components/Header";
import Svg, { Circle, Rect, Path } from "react-native-svg";

export default function SideMenu() {
  return (
    <View style={styles.container}>
      <Header backgroundColor="white" />
      <View style={styles.div}>
        <Pressable onPress={handleIntroCompleted}>
          <View style={styles.menuItem}>
            <ProfileSvg />
            <Text style={styles.text}>View Profile</Text>
          </View>
        </Pressable>
        <View style={styles.menuItem}>
          <EditProfileSvg />
          <Text style={styles.text}>Edit Profile</Text>
        </View>
        <View style={styles.menuItem}>
          <LogOut />
          <Text style={styles.text}>Log Out</Text>
        </View>
      </View>
    </View>
  );
}
const handleIntroCompleted = function(){
  alert("This is a profile section")
}
const ProfileSvg = function () {
  return (
    <Svg width="20" height="21" viewBox="0 0 20 21" fill="none">
      <Path
        d="M10.0001 20.5987C8.48816 20.6029 6.99532 20.2608 5.6361 19.5986C5.13865 19.3567 4.66203 19.074 4.2111 18.7536L4.0741 18.6536C2.83392 17.7382 1.81997 16.5509 1.1101 15.1826C0.375836 13.7665 -0.00499271 12.1938 4.94229e-05 10.5986C4.94229e-05 5.07579 4.47725 0.598633 10.0001 0.598633C15.5229 0.598633 20.0001 5.07579 20.0001 10.5986C20.0051 12.193 19.6247 13.765 18.8911 15.1806C18.1822 16.5481 17.1697 17.7351 15.9311 18.6506C15.4639 18.9926 14.968 19.2937 14.4491 19.5506L14.3691 19.5906C13.009 20.2563 11.5144 20.6012 10.0001 20.5987ZM10.0001 15.5986C8.50158 15.5957 7.12776 16.4327 6.4431 17.7656C8.68449 18.8758 11.3157 18.8758 13.5571 17.7656V17.7606C12.8716 16.4291 11.4977 15.5941 10.0001 15.5986ZM10.0001 13.5986C12.1662 13.6015 14.1635 14.7687 15.2291 16.6546L15.2441 16.6416L15.2581 16.6296L15.2411 16.6446L15.2311 16.6526C17.7601 14.4677 18.6644 10.941 17.4987 7.80874C16.3331 4.67651 13.3432 2.59895 10.0011 2.59895C6.65901 2.59895 3.66909 4.67651 2.50345 7.80874C1.33781 10.941 2.2421 14.4677 4.7711 16.6526C5.83736 14.7677 7.83446 13.6013 10.0001 13.5986ZM10.0001 12.5986C7.79096 12.5986 6.0001 10.8078 6.0001 8.59863C6.0001 6.38949 7.79096 4.59863 10.0001 4.59863C12.2092 4.59863 14.0001 6.38949 14.0001 8.59863C14.0001 9.6595 13.5787 10.6769 12.8285 11.4271C12.0784 12.1772 11.061 12.5986 10.0001 12.5986ZM10.0001 6.59863C8.89553 6.59863 8.0001 7.49406 8.0001 8.59863C8.0001 9.7032 8.89553 10.5986 10.0001 10.5986C11.1047 10.5986 12.0001 9.7032 12.0001 8.59863C12.0001 7.49406 11.1047 6.59863 10.0001 6.59863Z"
        fill="#9C9696"
      />
    </Svg>
  );
};

const EditProfileSvg = function () {
  return (
    <Svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <Path
        d="M5 18.9892H9.24C9.37161 18.99 9.50207 18.9647 9.62391 18.915C9.74574 18.8652 9.85656 18.7919 9.95 18.6992L16.87 11.7692L19.71 8.9892C19.8037 8.89623 19.8781 8.78563 19.9289 8.66377C19.9797 8.54192 20.0058 8.41121 20.0058 8.2792C20.0058 8.14719 19.9797 8.01648 19.9289 7.89462C19.8781 7.77276 19.8037 7.66216 19.71 7.5692L15.47 3.2792C15.377 3.18547 15.2664 3.11107 15.1446 3.06031C15.0227 3.00954 14.892 2.9834 14.76 2.9834C14.628 2.9834 14.4973 3.00954 14.3754 3.06031C14.2536 3.11107 14.143 3.18547 14.05 3.2792L11.23 6.1092L4.29 13.0392C4.19732 13.1326 4.12399 13.2435 4.07423 13.3653C4.02446 13.4871 3.99924 13.6176 4 13.7492V17.9892C4 18.2544 4.10536 18.5088 4.29289 18.6963C4.48043 18.8838 4.73478 18.9892 5 18.9892ZM14.76 5.3992L17.59 8.2292L16.17 9.6492L13.34 6.8192L14.76 5.3992ZM6 14.1592L11.93 8.2292L14.76 11.0592L8.83 16.9892H6V14.1592ZM21 20.9892H3C2.73478 20.9892 2.48043 21.0946 2.29289 21.2821C2.10536 21.4696 2 21.724 2 21.9892C2 22.2544 2.10536 22.5088 2.29289 22.6963C2.48043 22.8838 2.73478 22.9892 3 22.9892H21C21.2652 22.9892 21.5196 22.8838 21.7071 22.6963C21.8946 22.5088 22 22.2544 22 21.9892C22 21.724 21.8946 21.4696 21.7071 21.2821C21.5196 21.0946 21.2652 20.9892 21 20.9892Z"
        fill="#888C96"
      />
    </Svg>
  );
};

const LogOut = function () {
  return (
    <Svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <Path
        d="M16.3135 8.19019L20.2499 12.1277L16.3135 16.0652"
        stroke="#888C96"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.75 12.1277H20.2472"
        stroke="#888C96"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.75 20.3777H4.5C4.30109 20.3777 4.11032 20.2987 3.96967 20.158C3.82902 20.0174 3.75 19.8266 3.75 19.6277V4.62769C3.75 4.42877 3.82902 4.23801 3.96967 4.09736C4.11032 3.9567 4.30109 3.87769 4.5 3.87769H9.75"
        stroke="#888C96"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    zIndex: 10,
    width: 200,
    height: "93%",
    backgroundColor: "white",
  },
  menuItem: {
    backgroundColor: "white",
    flexDirection: "row",
    marginLeft:30,
    alignItems:"center",
    paddingBottom:70
  },
  text: {
    color: "#9C9696",
    fontFamily: "Montserrat_500Medium",
    marginLeft:7
  },
  div:{
    backgroundColor:"white",
    paddingTop:80
  }
});
