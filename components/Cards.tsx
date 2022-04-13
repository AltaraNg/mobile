import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import Leaf from '../assets/svgs/leaf.svg';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList } from '../types';


type Props = NativeStackScreenProps<RootStackParamList, 'Modal'>

export default function Cards(props: any) {
	let url = Constants?.manifest?.extra?.URL;
	axios.defaults.baseURL = url;
	const { authData } = useContext(AuthContext);


	async function doSome() {
    try {
      let res = await axios({
        method: 'POST',
        data: {
          order_type: props.type
        },
				url: '/submit/request',
				headers: { 'Authorization': `Bearer ${authData.token}` },
      })
      if(res.status === 200){
        props.onRequest(res.data, 'success', props.type)
      }
    } catch (error) {
      props.onRequest(error.response.data, 'failed', props.type)
	  
    }
  }
	return (
		<View style={styles.container}>
			<Leaf style={styles.leaf} />
			<Text style={styles.header}>{props.title}</Text>
			<Text style={styles.amount}>{props.amount}</Text>
			<LinearGradient
				colors={['#074A77', '#089CA4']}
				style={styles.buttonContainer}
				start={{ x: 1, y: 0.5 }}
				end={{ x: 0, y: 0.5 }}
			>
				<Pressable style={[styles.button]} onPress={doSome}>
					<Text style={styles.buttonText}>Order Now</Text>
				</Pressable>
			</LinearGradient>
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
		width: 169,
		height: 35,
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
