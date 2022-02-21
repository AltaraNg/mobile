import { Button, Image, StyleSheet, TouchableHighlight } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import SVGImage from '../assets/svgs/splash.svg';

export default function WelcomeScreen({
	navigation,
}: RootTabScreenProps<'TabOne'>) {
	return (
		<View style={styles.container}>
			<SVGImage width={135} height={48} />
			<View style={styles.hand}>
				<Text
					style={styles.title}
					darkColor="rgba(255,255,255,0.05)"
					lightColor="rgba(0,0,0,0.05)"
				>
					Altara Product
				</Text>
			</View>
			<View style={styles.hand}>
				<Text style={styles.simple}>
					You can apply for a product with Altara App at your convienence
				</Text>
			</View>

			<TouchableHighlight >
				<View style={styles.buttonContainer}>
					<Text style={styles.buttonText}>Login</Text>
				</View>
			</TouchableHighlight>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#CDDBE3',
		flex: 1,
		paddingLeft: 10,
	},
	title: {
		marginTop: 0,
		fontSize: 25,

		color: '#074A74',
		fontFamily: 'Montserrat_800ExtraBold',
	},

	image: {
		width: '50%',
	},
	hand: {
		flex: 1,
		alignContent: 'center',
		alignItems: 'center',
		marginLeft: 50,
		marginRight: 50,
	},
	simple: {
		fontFamily: 'Montserrat_500Medium',
		color: '#5E5C5C',
	},

	buttonContainer: {
		marginLeft: 50,
		marginRight: 50,
		marginBottom: 20,
		borderWidth: 2,
		borderColor: '#074A74',
		borderRadius: 5,
    
	},
	buttonText: {
		color: '#074A74',
		textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10	
	},
});
