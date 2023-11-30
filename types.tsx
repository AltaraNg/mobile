/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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
    OrderConfirmation: { order: object };
    OrderSuccess: { order: object };
    VerificationPassed: { order: object };
    VerificationPending: { order: object };
    ViewNotification: { notification: object };
    UploadDocument: { down_payment: number; loan_amount: number; repayment: number; repayment_cycle_id };
    Main: undefined;
    OTP: { phone_number: string };
    Login: undefined;
    PaymentCompleted: undefined;
    LoginPassword: undefined;
    Cards: { order: string };
    OrderRequest: { order: string };
    Calculator: { order: object };
    Guarantors: {};

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
    VerificationPassed: { order: object };
    VerificationPending: { order: object };
    UploadDocument: { down_payment: number; loan_amount: number; repayment: number; repayment_cycle_id };
    OrderRequest: { order: string };
    OrderDetails: { order: object };
    OrderConfirmation: { order: object };
    OrderSuccess: { order: object };
    Calculator: { order: object };
    Guarantors: {};
};

export type DrawerParamList = {
    Home: { user: object };
    ViewProfile: { user: object };
    EditProfile: { user: object };
    CreateProfile: { user: object };
    UploadDocument: { order: object; user: object };
    OrderRequest: { order: string };
    History: { order: undefined };
    OrderDetails: { order: object };
    Calculator: { order: object };
    Support;
};
export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;
