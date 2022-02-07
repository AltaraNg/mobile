// Intro.tsx
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { SvgXml } from 'react-native-svg';
import { illustration } from '../assets/svgs/illustration.js';
import { hands } from '../assets/svgs/hands.js';
import { image3 } from '../assets/svgs/image3.js';
import SVGImage from '../assets/svgs/splash.svg';

import {
	View,
	SafeAreaView,
	Text,
	Image,
	StyleSheet,
	StatusBar,
	Pressable,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { RootStackParamList } from '../types';
import Header from '../components/Header';
const data = [
	{
		title: 'Altara Product',
		text: 'You can apply for a product with Altara App at your convenience',
		img: hands,
	},
	{
		title: 'Altara Rent',
		text: 'You can apply for hassle-free renting on pay later plan',
		img: illustration,
	},
	{
		title: 'Altara E-Loan',
		text: 'You can apply for quick-to-process loans on multiple payment plans.',
		img: image3,
	},
];
type Item = typeof data[0];
type RenderPaginationProps = {
	data: any[];
	activeIndex: number;
	slider: AppIntroSlider | null;
	onIntroCompleted: () => void;
};
type IntroNavigationProps = StackNavigationProp<RootStackParamList, 'Intro'>;
interface IntroProps {
	navigation: IntroNavigationProps;
}
const styles = StyleSheet.create({
	slide: {
        
		flex: 1,
		alignItems: 'center',
        paddingTop: 70,
		// justifyContent: 'center',
		backgroundColor: 'blue',
	},
	image: {
		width: 320,
		height: 320,
		marginVertical: 32,
	},
	text: {
		color: '#5E5C5C',
		textAlign: 'center',
		marginHorizontal: 72,
        marginVertical: 5,

	},
	title: {
        marginVertical: 5,
        fontFamily: 'Montserrat_700Bold',
		fontSize: 22,
		fontWeight: 'bold',
		color: '#074A74',
		textAlign: 'center',
	},
	paginationContainer: {
		position: 'absolute',
		bottom: 48,
		left: 16,
		right: 16,
	},
	paginationDots: {
		height: 16,
		margin: 16,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
        paddingBottom: 100
	},
	dot: {
		width: 20,
		height: 10,
		borderRadius: 5,
        borderColor: '#074A74',
        borderWidth: 1,

		marginHorizontal: 4,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginHorizontal: 36,
        borderColor: '#074A74',
        borderWidth: 1,
        borderRadius: 10,
	},
	button: {
		flex: 1,
		paddingVertical: 20,
		marginHorizontal: 8,
		borderRadius: 24,
		backgroundColor: '#1cb278',
	},
	buttonText: {
		color: '#074A74',
		fontWeight: 'bold',
		textAlign: 'center',
        fontSize: 18,
	},
});
const renderItem = ({ item }: { item: Item }) => (
	<View
		style={[
			styles.slide,
			{
				backgroundColor: 'white',
			},
		]}
	>
		<SvgXml xml={item.img} width={200} height={250}/>
		<Text style={styles.title}>{item.title}</Text>
		<Text style={styles.text}>{item.text}</Text>
	</View>
);
const RenderPagination = ({
	activeIndex,
	slider,
	data,
	onIntroCompleted,
}: RenderPaginationProps) => {
	const handleIntroCompleted = () => {
		onIntroCompleted();
	};
	return (
		<View style={styles.paginationContainer}>
			<SafeAreaView>
				<View style={styles.paginationDots}>
					{data.length > 1 &&
						data.map((_, i) => (
							<Pressable
								key={i}
								style={[
									styles.dot,
									i === activeIndex
										? { backgroundColor: 'white' }
										: { backgroundColor: '#074A74' },
								]}
								onPress={() => slider?.goToSlide(i, true)}
							/>
						))}
				</View>
			
					<View style={styles.buttonContainer}>
						<Pressable
							onPress={handleIntroCompleted}
							style={[styles.button, { backgroundColor: 'white' }]}
						>
							<Text style={styles.buttonText}>Log in</Text>
						</Pressable>
					</View>
				
			</SafeAreaView>
		</View>
	);
};
export const Intro = ({ navigation }: IntroProps) => {
	const sliderEl = useRef(null);
	const keyExtractor = (item: Item) => item.title;
	const onIntroCompleted = () => {
		navigation.navigate('Root');
	};
	return (
		<View style={{ flex: 1 }}>
			<StatusBar translucent backgroundColor="transparent" />
			<Header></Header>

			<AppIntroSlider
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				renderPagination={(activeIndex) => (
					<RenderPagination
						data={data}
						activeIndex={activeIndex}
						slider={sliderEl.current}
						onIntroCompleted={onIntroCompleted}
					/>
				)}
				data={data}
				ref={sliderEl}
			/>
		</View>
	);
};
