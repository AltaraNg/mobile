import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function RequestModal() {
	return (
		<View
			style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}
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
				<Text>Testing a modal with transparent background</Text>
			</View>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
		</View>
	);
}

const styles = StyleSheet.create({});
