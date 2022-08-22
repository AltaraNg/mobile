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
import { BackButton } from '../assets/svgs/svg';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewNotification'>;

export default function ViewNotification({ navigation, route }: Props) {
	const notification = route.params;
	const goBack = () => {
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View
					style={{
						backgroundColor: '#074A74',
						alignSelf: 'center',
						// marginLeft:
					}}
				>
					<Pressable onPress={goBack}>
						<BackButton />
					</Pressable>
				</View>
				<Text style={styles.headerText}>Message Details</Text>
			</View>

			<View style={styles.messageDetail}>
				<View style={styles.title}>
					<Text style={{color: "#7B7A7A", fontFamily: "Montserrat_400Regular", fontSize: 13,}}>From: <Text style={{color: "#000", fontWeight: "600", fontFamily: "Montserrat_600SemiBold", fontSize: 13,}}>{JSON.parse(notification.data).sender.name}</Text></Text>
					<Text style={{color: "#7B7A7A", fontFamily: "Montserrat_400Regular", fontSize: 13,}}>{notification.created_at}</Text>
				</View>
				<View style={styles.detail}>
					<Text style={{color: "#074A74",
					fontFamily: "Montserrat_700Bold",
					fontSize: 18,
					lineHeight: 22
					
				
				}}>{JSON.parse(notification.data).subject}</Text>
					<Text style={{color: "#18191F",
					fontFamily: "Montserrat_700Bold",
					fontSize: 13,
					lineHeight: 16,
					marginTop: 20			
				}}>
					{JSON.parse(notification.data).message}
				</Text>
				</View>
			</View>
			
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#CDDBE3',
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
	title: {
		flexDirection: "row",
		backgroundColor: "white",
		borderBottomColor: "#888C96",
		borderBottomWidth: 2,
		borderRadius: 6,
		
		justifyContent: "space-between",
		paddingHorizontal: 10,
		paddingVertical: 20
	},
	
	header: {
		backgroundColor: '#074A74',
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
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
	

	statusText: {
		textAlign: 'right',
		paddingVertical: 10,
		marginHorizontal: 10,
	},
	messageDetail: {
		backgroundColor: "white",
		flex: 1,
		margin: 10,
		borderRadius: 6,
	},
	detail: {
		backgroundColor: "white",
		paddingHorizontal: 10,
		paddingVertical: 20

	}
	
	
	
});
