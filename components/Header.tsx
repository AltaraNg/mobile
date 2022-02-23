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
		paddingTop: 60,
        paddingLeft: 24,
		backgroundColor: '#EFF5F9',

		
	},
	
});
