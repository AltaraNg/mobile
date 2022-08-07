import { Dimensions, Pressable, StyleSheet, Switch } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TextInput } from 'react-native-gesture-handler';
import CurrencyInput from 'react-native-currency-input';
import { useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export default function Calculator({ navigation, route }: Props) {
	const [value, setValue] = useState(null);
	const [sliderValue, setSliderValue] = useState(3);

	const [isMonthly, setIsMonthly] = useState(false);
	const [isCollateral, setIsCollateral] = useState(false);

	const toggleSwitchM = () => setIsMonthly((previousState) => !previousState);
	const toggleSwitchC = () => setIsCollateral((previousState) => !previousState);

    const minMonth = 3;
    const maxMonth = 12;

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
                            alignItems: 'center'

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
                            alignItems: 'center'
						}}
					>
						<Switch
							trackColor={{ false: '#767577', true: '#81b0ff' }}
							thumbColor={isCollateral ? '#074A74' : '#f4f3f4'}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitchC}
							value={isCollateral}
						/>
						<Text style={{ color: '#074A74' }}>Non-collateral</Text>
					</View>
				</View>
				<View
					style={{
						backgroundColor: 'white',
						marginVertical: 10,
					}}
				>
                    <View style={{
                        flexDirection: 'row',
						backgroundColor: 'white',
                        justifyContent: 'space-between'

                     }}>
                        <Text style={styles.label}>For how long?</Text>
                        <Text style={styles.label}>Months</Text>
                    </View>
					<Slider value={sliderValue}
                     onValueChange={setSliderValue}
                     thumbStyle={{
                        backgroundColor: "#074A74"
                     }}
                     minimumValue={minMonth}
                     maximumValue={maxMonth}
                     step={3}
                    
                     />
                     <View style={{
                        flexDirection: 'row',
						backgroundColor: 'white',
                        justifyContent: 'space-between'

                     }}>
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
                                marginBottom: 10

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
							10,000
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
                                marginBottom: 10
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
							200,000
						</Text>
					</View>
				</View>
				<Pressable
					style={{
						backgroundColor: '#074A74',
						alignItems: 'center',
						paddingVertical: 15,
						borderRadius: 5,
                        marginVertical: 10
					}}
				>
					<Text>Get Started</Text>
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
        color: "#074A74"
    }
});
