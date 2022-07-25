import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import SVGImage from '../assets/svgs/splash.svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Header(props:any) {
	function done (){
		props.navigation.navigate('Notification')
	}
	return (
		<View style={{backgroundColor:props.backgroundColor, paddingTop:60, paddingLeft:24, flexDirection: 'row', justifyContent: 'space-between', flex: 1}}  >
			<SVGImage  width={150} height={75} />
			{/* <TouchableOpacity style={{
				alignSelf: 'center',
				marginRight: 10
			}}
			onPress={done} >
			<MaterialCommunityIcons name="bell" size={24} color="#074A74"  />
			</TouchableOpacity> */}
			
		</View>
	);
}

