import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import Leaf from '../assets/svgs/leaf.svg';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Cards'>;

export default function Cards({
  navigation,
  route,
  height,
  width,
  title,
  amount,
  isDisabled,
  type,onRequest
}) {
  let url = Constants?.manifest?.extra?.URL;
  axios.defaults.baseURL = url;
  const { authData } = useContext(AuthContext);
  const [requestOrder, setRequestOrder] = useState(false);

  async function doSome() {
    try {
      let res = await axios({
        method: "POST",
        data: {
          order_type: type,
        },
        url: "/submit/request",
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      if (res.status === 200) {
        onRequest(res.data, "success", type);
        setRequestOrder(true);
      }
    } catch (error) {
      onRequest(error.response.data, "failed", type);
    }
  }
  const trackOrder = () => {
    navigation.navigate("OrderRequest");
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "rgba(156, 150, 150, 0.55)",
          height: height,
          width: width,
          position: "absolute",
          zIndex: 10,
        }}
      ></View>
      <Leaf style={styles.leaf} />
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.amount}>{amount}</Text>
      <View style={{ flexDirection: "row", backgroundColor: "transparent" }}>
        <LinearGradient
          colors={["#074A77", "#089CA4"]}
          style={styles.buttonContainer}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
        >
          <Pressable
            style={[styles.button]}
            onPress={doSome}
            disabled={isDisabled}
          >
            <Text style={styles.buttonText}>Order Now</Text>
          </Pressable>
        </LinearGradient>
        {requestOrder && (
          <LinearGradient
            colors={["#9C9696", "#DADADA"]}
            style={styles.buttonContainer}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
          >
            <Pressable
              style={[styles.button]}
              onPress={trackOrder}
              disabled={isDisabled}
            >
              <Text style={[styles.buttonText, { color: "black" }]}>
                Track Order
              </Text>
            </Pressable>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		height: 150,
		width: 300,
		backgroundColor: '#074A74',
		borderRadius: 5,
		marginBottom: 17,
		padding: 10,
		paddingLeft: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		fontFamily: 'Montserrat_700Bold',
		color: 'white',
	},
	leaf: {
		position: 'absolute',
		right: 0,
	},
	amount: {
		fontFamily: 'Montserrat_400Regular',
		color: '#98D4F9',
		paddingTop: 5,
		fontSize: 13,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginTop: 26,
		borderColor: '#074A74',
		borderWidth: 1,
		borderRadius: 10,
		width: 130,
		
		height:40,
	},
	button: {
		flex: 1,
		paddingVertical: 4,
		marginHorizontal: 8,
		borderRadius: 24,
	},
	buttonText: {
		color: '#ffffff',
		fontWeight: 'normal',
		textAlign: 'center',
		fontSize: 18,
	},
});
