import { Dimensions, Pressable, StyleSheet, Switch } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CurrencyInput from 'react-native-currency-input';
import { useContext, useEffect, useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Constants from 'expo-constants';
import businessTypes from '../lib/calculator.json';
import repaymentDurations from '../lib/repaymentDuration.json';
// import {cashLoan, calculate} from '../lib/calculator';
let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export default function Calculator({ navigation, route }: Props) {
	const { authData, setAuthData, showLoader, setShowLoader } =
		useContext(AuthContext);
	const [value, setValue] = useState(null);
	const [sliderValue, setSliderValue] = useState([3]);
	const [calculator, setCalculator] = useState([]);
	const [downPayment, setDownPayment] = useState();
	const [repayment, setRepayment] = useState();



	const [isMonthly, setIsMonthly] = useState(false);
	const [isCollateral, setIsCollateral] = useState(false);

	const toggleSwitchM = () => setIsMonthly((previousState) => !previousState);
	const toggleSwitchC = () =>
		setIsCollateral((previousState) => !previousState);

	const minMonth = 3;
	const maxMonth = 12;
	const cashBusinessTypes = businessTypes.filter((item) => {
		return !(
			item.status == 0 ||
			item.slug.includes('ac') ||
			item.slug.includes('ap_products')
		);
	});

	const selectBusinessType = (amount) => {
		let res = cashBusinessTypes.find(item => {
			if(amount >= 500000){
				return item.slug == 'ap_super_loan-new'
			  }else if(amount > 120000 && amount < 500000 && !isCollateral){
				  return item.slug == 'ap_cash_loan-no_collateral'
			  }else if(amount >= 70000 && amount <= 120000 && !isCollateral){
				 return item.slug =='ap_starter_cash_loan-no_collateral'
			  }else if(amount > 120000 && amount < 500000 && isCollateral){
				  return item.slug == 'ap_cash_loan-product'
			  }else if(amount >= 70000 && amount <= 120000 && isCollateral){
				 return item.slug =='ap_starter_cash_loan'
			  }
		});
		// console.log(res, amount);
		return res;
	}

	const getCalc = () => {
		try {
			let rDur = repaymentDurations.find((item)=>{
				return item.numeral === sliderValue[0];
			})
			let data = {
				repayment_duration_id: rDur,
				payment_type_id: downPaymentRate,

			};
			const params = calculator.find((x) => {
				console.log(selectBusinessType(value), downPaymentRate, rDur)
				return x.business_type_id === selectBusinessType(value).id &&
				x.down_payment_rate_id === downPaymentRate.id && 
				x.repayment_duration_id ===  rDur
			});
			const { total, actualDownpayment } = cashLoan(
                value,
                data,
                params,
                0
              );

			  console.log(total, actualDownpayment);
			
		} catch (error) {
			console.log(error);
		}
	}
	const downPaymentRate = {
		id: 2,
		name: 'twenty',
		percent: 20,
		status: 1,
	};
	

	const cashLoan = (productPrice, data, params, percentage_discount) => {
		console.log(params);
		const count = repaymentCount(data.repayment_duration_id.value, 14);
		const actualDownpayment = (data.payment_type_id.percent / 100) * productPrice;
		const residual = productPrice - actualDownpayment;
		const principal = residual / count;
		const interest = (params.interest / 100) * residual;
		const tempActualRepayment = (principal + interest) * count;
		var biMonthlyRepayment = Math.round(tempActualRepayment / count / 100) * 100;
		const actualRepayment = biMonthlyRepayment * count;
		let total = Math.ceil((actualDownpayment + actualRepayment) / 100) * 100;
		if (percentage_discount > 0) {
		  var rePayment = actualRepayment - (actualRepayment * percentage_discount) / 100;
		} else {
		  var rePayment = actualRepayment;
		}
		total = actualRepayment + actualDownpayment;
		return { total, actualDownpayment, rePayment };
	  };

	  const repaymentCount = (days, cycle) => {
		const result = days / cycle;
		if (result >= 24) {
		  return 24;
		} else if (result >= 18) {
		  return 18;
		} else if (result >= 12) {
		  return 12;
		} 
		if (result >= 6) {
		  return 6;
		}
		return 3;
	  };

	const fetchCalculator = async () => {
		setShowLoader(true);
		try {
			let response = await axios({
				method: 'GET',
				url: `/price-calculators`,
				headers: { Authorization: `Bearer ${authData.token}` },
			});
			setCalculator(response?.data?.data?.price_calculator);
		} catch (error: any) {}
	};
	useEffect(() => {
		fetchCalculator();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.calculator}>
				<Text style={styles.header}>Calculator</Text>

				<Text style={{ color: '#074A74' }}>How much do you want to loan?</Text>
				<CurrencyInput
					style={[
						styles.input,
						{ width: Dimensions.get('window').width * 0.92 },
					]}
					value={value}
					onChangeValue={setValue}
					prefix="₦"
					delimiter=","
					separator="."
					precision={2}
					onChangeText={(formattedValue) => {}}
				></CurrencyInput>
				<View
					style={{
						flexDirection: 'row',
						backgroundColor: 'white',
						justifyContent: 'space-between',
						marginVertical: 20,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'white',
							alignItems: 'center',
						}}
					>
						<Switch
							trackColor={{ false: '#767577', true: '#81b0ff' }}
							thumbColor={isMonthly ? '#074A74' : '#f4f3f4'}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitchM}
							value={isMonthly}
						/>
						<Text style={{ color: '#074A74' }}>Bi-Monthly</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'white',
							alignItems: 'center',
						}}
					>
						<Switch
							trackColor={{ false: '#767577', true: '#81b0ff' }}
							thumbColor={isCollateral ? '#074A74' : '#f4f3f4'}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitchC}
							value={isCollateral}
						/>
						<Text style={{ color: '#074A74' }}>Collateral</Text>
					</View>
				</View>
				<View
					style={{
						backgroundColor: 'white',
						marginVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'white',
							justifyContent: 'space-between',
						}}
					>
						<Text style={styles.label}>For how long?</Text>
						<Text style={styles.label}>Months</Text>
					</View>
					<Slider
						value={sliderValue}
						onValueChange={(value: []) => {
							setValue(value);
						}}
						thumbStyle={{
							backgroundColor: '#074A74',
						}}
						minimumValue={minMonth}
						maximumValue={maxMonth}
						step={3}
					/>
					<View
						style={{
							flexDirection: 'row',
							backgroundColor: 'white',
							justifyContent: 'space-between',
						}}
					>
						<Text style={styles.label}>{minMonth}</Text>
						<Text style={styles.label}>6</Text>
						<Text style={styles.label}>9</Text>
						<Text style={styles.label}>{maxMonth}</Text>
					</View>
				</View>

				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						marginVertical: 20,
					}}
				>
					<View
						style={{
							backgroundColor: '#D9D9D9',
							alignItems: 'center',
							flex: 1,
							paddingVertical: 15,
						}}
					>
						<Text
							style={{
								color: '#074A74',
								fontFamily: 'Montserrat_500Medium',
								fontSize: 10,
								marginBottom: 10,
							}}
						>
							Your Downpayment
						</Text>
						<Text
							style={{
								color: '#074A74',
								fontFamily: 'Montserrat_800ExtraBold',
								fontSize: 25,
							}}
						>
							{downPayment}
						</Text>
					</View>
					<View
						style={{
							backgroundColor: 'rgba(7, 74, 116, 0.63)',
							flex: 1,
							alignItems: 'center',
							paddingVertical: 15,
						}}
					>
						<Text
							style={{
								color: 'white',
								fontFamily: 'Montserrat_500Medium',
								fontSize: 10,
								marginBottom: 10,
							}}
						>
							Your Monthly Repayment
						</Text>
						<Text
							style={{
								color: 'white',
								fontFamily: 'Montserrat_800ExtraBold',
								fontSize: 25,
							}}
						>
							{repayment}
						</Text>
					</View>
				</View>
				<Pressable
					style={{
						backgroundColor: '#074A74',
						alignItems: 'center',
						paddingVertical: 15,
						borderRadius: 5,
						marginVertical: 10,
					}}
				>
					<Text style={{ fontSize: 16, fontFamily: 'Montserrat_600SemiBold' }}>
						Apply
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
		paddingVertical: 30,
	},
	calculator: {
		flex: 1,

		marginTop: 20,
		backgroundColor: 'white',
		paddingHorizontal: 20,
	},
	header: {
		fontFamily: 'Montserrat_800ExtraBold',
		color: '#074A74',
		textAlign: 'center',
		fontSize: 25,
		marginBottom: 20,
	},
	input: {
		backgroundColor: '#E8EBF7',
		color: '#72788D',
		paddingVertical: 8,
		borderWidth: 0.5,
		borderRadius: 2,
		borderColor: '#aaa',
		paddingHorizontal: 10,
		fontSize: 15,
		fontFamily: 'Montserrat_600SemiBold',
		alignSelf: 'center',
		marginVertical: 10,
	},
	label: {
		color: '#074A74',
	},
});
