import {
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import React, { useState, createRef, useEffect } from "react";
import {
  EyeClose,
  EyeOpen,
  SmallCancel,
  DoubleCheck,
} from "../assets/svgs/svg";
import { post,get } from "../utilities/api";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginPassword({ navigation }: Props) {
  const [userPhone, setUserPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState('default');
  const [isDisabled, setIsDisabled] = useState(true);
  const [click, setClick] = useState(true);
  const toggleClick = () => setClick((value) => !value);
  let [errorText, setErrorText] = useState("");
  let url = `customer/exists/${userPhone}`;
  let login = "/auth/login"
  const auth = useAuth();

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
    setLoading(true);
    const data = {
      phone_number: userPhone,
      password: Password,
      device_name: Device.deviceName,
      login_type: "password",
      customer: customer,
    };
   let res = auth
     .signInPassword(
       data.phone_number,
       data.password,
       data.device_name,
       data.login_type,
       data.customer
     )
     .then((res) => {
        const error = "Password is incorrect";
        setTimeout(() => {
          setErrorText(error);
        }, 6000);
        setLoading(false);
     })
};

    const checkPhoneNumber = async () => {
    
      setLoading(true);
      let data = {
        phone_number: userPhone,
      };
      get(url)
        .then((res) => {
          res.data.data.has_password ? setCustomer('old') :setCustomer('new')
            
        })
        .catch((err) => {
          if (err.response.data.code == 404){
            setCustomer('new')
          }
          
          // setErrorText(message);
        })
        .finally(() => {
          setLoading(false);
          setIsDisabled(true)
          SetCustomer();
        });
    };
        useEffect(() => {
          
        }, []);

  return (
    <View style={styles.container}>
      {/* {isLoading ? <ActivityIndicator size={'large'} /> : (<View> */}
      <Header></Header>

      <Text style={styles.title}>
        {SetCustomer("Enter phone number", "Welcome 😊", "Welcome Back 😊")}
      </Text>
      <Text style={styles.simple}>
        {SetCustomer(
          "",
          "Password must contain a minimum length of 6 characters",
          "Enter your password to login"
        )}
      </Text>
      <ScrollView>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            editable={customer !== "default" ? false : true}
            keyboardType="phone-pad"
            onChangeText={(userPhone) => {
              setUserPhone(userPhone);
              if (userPhone.length === 11) {
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
                     if (password.length >= 6) {
                       setIsDisabled(false);
                     } else {
                       setIsDisabled(true);
                     }
                    setPassword(password);
                  }}
                  value={Password}
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
                    setConfirmPassword(password);
                   ( password !== Password && customer=='new')
                      ? [setWarning("notMatch"), setIsDisabled(true)]
                      : [setWarning("match"), setIsDisabled(false)];
                  }}
                  value={confirmPassword}
                  style={styles.input}
                  secureTextEntry={click ? true : false}
                />
                <View
                  style={{
                    backgroundColor: "#EFF5F9",
                    position: "absolute",
                    right: -30,
                    top: 35,
                  }}
                >
                  {warning &&
                    (warning == "notMatch" ? <SmallCancel /> : <DoubleCheck />)}
                </View>
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
                  if (password.length >= 6) {
                    setIsDisabled(false);
                  } else {
                    setIsDisabled(true);
                  }
                  setPassword(password);
                }}
                value={Password}
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
            onPress={customer == "default" ? checkPhoneNumber : handleLogin}
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
      </ScrollView>
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
