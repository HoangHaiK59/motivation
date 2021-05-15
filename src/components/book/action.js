import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, { interpolate, multiply, cond, lessThan, divide, sub, add, Extrapolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const WIDTH = width * 0.9;
const RATIO = 100 / 320;
const HEIGHT = WIDTH * RATIO;
const MARGIN = 8;

export const CARD_HEIGHT = HEIGHT + MARGIN * 2;


export default function Action({ x, deleteOpacity }) {
    const size = cond(lessThan(x, CARD_HEIGHT), x, add(x, sub(x, CARD_HEIGHT)));
    const translateX = cond(lessThan(x, CARD_HEIGHT), 0, divide(sub(x, CARD_HEIGHT), 2));
    const borderRadius = divide(size, 2);
    const scale = interpolate(size, {
        inputRange: [20, 30],
        outputRange: [0.001, 1],
        extrapolate: Extrapolate.CLAMP,
    });
    const iconOpacity = interpolate(size, {
        inputRange: [CARD_HEIGHT - 10, CARD_HEIGHT + 10],
        outputRange: [1, 0],
    });
    const textOpacity = sub(1, iconOpacity);
    return (
        <Animated.View
            style={{
                backgroundColor: "#D93F12",
                justifyContent: "center",
                alignItems: "center",
                height: size,
                width: size,
                borderRadius,
                transform: [{ translateX }]
            }}>
            <Animated.View
                style={{
                    height: 5,
                    width: 20,
                    backgroundColor: "white",
                    opacity: iconOpacity,
                    transform: [{ scale }]
                }}
            />
            <Animated.View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: multiply(textOpacity, deleteOpacity)
                }}
            >
                <Text style={styles.remove}>Remove</Text>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    remove: {
        color: "white",
        fontSize: 14,
    },
});
