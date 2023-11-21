import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export default function OrderSuccess({ navigation, route }: Props) {
    const order: object = route.params;

    return (
        <View style={styles.container}>
            <Text>Order Successful</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 23,
    },
});
