import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { cos } from 'react-native-reanimated';
import { onScrollEvent } from 'react-native-redash';

import Header from '../header';
import List from '../list';
import Track from '../track';
import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from '../../../model/constants';

const { interpolate, Extrapolate } = Animated;

export default function Content({ animatedValue , style: {header, tracks, artist} }) {
    
    const [animatedVal] = React.useState(new Animated.Value(0));

    const height = interpolate(animatedVal, {
        inputRange: [- MAX_HEADER_HEIGHT, - 48/2],
        outputRange: [0, MAX_HEADER_HEIGHT + 48],
        extrapolate: Extrapolate.CLAMP
    });

    const opacity = interpolate(animatedVal, {
        inputRange: [- MAX_HEADER_HEIGHT / 2, 0, MAX_HEADER_HEIGHT / 2],
        outputRange: [0, 1, 0],
        extrapolate: Extrapolate.CLAMP
    });

    return (
        <Animated.ScrollView
            style={styles.container}
            onScroll={onScrollEvent({animatedVal})}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            stickyHeaderIndices={[1]}
        >
            <View style={styles.cover}>
                <Animated.View style={[styles.gradient, {height}]}>
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
                <Header animatedValue={animatedVal} header={header} />
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
        paddingTop: MIN_HEADER_HEIGHT -  48 //48/2,
    },
    cover: {
        height: MAX_HEADER_HEIGHT - 64//48
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