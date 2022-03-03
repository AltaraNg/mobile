import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import Header from '../components/Header';
import { ProfileSvg, EditProfileSvg, LogOut } from '../assets/svgs/svg';
import { useContext } from 'react';
import { Context as AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
type Props = NativeStackScreenProps<RootStackParamList, 'SideMenu'>;

export default function SideMenu({ navigation }: Props) {
	const { state, signout } = useContext(AuthContext);

	const logout = () => {
		let res = signout();
	};
	const viewProfile = () => {
		navigation.navigate('ViewProfile', { user: state.user });
	};
	return (
		<View style={styles.container}>
			<Header backgroundColor="white" />
			<View style={styles.div}>
				<Pressable onPress={viewProfile}>
					<View style={styles.menuItem}>
						<ProfileSvg />
						<Text style={styles.text}>View Profile</Text>
					</View>
				</Pressable>
				<View style={styles.menuItem}>
					<EditProfileSvg />
					<Text style={styles.text}>Edit Profile</Text>
				</View>
				<Pressable onPress={logout}>
					<View style={styles.menuItem}>
						<LogOut />
						<Text style={styles.text}>Log Out</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		zIndex: 10,
		width: 200,
		height: '93%',
		backgroundColor: 'white',
	},
	menuItem: {
		backgroundColor: 'white',
		flexDirection: 'row',
		marginLeft: 30,
		alignItems: 'center',
		paddingBottom: 70,
	},
	text: {
		color: '#9C9696',
		fontFamily: 'Montserrat_500Medium',
		marginLeft: 7,
	},
	div: {
		backgroundColor: 'white',
		paddingTop: 80,
	},
});
