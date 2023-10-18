import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SuccessSvg } from '../assets/svgs/svg';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
type Props = NativeStackScreenProps<RootStackParamList, 'RequestModal'>;


export default function RequestModal({ navigation, route }: Props) {
	const [modalVisible, setModalVisible] = useState(false);
	const item: object = route.params;

	const styleSVG = (item: any) => {
		if (item?.status == "approved" || item?.status == "accepted") {
		  return "#074A74";
		}
		if (item?.status == 'pending' || item?.status == 'processing') {
		  return "#FDC228";
		}
		if (item?.status == "denied" || item?.status == "declined") {
		  return "#FF4133";
		}
	  };
	  const modalResponse = (item: any) => {
		if (item?.status == "approved" || item?.status == "accepted") {
		  return "was successful";
		}
		if (item?.status == "pending" || item?.status == "processing") {
		  return "is in progress";
		}
		if (item?.status == "declined" || item?.status == "denied") {
		  return "was unsuccessful";
		}
	  };

	return (
		<View
			style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: 'white' }}
		>
			<View
				style={{
					margin: 20,
					backgroundColor: 'white',
					borderRadius: 20,
					padding: 35,
					alignItems: 'center',
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 4,
					elevation: 5,
				}}
			>
				<TouchableHighlight
					onPress={() => setModalVisible(!modalVisible)}
					style={{
						borderRadius:
							Math.round(
								Dimensions.get("window").width +
								Dimensions.get("window").height
							) / 2,
						width: Dimensions.get("window").width * 0.13,
						height: Dimensions.get("window").width * 0.13,
						backgroundColor: "#fff",
						position: "absolute",
						//   top: 1 / 2,
						marginHorizontal: Dimensions.get("window").width * 0.43,
						marginVertical: Dimensions.get("window").width * 0.76,
						justifyContent: "center",
						alignItems: "center",
					}}
					underlayColor="#ccc"
				>
					<Text
						style={{
							fontSize: 20,
							color: "#000",
							fontFamily: "Montserrat_900Black",
						}}
					>
						&#x2715;
					</Text>
				</TouchableHighlight>

				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{styleSVG(item) == "#FF4133" && (
							<TouchableHighlight
								style={{
									borderRadius:
										Math.round(
											Dimensions.get("window").width +
											Dimensions.get("window").height
										) / 2,
									width: Dimensions.get("window").width * 0.3,
									height: Dimensions.get("window").width * 0.3,
									backgroundColor: "#FF4133",
									justifyContent: "center",
									alignItems: "center",
								}}
								underlayColor="#ccc"
							>
								<Text
									style={{
										fontSize: 68,
										color: "#fff",
										fontFamily: "Montserrat_900Black",
									}}
								>
									&#x2715;
								</Text>
							</TouchableHighlight>
						)}

						{styleSVG(item) == "#FDC228" && (
							<Image
								source={require("../assets/images/ProgressSVG.png")}
							/>
						)}
						{styleSVG(item) == "#074A74" && <SuccessSvg />}
						<Text style={styles.modalHeading}>
							Your Order Request{" "}
							<Text style={{ color: styleSVG(item) }}>
								{modalResponse(item)}
							</Text>
						</Text>

						<Text style={styles.errText}>{item?.reason || "An agent will reach out to you shortly"}</Text>
					</View>
				</View>
			</View>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'light'} />
		</View>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		height: Dimensions.get("screen").height / 1.8,
		paddingHorizontal: 10,
		alignItems: 'center',
		marginTop: "auto",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: "white",
	  },
	  modalContent: {
		paddingVertical: 20,
		backgroundColor: "white",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		flexDirection: "column",
		alignItems: "center",
	  },
	  modalHeading: {
		fontFamily: "Montserrat_700Bold",
		fontSize: 30,
		textAlign: "center",
		color: "black",
		marginTop: 20,
	  },
	  modalHeaderCloseText: {
		backgroundColor: "white",
		textAlign: "center",
		paddingLeft: 5,
		paddingRight: 5,
		width: 30,
		fontSize: 15,
		borderRadius: 50,
	  },
	  verticleLine: {
		height: "100%",
		width: 1,
		backgroundColor: "#909090",
	  },
	  errText: {
		fontSize: 15,
		marginTop: 20,
		paddingHorizontal: 15,
		textAlign: "center",
		color: "#000",
	  },
	});

