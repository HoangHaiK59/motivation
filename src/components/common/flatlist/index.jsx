import React, { memo } from 'react';
import { View, FlatList, Animated, Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useValue } from 'react-native-reanimated';
import Text from '../../text/regular';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = 100;
const CARD_WIDTH = width * 0.9;
const SPACING = 8;

const Item = memo(({ y, index, item, onPressItem, typeRender }) => {
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

    return <Animated.View style={[opacity, { transform: [{ scale }], marginTop: index > 0 ? 8: 0 }]}>
        {
            typeRender === 'BOTH' && <TouchableOpacity onPress={() => onPressItem(item) || {}}>
                <View style={styles.card}>
                    <View style={styles.left}>
                        <Image source={{ uri: item.url || item.thumnail }} style={styles.image} />
                    </View>
                    <View style={styles.right}>
                        <Text style={{ color: '#fff' }}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        }
        {
            typeRender === 'TEXT' && <View style={styles.cardText}>
                <Text style={styles.textMd}>{item.name}</Text>
            </View>
        }
        {
            typeRender === 'IMAGE' && <View style={styles.card}>
                <Image source={{ uri: item.url || item.thumnail }} style={styles.imageFull} />
            </View>
        }
    </Animated.View>
})


const AnimatedFlatListComponent = Animated.createAnimatedComponent(FlatList);

export const AnimatedFlatList = ({ horizontal = false, data, onPressItem, typeRender, ...rest }) => {
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
            typeRender={typeRender}
        />}
    >

    </AnimatedFlatListComponent>
}

AnimatedFlatList.propTypes = {
    data: PropTypes.array.isRequired,
    onPressItem: PropTypes.func,
    typeRender: PropTypes.oneOf(['BOTH', 'IMAGE', 'TEXT']).isRequired
}

const styles = StyleSheet.create({
    cardText: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1c1b1b',
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 6
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#141414',
        height: CARD_HEIGHT,
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
    image: {
        resizeMode: 'cover',
        width: 100,
        height: CARD_HEIGHT - 12,
        borderRadius: 5,
    },
    textMd: {
        fontSize: 16,
        color: '#fff'
    },
    imageFull: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    }
})

