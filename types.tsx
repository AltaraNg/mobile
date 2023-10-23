/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

<<<<<<< HEAD
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,  
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
=======
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
>>>>>>> fa571561f48eb7d12fc4db7f5f113255a7646528

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
<<<<<<< HEAD
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
=======
    Dashboard: { user: object };
    Intro: undefined;
    RequestModal: undefined;
    Modal: undefined;
    NotFound: undefined;
    OrderDetails: { order: object };
    ViewNotification: { notification: object };
    Main: undefined;
    OTP: { phone_number: string };
    Login: undefined;
    LoginPassword: undefined;
    Cards: { order: string };
    OrderRequest: { order: string };
    Calculator: undefined;
>>>>>>> fa571561f48eb7d12fc4db7f5f113255a7646528
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Screen>;

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
export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;
