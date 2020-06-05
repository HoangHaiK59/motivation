import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { MAX_HEADER_HEIGHT, HEADER_DELTA } from '../../../model/constants';

const {interpolate, Extrapolate} = Animated;

export default function Cover({ animatedValue, style:{cover} }) {
    const scale = interpolate(animatedValue, {
        inputRange: [ -MAX_HEADER_HEIGHT, 0],
        outputRange: [4, 1],
        extrapolate: Extrapolate.CLAMP
    });

    const opacity = interpolate(animatedValue, {
        inputRange: [-64 , 0, HEADER_DELTA],
        outputRange: [0, 0.2, 1],
        extrapolate: Extrapolate.CLAMP
    });

    return (
        <Animated.View style={[styles.container, {transform: [{scale}]}]}>
            <Image source={cover} style={styles.image} />
            <Animated.View style={{ backgroundColor: 'black', ...StyleSheet.absoluteFillObject, opacity }} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: MAX_HEADER_HEIGHT + 48 * 2
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined
    }
})