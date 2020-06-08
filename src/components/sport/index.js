import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { AreaChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const { interpolate, Extrapolate } = Animated;

import { MAX_HEADER_HEIGHT } from '../../model/constants';

class Sport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.animatedValue = new Animated.Value(0);
    }

    render() {
        const data_1 = [50, 10, 40, 95, 85, 91, 35];
        const data_2 = [50, 15, 55, 95, 74, 32, 55];
        const data = [
            {
                data: data_1,
                svg: { stroke: '#8800cc' },
            },
            {
                data: data_2,
                svg: { stroke: 'green' },
            }
        ]
        const height = interpolate(this.animatedValue, {
            inputRange: [- MAX_HEADER_HEIGHT, - 48 / 2],
            outputRange: [0, MAX_HEADER_HEIGHT + 48],
            extrapolate: Extrapolate.CLAMP
        });
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Image source={require('../../assets/default-image.jpg')} style={[styles.background]} />
                    <View style={styles.headerAvatar}>
                        <Image source={require('../../assets/street.jpg')} style={[styles.image, { alignSelf: 'center' }]} />
                        <Text style={[styles.text, styles.headerName]}>
                            Justin
                    </Text>
                    </View>
                    <View style={styles.headerGoal}>
                        <View style={styles.headerGoalChild}>
                            <Text style={styles.wrapTextCenter}>Goal</Text>
                        </View>
                        <View style={styles.headerGoalChild}>
                            <Text style={styles.wrapTextCenter}>Goal</Text>
                        </View>
                        <View style={styles.headerGoalChild}>
                            <Text style={styles.wrapTextCenter}>Goal</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.most}>
                    <View style={styles.left}>
                        <View style={styles.avt}>
                            <Image source={require('../../assets/style.jpg')} style={[{ width: 120, height: 120, alignSelf: 'center' }]} />
                        </View>
                    </View>
                    <View style={styles.center}>
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.text}>Text</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <YAxis
                        data={data_1}
                        formatLabel={(value) => value}
                        numberOfTicks={10}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{ fontSize: 10, fill: 'white' }}
                    />
                    <View style={{ flexDirection: 'column', width: width - 30 }}>
                        <LineChart

                            style={{ flex: 1, marginRight: 15, backgroundColor: '#3d403d' }}
                            data={data}
                            contentInset={{ top: 30, bottom: 30 }}
                            curve={shape.curveNatural}
                            svg={{ fill: 'rgb(53, 55, 94)' }}
                        >
                            <Grid />
                        </LineChart>
                        <XAxis
                            style={{ marginHorizontal: -10 }}
                            data={data_1}
                            formatLabel={(value, index) => index}
                            contentInset={{ left: 20, right: 20 }}
                            svg={{ fontSize: 10, fill: 'white' }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    headerAvatar: {
        position: 'absolute',
        flex: .6,
        flexDirection: 'column',
        top: 60
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    background: {
        width: width,
        height: 320,
        justifyContent: 'center',
        resizeMode: "cover",
        opacity: .5
    },
    headerName: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    headerGoal: {
        flexDirection: 'row',
        flex: .2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 24
    },
    headerGoalChild: {
        flex: 1,
        marginHorizontal: 10
    },
    most: {
        width: width - 30,
        height: 120,
        flexDirection: 'row',
        marginHorizontal: 15,
        backgroundColor: '#3a5c8c'
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
        padding: 15,
        flexDirection: 'row'
    },
    wrapTextCenter: {
        color: '#c4c0c0',
        fontSize: 14,
        alignSelf: 'center'
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    gradient: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
    },
});

export default Sport;