import * as React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { onScrollEvent } from 'react-native-redash/lib/module/v1';
import { AreaChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Header from './header';
import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from '../../model/constants';

const { interpolateNode, Extrapolate } = Animated;
const { width } = Dimensions.get('window');

const Item = ({ progress, title }) => (
    <View style={styles.row}>
        <View style={styles.cell}>
            <Text style={styles.text}>{progress}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.text}>{title}</Text>
        </View>
    </View>
)

export default function Content({ y, item: { header, data, chart } }) {
    const height = interpolateNode(y, {
        inputRange: [- MAX_HEADER_HEIGHT, - 48 / 2],
        outputRange: [0, MAX_HEADER_HEIGHT + 48],
        extrapolate: Extrapolate.CLAMP
    });

    const opacity = interpolateNode(y, {
        inputRange: [- MAX_HEADER_HEIGHT / 2, 0, MAX_HEADER_HEIGHT / 2],
        outputRange: [0, 1, 0],
        extrapolate: Extrapolate.CLAMP
    });

    return (
        <Animated.ScrollView
            style={styles.container}
            onScroll={onScrollEvent({ y })}
            bounces={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
        //stickyHeaderIndices={[1]}
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
                <Header y={y} header={header} />
            </View>
            <View style={[styles.content]}>
                <YAxis
                    data={chart[0].data}
                    formatLabel={(value) => value}
                    numberOfTicks={10}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ fontSize: 10, fill: 'white' }}
                />
                <View style={{ flexDirection: 'column', width: width - 30 }}>
                    <LineChart

                        style={{ flex: 1, marginRight: 15, backgroundColor: '#3d403d' }}
                        data={chart}
                        contentInset={{ top: 30, bottom: 30 }}
                        curve={shape.curveNatural}
                        svg={{ fill: 'rgb(53, 55, 94)' }}
                    >
                        <Grid />
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10 }}
                        data={chart[0].data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left: 20, right: 20 }}
                        svg={{ fontSize: 10, fill: 'white' }}
                    />
                </View>
            </View>
            <View style={styles.list}>
                {
                    data.map((item, id) => <Item key={id} progress={item.progress} title={item.title} />)
                }
            </View>
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        paddingTop: MIN_HEADER_HEIGHT - 24, //48/2,

    },
    cover: {
        height: MAX_HEADER_HEIGHT - 48
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
        //flex: 1,
        paddingBottom: 24,
        marginBottom: 10
    },
    item: {
        //backgroundColor: '#f9c2ff',
        backgroundColor: '#2d4269',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    row: {
        flexDirection: "row",
        backgroundColor: "transparent",
    },
    cell: {
        padding: 16,
        justifyContent: "center",
    },
    most: {
        width: width,
        height: 120,
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: 10
    },
    left: {
        width: 120,
        height: 120
    },
    center: {
        width: 15,
    },
    right: {
        height: 120
    },
    avt: {
        position: 'absolute',
        top: -10,
        width: 120,
        height: 120,
        left: 10,
        backgroundColor: 'yellow'
    },
    content: {
        height: 200,
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: 10
    },
})