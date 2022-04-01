import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import * as Device from 'expo-device';

import Header from '../components/Header';
import { Text, View } from '../components/Themed';
import { RootStackParamList, RootTabScreenProps } from '../types';
import { useContext, useRef, useState } from 'react';
import CustomTextInput from '../lib/CustomTextInput';
import { GenericStyles } from '../styles/GenericStyles';
import Lock from '../assets/svgs/lock.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Context as AuthContext } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function Otp({ navigation, route }: Props) {
	let [errorText, setErrorText] = useState('');
	const { state, signin } = useContext(AuthContext);
	const phone = route.params;

	let url = 'auth/login';
	const [otpArray, setOtpArray] = useState(['', '', '', '']);

	const refCallback = (textInputRef) => (node) => {
		textInputRef.current = node;
	};

	const firstTextInputRef = useRef(null);
	const secondTextInputRef = useRef(null);
	const thirdTextInputRef = useRef(null);
	const fourthTextInputRef = useRef(null);

	const onOtpChange = (index) => {
		return (value: Number) => {
			if (isNaN(Number(value))) {
				// do nothing when a non digit is pressed
				return;
			}
			const otpArrayCopy = otpArray.concat();
			otpArrayCopy[index] = value;
			setOtpArray(otpArrayCopy);
			if (index === 3) {
				const data = {
					otp: otpArrayCopy.join(''),
					phone_number: phone?.phone_number,
					device_name: Device.deviceName,
				};
				const error = 'OTP is incorrect';
				let res = signin(data);
				if (res === undefined) {
					setTimeout(() => {
						setErrorText(error);
					}, 3000);
				}
			}

			// auto focus to next InputText if value is not blank
			if (value !== '') {
				if (index === 0) {
					secondTextInputRef.current.focus();
				} else if (index === 1) {
					thirdTextInputRef.current.focus();
				} else if (index === 2) {
					fourthTextInputRef.current.focus();
				}
			}
		};
	};

	const onOtpKeyPress = (index) => {
		return ({ nativeEvent: { key: value } }) => {
			// auto focus to previous InputText if value is blank and existing value is also blank
			if (value === 'Backspace' && otpArray[index] === '') {
				setErrorText('');
				if (index === 1) {
					firstTextInputRef.current.focus();
				} else if (index === 2) {
					secondTextInputRef.current.focus();
				} else if (index === 3) {
					thirdTextInputRef.current.focus();
				}

				/**
				 * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
				 * doing this thing for us
				 * todo check this behaviour on ios
				 */
				if (index > 0) {
					const otpArrayCopy = otpArray.concat();
					otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
					setOtpArray(otpArrayCopy);
				}
			}
		};
	};
	return (
		<View style={styles.container}>
			<Header></Header>

			<Text style={styles.title}>Enter the Pin</Text>
			<Text style={styles.simple}>
				We sent a pin to your phone number to confirm
			</Text>
			<View style={styles.svg}>
				<Lock size={72} />
			</View>
			<View style={[GenericStyles.row, GenericStyles.mt12, styles.otp]}>
				{[
					firstTextInputRef,
					secondTextInputRef,
					thirdTextInputRef,
					fourthTextInputRef,
				].map((textInputRef, index) => (
					<CustomTextInput
						containerStyle={[GenericStyles.fill, GenericStyles.mr12]}
						key={index}
						autoFocus={index === 0 ? true : undefined}
						keyboardType={'numeric'}
						value={otpArray[index]}
						onKeyPress={onOtpKeyPress(index)}
						maxLength={1}
						style={[styles.otpText, GenericStyles.centerAlignedText]}
						onChangeText={onOtpChange(index)}
						refCallback={refCallback(textInputRef)}
					/>
				))}
			</View>
			{errorText != '' ? (
				<Text style={styles.errorText}>{errorText}</Text>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EFF5F9',
		flexDirection: 'column',
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
	inputElement: {
		borderWidth: 1,
		borderColor: '#074A74',
		borderRadius: 5,
		height: 50,
		fontSize: 32,
		marginHorizontal: 10,
		paddingHorizontal: 10,

		color: '#074A74',
	},
	svg: {
		justifyContent: 'center',
		marginVertical: 20,
		flexDirection: 'row',
		backgroundColor: '#EFF5F9',
	},
	inputContainer: {
		marginVertical: 10,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	errorText: {
		color: 'red',
		fontSize: 15,
		textAlign: 'center',
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
	otpText: {
		color: '#074A74',
		fontSize: 18,
		width: '100%',
		textAlign: 'center',
		fontWeight: '700',
	},

	lock: {
		flex: 1,
		justifyContent: 'center',
	},
	otp: {
		backgroundColor: '#EFF5F9',
	},
});
