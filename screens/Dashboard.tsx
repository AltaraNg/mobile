import {
	Pressable,
	StyleSheet,
	TextInput,
	ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import React, { useState, createRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

export default function Dashboard({ navigation, route }) {
    const user = route.params?.phone_number?.user?.attributes;
	console.log(route.params.phone_number.user);


	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Header></Header>
				<MaterialCommunityIcons name="hamburger" size={50} color="#074A74" />
			</View>

			<View style={styles.main}>
                <Text>
                    {user.first_name}
                </Text>
                <Text>
                Welcome to your altara dashboard
                </Text>
            </View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flex: 1,
	},
    main: {
        flex: 3
    }

});
