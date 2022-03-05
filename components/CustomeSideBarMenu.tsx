import React from 'react';
import {
	SafeAreaView,
	View,
	StyleSheet,
	Image,
	Text,
	Linking,
} from 'react-native';

import {
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from '@react-navigation/drawer';
import SVGImage from '../assets/svgs/splash.svg';
import { Feather } from '@expo/vector-icons';

const CustomSidebarMenu = (props: any) => {
	const BASE_PATH =
		'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
	const proileImage = 'react_logo.png';

	return (
		<SafeAreaView style={{ flex: 1, marginTop: 30, paddingLeft:5, paddingTop: 30 }}>
			{/*Top Large Image */}
			<SVGImage width={150} height={75} style={{marginLeft:50}} />
			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
				<DrawerItem
					label="Log Out"
					icon={() => <Feather name="log-out" size={24} color="white" />}
					onPress={() => Linking.openURL('https://aboutreact.com/')}
                    style={{ paddingVertical: 10}}
				/>
			</DrawerContentScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	sideMenuProfileIcon: {
		resizeMode: 'center',
		width: 100,
		height: 100,
		borderRadius: 100 / 2,
		alignSelf: 'center',
		color:'white'
	},
	iconStyle: {
		width: 15,
		height: 15,
		marginHorizontal: 5,
	},
	customItem: {
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default CustomSidebarMenu;
