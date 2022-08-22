// Intro.tsx
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { SvgXml } from 'react-native-svg';
import { illustration } from '../assets/svgs/illustration.js';
import { hands } from '../assets/svgs/hands.js';
import { image3 } from '../assets/svgs/image3.js';


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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  loginPassword: () => void;
};
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
		marginHorizontal: 52,
        marginVertical: 5,
		fontFamily: 'Montserrat_400Regular',

	},
	title: {
        marginVertical: 5,
        fontFamily: 'Montserrat_700Bold',
		fontSize: 22,
		fontWeight: 'bold',
		color: '#074A74',
		textAlign: 'center',
		paddingTop:28
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
        paddingBottom: 40
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
		marginHorizontal: 30,
        borderColor: '#074A74',
        borderWidth: 1,
        borderRadius: 10,
		
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		marginHorizontal: 8,
		borderRadius: 24,
		backgroundColor: '#1cb278',
	},
	buttonText: {
		color: '#074A74',
		fontWeight: 'normal',
		textAlign: 'center',
        fontSize: 16,
	},

});
const renderItem = ({ item }: { item: Item }) => (
	<View
		style={[
			styles.slide,
			{
				backgroundColor: '#EFF5F9',
				
			},
		]}
	>
		<SvgXml  xml={item.img} width={258} height={164}/>
		<Text style={styles.title}>{item.title}</Text>
		<Text style={styles.text}>{item.text}</Text>
	</View>
);
const RenderPagination = ({
  activeIndex,
  slider,
  data,
  onIntroCompleted,
  loginPassword,
}: RenderPaginationProps) => {
  const handleIntroCompleted = () => {
    onIntroCompleted();
  };
  const LoginPassword = () => {
    loginPassword();
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
                    ? { backgroundColor: "#EFF5F9" }
                    : { backgroundColor: "#074A74" },
                ]}
                onPress={() => slider?.goToSlide(i, true)}
              />
            ))}
        </View>

        <View style={[styles.buttonContainer, { marginBottom: 10 }]}>
          <Pressable
            onPress={handleIntroCompleted}
            style={[styles.button, { backgroundColor: "#EFF5F9" }]}
          >
            <Text style={styles.buttonText}>Log in with OTP</Text>
          </Pressable>
        </View>
        <View style={[styles.buttonContainer, { backgroundColor: "#074A74" }]}>
          <Pressable
            onPress={loginPassword}
            style={[styles.button, { backgroundColor: "#074A74" }]}
          >
            <Text style={[styles.buttonText, { color: "white" }]}>
              Log in with password
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;
export const Intro = ({ navigation }: Props) => {
	const sliderEl = useRef(null);
	const keyExtractor = (item: Item) => item.title;
	const onIntroCompleted = () => {
	
		navigation.navigate('Login');
	};
	const loginPassword = () => {
    navigation.navigate("LoginPassword");
  };
	return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <Header backgroundColor="#EFF5F9"></Header>

      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderPagination={(activeIndex) => (
          <RenderPagination
            data={data}
            activeIndex={activeIndex}
            slider={sliderEl.current}
            onIntroCompleted={onIntroCompleted}
            loginPassword={loginPassword}
          />
        )}
        data={data}
        ref={sliderEl}
      />
    </View>
  );
};
