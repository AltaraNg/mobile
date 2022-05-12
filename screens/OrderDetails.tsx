import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	Dimensions,
	Image,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef } from 'react';
import { post } from '../utilities/api';

import { Text, View } from '../components/Themed';
import { RootStackParamList } from '../types';
import Leaf from '../assets/svgs/leaf.svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Cards from '../components/Cards';
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function OrderDetails({ navigation, route }: Props) {
	const order: object = route.params;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Order Details</Text>
			</View>
			<View style={styles.orderSummary}>
				<View style={styles.orderDetail}>
					<Text>Order ID: {order.attributes.order_number}</Text>
					<Text>{order.included.product.name}</Text>
				</View>
				<View style={styles.orderStatus}>
					<Text style={styles.statusText}>Overdue</Text>
				</View>
			</View>
			<View style={styles.cardContainer}>
			<View
				style={{
					backgroundColor: 'rgba(156, 150, 150, 0.55)',
					
					position: 'absolute',
					zIndex: 10,
				}}
			></View>
			<Leaf style={styles.leaf} />
			<Text style={styles.cardHeader}>This is</Text>
			<Text style={styles.amount}></Text>
			
		</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EFF5F9',
		paddingTop: 23,
	},
	header: {
		backgroundColor: '#074A74',
		padding: 20,
	},
	headerText: {
		textAlign: 'center',
		color: 'white',
		textTransform: 'uppercase',
		fontFamily: 'Montserrat_700Bold',
	},
	orderSummary: {
		flexDirection: 'row',
		backgroundColor: '#EFF5F9',

	},
	orderDetail: {
		flex: 1,
	},
	orderStatus: {
		flex: 1,
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
    cardHeader: {
        fontSize: 24,
		fontWeight: 'bold',
		fontFamily: 'Montserrat_700Bold',
		color: 'white',
    },
	statusText: {},
    cardContainer:{
        height: 150,
		width: 350,
		backgroundColor: '#074A74',
		borderRadius: 5,
		marginBottom: 17,
		padding: 10,
        alignSelf: "center",
		paddingLeft: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
    }
});
