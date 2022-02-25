import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import SVGImage from '../assets/svgs/splash.svg';


export default function Header(props:any) {
	return (
		<View style={{backgroundColor:props.backgroundColor, paddingTop:60, paddingLeft:24}}  >
			<SVGImage  width={150} height={75} />
		</View>
	);
}

const styles = StyleSheet.create({
	
});
