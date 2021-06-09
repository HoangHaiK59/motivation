import React, { memo } from 'react';
import { View, FlatList, Animated, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../../text/regular';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = 100;
const CARD_HEIGHT_SM = 60;
const CARD_WIDTH = width * 0.9;
const SPACING = 8;

const Item = memo(({ y, index, item, onPressItem, typeRender }) => {
    const position = Animated.subtract(index * (CARD_HEIGHT), y);
    const isDisappearing = -(CARD_HEIGHT);
    const isTop = 0;
    const isBottom = height - (CARD_HEIGHT);
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

    return <Animated.View style={[opacity, { transform: [{ scale }], marginTop: index > 0 ? 8 : 0 }]}>
        <TouchableOpacity onPress={() => onPressItem(item) || {}}>
            <View style={styles.cardSm}>
                <View style={styles.left}>
                    <Text style={{ color: '#fff' }}>{item.name}</Text>
                </View>
                <View style={styles.right}>
                    <Text style={{ color: '#fff' }}>{item.content}</Text>
                </View>
            </View>
        </TouchableOpacity>
    </Animated.View>
})


const AnimatedFlatListComponent = Animated.createAnimatedComponent(FlatList);

export const AnimatedFlatList = ({ horizontal = false, data, onPressItem, ...rest }) => {
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
        useNativeDriver: false
    })
    return <AnimatedFlatListComponent
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        {...rest}
        data={data}
        keyExtractor={(item) => item.id || item.key}
        onScroll={onScroll}
        renderItem={({ item, index }) => <Item
            y={y}
            item={item}
            index={index}
            onPressItem={onPressItem}
        />}
    >

    </AnimatedFlatListComponent>
}

AnimatedFlatList.propTypes = {
    data: PropTypes.array.isRequired,
    onPressItem: PropTypes.func
}

const styles = StyleSheet.create({
    cardSm: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#141414',
        height: CARD_HEIGHT_SM,
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 6
    },
    left: {
        flex: .5
    },
    right: {
        flex: 1
    },
    textMd: {
        fontSize: 16,
        color: '#fff'
    },
})
