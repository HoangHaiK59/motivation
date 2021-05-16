import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { cos } from 'react-native-reanimated';
import { onScrollEvent } from 'react-native-redash/lib/module/v1';

import Header from '../../common/header';
import List from '../list';
import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from '../../../model/constants';

const { interpolateNode, Extrapolate } = Animated;

export default function Content({ animatedValue, style: { header } }) {

    const height = interpolateNode(animatedValue, {
        inputRange: [- MAX_HEADER_HEIGHT, - 48 / 2],
        outputRange: [0, MAX_HEADER_HEIGHT + 48],
        extrapolate: Extrapolate.CLAMP
    });

    const opacity = interpolateNode(animatedValue, {
        inputRange: [- MAX_HEADER_HEIGHT / 2, 0, MAX_HEADER_HEIGHT / 2],
        outputRange: [0, 1, 0],
        extrapolate: Extrapolate.CLAMP
    });

    return (
        <Animated.ScrollView
            style={styles.container}
            onScroll={onScrollEvent({ y: animatedValue })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            stickyHeaderIndices={[1]}
        >
            <View style={styles.cover}>
                <Animated.View style={[styles.gradient, { height }]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,.2)', 'black']}
                        start={[0, 0.3]}
                        end={[0, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
                <View style={styles.headerContainer}>
                    <Animated.Text style={[styles.headerName, { opacity }]}>{header}</Animated.Text>
                </View>
            </View>
            <View style={styles.header}>
                <Header animatedValue={animatedValue} header={header} />
            </View>
            <View style={styles.list}>
                <List />
            </View>
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: MIN_HEADER_HEIGHT - 24 //48/2,
    },
    cover: {
        height: MAX_HEADER_HEIGHT - 48//48
    },
    gradient: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
    },
    headerContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerName: {
        textAlign: 'center',
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold'
    },
    header: {
        marginTop: -24
    },
    list: {
        paddingTop: 32,
        backgroundColor: 'black',
        flex: 1
    }
})