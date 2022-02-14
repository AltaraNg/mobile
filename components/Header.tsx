import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import SVGImage from '../assets/svgs/splash.svg';


export default function Header() {
	return (
		<View style={styles.container}>
			<SVGImage width={150} height={75} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 80,
        paddingLeft: 30
		
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
