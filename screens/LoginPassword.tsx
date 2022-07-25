import {
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import React, { useState, createRef, useEffect } from "react";
import {EyeClose, EyeOpen} from '../assets/svgs/svg'
import { post } from "../utilities/api";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const [userPhone, setUserPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState('default');
  const [isDisabled, setIsDisabled] = useState(true);
  const [click, setClick] = useState(false);
  const toggleClick = () => setClick((value) => !value);
  let [errorText, setErrorText] = useState("");
  let url = "otp/send";

  const SetCustomer = (onDefault, NewCustomer, OldCustomer,)=>{
    return customer == 'default'
      ? onDefault
      : customer == 'new'
      ? NewCustomer
      : customer == 'old'
      ? OldCustomer
      : onDefault;
  }
  const handleLogin = async () => {
    setErrorText("");
    if (!userPhone) {
      alert("Please fill phone");
      return;
    }
    setLoading(true);
    let data = {
      phone_number: userPhone,
    };
    post(url, data)
      .then((res) => {
        navigation.navigate("OTP", { phone_number: userPhone });
      })
      .catch((err) => {
        let message = err?.response?.data?.data.errors?.phone_number[0];
        setErrorText(message);
        if (message !== "The selected phone number is invalid.") {
          navigation.navigate("OTP", { phone_number: userPhone });
        }
      })
      .finally(() => {
        setLoading(false);
        setIsDisabled(true);
      });
  };
    const handleLogin2 = async () => {
    
      setLoading(true);
      let data = {
        phone_number: userPhone,
      };
      post(url, data)
        .then((res) => {
            setCustomer('new');
            SetCustomer();
        })
        .catch((err) => {
          let message = err?.response?.data?.data.errors?.phone_number[0];
          setErrorText(message);
        })
        .finally(() => {
          setLoading(false);
          setIsDisabled(true);
        });
    };
        useEffect(() => {
          setCustomer('default')
        }, []);

  return (
    <View style={styles.container}>
      {/* {isLoading ? <ActivityIndicator size={'large'} /> : (<View> */}
      <Header></Header>

      <Text style={styles.title}>
        {SetCustomer(
          "Enter phone number",
          "Enter new password",
          "Enter password"
        )}
      </Text>
      <Text style={styles.simple}>
        {SetCustomer(
          "",
          "Password must contain a minimum length of 10 characters",
          "Enter your password to login"
        )}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          editable={customer !== "default" ? false : true}
          keyboardType="phone-pad"
          onChangeText={(userPhone) => {
            setUserPhone(userPhone);
            if (userPhone.length === 11 || customer !== "default") {
              setIsDisabled(false);
            } else {
              setIsDisabled(true);
            }
          }}
          value={userPhone}
          style={customer == "default" ? styles.input : styles.notDefault}
        />
        {customer == "new" && (
          <View style={{ backgroundColor: "#EFF5F9" }}>
            <View style={{ backgroundColor: "#EFF5F9", marginTop: 30 }}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                onChangeText={(password) => {
                  setPassword(password);
                }}
                value={password}
                style={styles.input}
                secureTextEntry={click ? true : false}
              />
              <Pressable
                style={{
                  backgroundColor: "#EFF5F9",
                  position: "absolute",
                  right: 8,
                  top: 35,
                }}
                onPress={toggleClick}
              >
                {click ? <EyeClose /> : <EyeOpen />}
              </Pressable>
            </View>
            <View style={{ backgroundColor: "#EFF5F9", marginTop: 30 }}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                onChangeText={(password) => {
                  setPassword(password);
                }}
                value={password}
                style={styles.input}
                secureTextEntry={click ? true : false}
              />
              <Pressable
                style={{
                  backgroundColor: "#EFF5F9",
                  position: "absolute",
                  right: 8,
                  top: 35,
                }}
                onPress={toggleClick}
              >
                {click ? <EyeClose /> : <EyeOpen />}
              </Pressable>
            </View>
          </View>
        )}
        {customer == "old" && (
          <View style={{ backgroundColor: "#EFF5F9", marginTop: 30 }}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              onChangeText={(password) => {
                setPassword(password);
              }}
              value={password}
              style={styles.input}
              secureTextEntry={click ? true : false}
            />
            <Pressable
              style={{
                backgroundColor: "#EFF5F9",
                position: "absolute",
                right: 8,
                top: 35,
              }}
              onPress={toggleClick}
            >
              {click ? <EyeClose /> : <EyeOpen />}
            </Pressable>
          </View>
        )}
        {errorText != "" ? (
          <Text style={styles.errorText}>{errorText}</Text>
        ) : null}
      </View>
      <LinearGradient
        colors={["#074A74", "#089CA4"]}
        style={[
          isDisabled ? styles.disabled : styles.buttonContainer,
          customer !== "default" ? { marginTop: 60 } : {},
        ]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
      >
        <Pressable
          style={[styles.button]}
          onPress={handleLogin2}
          disabled={isDisabled}
        >
          {loading ? (
            <Image
              source={require("../assets/gifs/loader.gif")}
              style={styles.image}
            />
          ) : (
            <Text style={styles.buttonText}>
              {SetCustomer("Continue", "Register", "Login")}
            </Text>
          )}
        </Pressable>
      </LinearGradient>
      {/* </View>)} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF5F9",
  },
  image: {
    width: Dimensions.get("window").height * 0.08,
    height: Dimensions.get("window").height * 0.08,
    marginVertical: -15,
  },
  title: {
    marginTop: 40,
    marginHorizontal: 40,
    fontSize: 25,
    color: "#074A74",
    fontFamily: "Montserrat_700Bold",
  },
  simple: {
    fontFamily: "Montserrat_400Regular",
    marginTop: 10,
    marginHorizontal: 40,
    fontSize: 12,
    color: "#72788D",
  },
  input: {
    borderWidth: 1,
    borderColor: "#074A74",
    borderRadius: 5,
    height: 50,
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#074A74",
  },
  notDefault: {
    borderWidth: 1,
    borderColor: "#074A74",
    borderRadius: 5,
    height: 50,
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#353232",
    opacity: 0.4,
  },
  inputContainer: {
    marginHorizontal: 40,
    marginTop: 45,
    backgroundColor: "#EFF5F9",
  },
  errorText: {
    color: "red",
    fontSize: 15,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#72788D",
    fontFamily: "Montserrat_700Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginTop: 320,
    borderColor: "#074A74",
    borderWidth: 1,
    borderRadius: 10,
  },

  disabled: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginTop: 320,
    borderColor: "#074A74",
    borderWidth: 1,
    borderRadius: 10,
    opacity: 0.5,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
