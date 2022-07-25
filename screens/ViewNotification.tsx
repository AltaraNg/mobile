import {
	Pressable,
	StyleSheet,
	Dimensions,
	Modal,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AntDesign } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewNotification'>;

export default function ViewNotification({ navigation, route }: Props) {
	const notification = route.params;
	const goBack = () => {
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<View
				style={{
					backgroundColor: '#ccc',
					alignSelf: 'flex-start',
					marginTop: 20,
					flexDirection: "row",
					marginLeft:10,
					padding: 10,
					borderRadius: 5

					
					

					// marginLeft:
				}}
			>
				<Pressable onPress={goBack} style={{flexDirection: "row"}}>
				
				<Text style={{color: "#074A74", fontFamily: 'Montserrat_400Regular', fontWeight: 'bold'}}>Go Back</Text>
				</Pressable>
			</View>
			<View
				style={{
					backgroundColor: 'white',

					// marginLeft:
				}}
			>
				<Text
					style={{
                    marginHorizontal: 10,

                        color:  '#074A74',
                        fontSize: 16,
						marginTop: 20,
						textAlign: 'left',
						paddingVertical: 10,
						fontFamily: 'Montserrat_400Regular',
					}}
				>
					Subject: {JSON.parse(notification.data).subject}
				</Text>
				<Text style={{
						fontFamily: 'Montserrat_400Regular',

                    marginHorizontal: 10,
                    marginVertical: 10,
                    paddingVertical: 10,
                    fontSize: 12,
                    color:  '#074A74',
                    borderColor: "#074A74",
                    borderBottomWidth: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>From: <Text style={{fontWeight: 'bold', color:  '#074A74',}}>{JSON.parse(notification.data).sender.name}</Text>
                </Text>
				<Text style={{
                     color:  '#074A74',
                    marginVertical: 10,
                    marginHorizontal: 10,
                }}>{JSON.parse(notification.data).message}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 23,
	},
	totalText: {
		fontWeight: 'bold',
		fontSize: 24,
		color: '#9C9696',
	},
	modalText: {
		color: '#353232',
		fontFamily: 'Montserrat_500Medium',
		marginTop: 30,
		marginHorizontal: 30,
		fontSize: 22,
		textAlign: 'center',
		lineHeight: 35,
	},
	total: {
		position: 'absolute',
		bottom: 0,
		marginHorizontal: -15,
		zIndex: 1000,
		height: 75,
		backgroundColor: '#F9FBFC',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
	},
	header: {
		backgroundColor: '#074A74',
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	toggle: {
		flexDirection: 'row',
		width: 326,
		height: 50,
		borderRadius: 19,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
		backgroundColor: '#EEEFF0',
		alignItems: 'center',
		paddingHorizontal: 1,
		justifyContent: 'space-evenly',
	},
	headerText: {
		color: 'white',
		textTransform: 'uppercase',
		fontFamily: 'Montserrat_700Bold',
		marginLeft: 90,
	},
	orderSummary: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		backgroundColor: '#fff',
		marginTop: 10,
	},
	buttonContainer: {
		flexDirection: 'row',
		borderColor: 'transparent',
		borderWidth: 1,
		borderRadius: 15,
		width: 162,
		height: 40,
	},

	toggleoff: {
		flexDirection: 'row',
		backgroundColor: '#EEEFF0',
		width: 162,
		height: 40,
	},
	button: {
		flex: 1,
		marginHorizontal: 8,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#ffffff',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 14,
	},
	orderDetail: {
		flex: 1,
		backgroundColor: '#fff',
	},
	orderStatus: {
		flex: 1,
		backgroundColor: '#fff',
	},
	leaf: {
		position: 'absolute',
		right: 0,
	},

	statusText: {
		textAlign: 'right',
		paddingVertical: 10,
		marginHorizontal: 10,
	},
	cardContainer: {
		height: 200,
		width: 350,
		backgroundColor: '#074A74',
		borderRadius: 5,
		marginBottom: 10,
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		paddingLeft: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
	amortizationContainer: {
		backgroundColor: '#fff',
		marginHorizontal: 15,
		flex: 1,
	},
	amorHeader: {
		fontFamily: 'Montserrat_700Bold',
		color: '#074A74',
		fontSize: 19,
		marginVertical: 10,
	},
	statusBar: {
		height: 15,
		width: '100%',
		backgroundColor: '#EFF5F9',
		opacity: 0.7,
		borderWidth: 2,
		borderRadius: 10,
		marginVertical: 15,
	},
	repaymentStatus: {
		backgroundColor: '#074A74',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	modalContainer: {
		height: Dimensions.get('screen').height / 2.1,
		alignItems: 'center',
		marginTop: 'auto',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: 'white',
	},
	modalContent: {
		paddingVertical: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		alignItems: 'center',
		backgroundColor: 'white',
	},
	modalHeading: {
		fontFamily: 'Montserrat_700Bold',
		fontSize: 30,
		textAlign: 'center',
		color: 'black',
		marginTop: 20,
	},
	modalHeaderCloseText: {
		backgroundColor: 'white',
		textAlign: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		width: 30,
		fontSize: 15,
		borderRadius: 50,
	},
});
