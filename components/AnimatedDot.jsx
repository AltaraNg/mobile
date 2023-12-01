import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const GreenDotAnimation = () => {
    const [pingAnimation] = useState(new Animated.Value(1));

    useEffect(() => {
        const ping = () => {
            Animated.sequence([
                Animated.timing(pingAnimation, {
                    toValue: 1.5,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(pingAnimation, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]).start(() => ping());
        };

        ping();
    }, [pingAnimation]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.dot,
                    {
                        transform: [{ scale: pingAnimation }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: "green",
    },
});

export default GreenDotAnimation;
