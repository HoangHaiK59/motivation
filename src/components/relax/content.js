import * as React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { onScrollEvent } from 'react-native-redash';

import Header from '../common/header';
import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from '../../model/constants';
import Item from './item';

const { interpolate, Extrapolate } = Animated;

export default function Content({ animatedValue, style: { header, items }, navigation, showAction }) {
    const height = interpolate(animatedValue, {
        inputRange: [- MAX_HEADER_HEIGHT, - 48 / 2],
        outputRange: [0, MAX_HEADER_HEIGHT + 48],
        extrapolate: Extrapolate.CLAMP
    });

    const opacity = interpolate(animatedValue, {
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
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ marginTop: 20, flexGrow: 1 }}>
                    <View style={styles.type}>
                        <LinearGradient
                            start={[0, .3]}
                            end={[0, 1]}
                            colors={['#ad4339', 'rgba(181, 93, 69,.2)', '#3c6bbd']}
                            style={styles.gradientItem}
                        >
                            <TouchableOpacity style={styles.typeItem} onPress={() => navigation.navigate('Focus')}>
                                <Text style={[styles.text, { fontSize: 27, fontWeight: '500' }, styles.textIn]}>Focus</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            start={[0, .3]}
                            end={[0, 1]}
                            colors={['#ad4339', 'rgba(181, 93, 69,.2)', '#3c6bbd']}
                            style={styles.gradientItem}
                        >
                            <TouchableOpacity style={styles.typeItem} onPress={() => navigation.navigate('Sleep')}>
                                <Text style={[styles.text, { fontSize: 27, fontWeight: '500' }, styles.textIn]}>Sleep</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            start={[0, .3]}
                            end={[0, 1]}
                            colors={['#ad4339', 'rgba(181, 93, 69,.2)', '#3c6bbd']}
                            style={styles.gradientItem}
                        >
                            <TouchableOpacity style={styles.typeItem}>
                                <Text style={[styles.text, { fontSize: 27, fontWeight: '500' }, styles.textIn]}>Other</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.list}>
                <Text style={{ fontSize: 28, color: '#c4c0c0', fontWeight: '400', marginLeft: 15 }}>{items.length > 0 ? 'Favourite': ''}</Text>
                <View style={styles.itemsList}>
                    {
                        items.length > 0 ? items.map((item, id) => <Item
                            showAction={showAction}
                            key={id} 
                            index={id}
                            item={item}
                            navigation={navigation} />) :
                            null
                    }
                </View>
            </View>
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: MIN_HEADER_HEIGHT - 48 / 2
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
    },
    itemsList: {
        backgroundColor: 'black',
        flex: 1,
        paddingVertical: 32
    },
    type: {
        flex: 1,
        flexDirection: 'row'
    },
    gradientItem: {
        width: 200,
        height: 200,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10
    },
    typeItem: {
        width: 200,
        height: 200,
        borderWidth: 1,
        borderRadius: 10
    },
    textIn: {
        position: 'absolute',
        left: '35%',
        top: '40%'
    },
    typeVertical: {
        flex: 1,
        flexDirection: 'column'
    },
    typeItemVertical: {
        width: 200,
        height: 200,
        marginVertical: 10
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
})