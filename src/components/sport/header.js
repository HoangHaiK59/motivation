import * as React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import Animated from 'react-native-reanimated';
import { MIN_HEADER_HEIGHT, HEADER_DELTA } from '../../model/constants';

const { interpolate, Extrapolate } = Animated;

export default function Header({ y, header }) {
    const opacity = interpolate(y, {
        inputRange: [HEADER_DELTA - 16, HEADER_DELTA],
        outputRange: [0,1],
        extrapolate: Extrapolate.CLAMP
    });

    const textOpacity = interpolate(y, {
        inputRange: [HEADER_DELTA - 8, HEADER_DELTA - 4],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP
    });

    return (
        <Animated.View style={[styles.container, {opacity}]}>
            <Animated.Text style={[styles.title,  {opacity: textOpacity}]}>{header}</Animated.Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 24 - MIN_HEADER_HEIGHT,
        left: 0,
        right: 0,
        height: MIN_HEADER_HEIGHT,
        backgroundColor: 'black',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: 16, 
        fontWeight: '400',
        textAlign: 'center'
    }
})