/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	Intro: undefined;
	RequestModal: undefined;
	Modal: undefined;
	NotFound: undefined;
	Main: undefined;
	OTP: { phone_number: string };
	Login: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
	Dashboard: {user:object};
	History: undefined;
	Notification: undefined;
};

export type DrawerParamList = {
  Home: {user:object};
	
	"View Profile": { user: object };
	"Edit Profile": { user: object };
	"Create Profile" :{user: object};
	"Upload Document" : {user: object}


}
export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>;
