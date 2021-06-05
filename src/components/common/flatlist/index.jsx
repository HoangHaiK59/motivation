import React, { useState, useEffect } from 'react';
import { View, FlatList, Animated, Dimensions, Image, StyleSheet } from 'react-native';
import { useValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = 100;
const CARD_WIDTH = width * 0.9;

const WithBoth = ({ y, index, item, clickItem }) => {
    const position = Animated.subtract(index * CARD_HEIGHT, y);
    const isDisappearing = -CARD_HEIGHT;
    const isTop = 0;
    const isBottom = height - CARD_HEIGHT;
    const isAppearing = height;
    const scale = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [.5, 1, 1, .5],
        extrapolate: 'clamp'
    })
    const opacity = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [.5, 1, 1, .5],
        extrapolate: 'clamp'
    })

    return <Animated.View style={[opacity, { transform: [{scale}] }]}>

    </Animated.View>
}

const WithImage = ({ y, index, item, clickItem }) => {
    const position = Animated.subtract(index * CARD_HEIGHT, y);
    const isDisappearing = -CARD_HEIGHT;
    const isTop = 0;
    const isBottom = height - CARD_HEIGHT;
    const isAppearing = height;
    const scale = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [.5, 1, 1, .5],
        extrapolate: 'clamp'
    })
    const opacity = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [.5, 1, 1, .5],
        extrapolate: 'clamp'
    })

    return <Animated.View style={[opacity, { transform: [{scale}] }]}>

    </Animated.View>
}

const WithText = ({ y, index, item, clickItem }) => {
    const position = Animated.subtract(index * CARD_HEIGHT, y);
    const isDisappearing = -CARD_HEIGHT;
    const isTop = 0;
    const isBottom = height - CARD_HEIGHT;
    const isAppearing = height;
    const scale = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [.5, 1, 1, .5],
        extrapolate: 'clamp'
    })
    const opacity = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [.5, 1, 1, .5],
        extrapolate: 'clamp'
    })

    return <Animated.View style={[opacity, { transform: [{scale}] }]}>

    </Animated.View>
}


const AnimatedFlatListComponent = Animated.createAnimatedComponent(FlatList);

export const AnimatedFlatList = ({ items, clickItem, both = true, onlyImage = false, onlyText= false }) => {
    const y = useValue(0);
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
        useNativeDriver: true
    })
    return <AnimatedFlatListComponent
    data={items}
    keyExtractor={(item) => item.id || item.key}
    onScroll={onScroll}
    renderItem={({item, index}) => }
    >

    </AnimatedFlatListComponent>
}


const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1c1b1b',
        height: HEIGHT
    },
    left: {
        flex: .5
    },
    right: {
        flex: 1
    },
    image: {
        resizeMode: 'cover',
        width: 100,
        height: 100
    }
})

