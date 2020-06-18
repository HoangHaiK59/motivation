import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, ScrollView, SafeAreaView, SectionList } from 'react-native';
import { AreaChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const { interpolate, Extrapolate } = Animated;

import { MAX_HEADER_HEIGHT } from '../../model/constants';
import Cover from './cover';
import Content from './content';

const Item = ({ progress, title }) => (
    <View style={styles.row}>
        <View style={styles.cell}>
            <Text style={styles.text}>{progress}</Text>
        </View>
        <View style={[styles.cell, {flex: 1}]}>
            <Text style={styles.text}>{title}</Text>
        </View>
    </View>
)

class Sport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.y = new Animated.Value(0);
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
        const height = interpolate(this.y, {
            inputRange: [- MAX_HEADER_HEIGHT, - 48 / 2],
            outputRange: [0, MAX_HEADER_HEIGHT + 48],
            extrapolate: Extrapolate.CLAMP
        });
        const item = {
            cover: require('../../assets/street.jpg'),
            header: 'TITLE',
            data: [
                {
                    title: '1',
                    progress: 90
                },
                {
                    title: '2',
                    progress: 80
                }
            ],
            chart: data
        }
        return (
            <View style={styles.main}>
                <Cover {...{...this.y, item}}/>
                <Content {...{...this.y, item}} />
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
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 24
    },
    headerGoalChild: {
        flex: 1,
        marginHorizontal: 10,
        flexDirection: 'column'
    },
    most: {
        width: width - 30,
        height: 120,
        flexDirection: 'row',
        marginHorizontal: 15,
        backgroundColor: '#3a5c8c',
        marginVertical: 10
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
    steps: {
        height: 150,
        padding: 15,
        width: width,
        flexDirection: 'column'
    },
    exercies: {
        width,
    },
    textHeader: {
        fontSize: 26,
        backgroundColor: 'transparent'
    },
    row: {
        flexDirection: "row",
        backgroundColor: "transparent",
    },
    cell: {
        padding: 16,
        justifyContent: "center",
    },
    index: {
        color: "#b2b3b4"
    },
});

export default Sport;