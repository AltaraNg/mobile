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
  Dashboard: { user: object };
  Intro: undefined;
  RequestModal: undefined;
  Modal: undefined;
  NotFound: undefined;
  OrderDetails: { order: object };
  ViewNotification: { notification: any };
  Main: undefined;
  OTP: { phone_number: string };
  Login: undefined;
  LoginPassword: undefined;
  Cards: { order: string };
  OrderRequest: { order: string };
  Calculator: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Dashboard: { user: object };
  History: { order: undefined };
  Notification: undefined;
  Home: { user: object };
  ViewProfile: { user: object };
  EditProfile: { user: object };
  CreateProfile: { user: object };
  UploadDocument: { user: object };
  OrderRequest: { order: string };
  OrderDetails: { order: object };
};

export type DrawerParamList = {
  Home: { user: object };
  ViewProfile: { user: object };
  EditProfile: { user: object };
  CreateProfile: { user: object };
  UploadDocument: { user: object };
  OrderRequest: { order: string };
  History: { order: undefined };
  OrderDetails: { order: object };
};
export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>;
