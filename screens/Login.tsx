import { Pressable, StyleSheet, TextInput } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef } from 'react';
import {post} from '../utilities/api';

import { Text, View } from '../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
type OtpNavigationProps = StackNavigationProp<RootStackParamList, 'OTP'>;

interface OtpProps {
	navigation: OtpNavigationProps;
}


export default function Login({ navigation }: OtpProps) {
	const [userPhone, setUserPhone] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorText, setErrorText] = useState('');
	let url = 'otp/send'

	 const handleLogin = async () => {
		setErrorText('');
		if (!userPhone) {
			alert('Please fill phone');
			return;
		}
		setLoading(true);
		let data = {
			phone_number : userPhone
		}
		post(url, data).then(res => {
			navigation.navigate('OTP');
		}).catch(err => {
			console.log(err, userPhone);
		}).finally(() => {
			navigation.navigate('OTP');
		})
	};
	return (
		<View style={styles.container}>
			<Header></Header>

			<Text style={styles.title}>Enter phone number</Text>
			<Text style={styles.simple}>
				We'll send a verification code to this number
			</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Phone Number</Text>
				<TextInput
					keyboardType="phone-pad"
					onChangeText={(userPhone) => setUserPhone(userPhone)}
					style={styles.input}
				/>
			</View>
			<LinearGradient
				colors={['#074A74', '#089CA4']}
				style={styles.buttonContainer}
				start={{ x: 1, y: 0.5 }}
				end={{ x: 0, y: 0.5 }}
			>
				<Pressable style={[styles.button]} onPress={handleLogin}>
					<Text style={styles.buttonText}>Next</Text>
				</Pressable>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		marginTop: 70,
		marginHorizontal: 40,
		fontSize: 25,
		color: '#074A74',
		fontFamily: 'Montserrat_700Bold',
	},
	simple: {
		fontFamily: 'Montserrat_400Regular',
		marginTop: 10,
		marginHorizontal: 40,
		fontSize: 12,
		color: '#72788D',
	},
	input: {
		borderWidth: 1,
		borderColor: '#074A74',
		borderRadius: 5,
		height: 50,
		fontSize: 32,
		paddingHorizontal: 10,
		color: '#074A74',
	},
	inputContainer: {
		marginHorizontal: 40,
		marginTop: 45,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginHorizontal: 40,
		marginTop: 50,
		borderColor: '#074A74',
		borderWidth: 1,
		borderRadius: 10,
	},
	button: {
		flex: 1,
		paddingVertical: 15,
		marginHorizontal: 8,
		borderRadius: 24,
	},
	buttonText: {
		color: '#ffffff',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 18,
	},
});
