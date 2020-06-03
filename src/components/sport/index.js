import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { AreaChart, LineChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const { width, height } = Dimensions.get('window');

class Sport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
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
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <ImageBackground source={require('../../assets/default-image.jpg')} style={{width: width, height: 250, justifyContent: 'center', resizeMode: 'cover'}}>
                        <View style={styles.headerAvatar}>
                            <Image source={require('../../assets/street.jpg')} style={[styles.image, {alignSelf: 'center'}]} />
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
                    </ImageBackground>
                </View>
                <View style={styles.most}>
                    <View style={styles.left}>
                        <Text>Text</Text>
                    </View>
                    <View style={styles.right}>
                        <Text>Text</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <LineChart
                        style={{ height: 200, backgroundColor: 'white' }}
                        data={data}
                        contentInset={{ top: 30, bottom: 30 }}
                        curve={shape.curveNatural}
                        svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                    >
                        <Grid />
                    </LineChart>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 10
    },
    header: {
        padding: 15,
        flex: 1.4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerAvatar: {
        flex: .6,
        flexDirection: 'column'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
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
    },
    headerGoalChild: {
        flex: 1,
        marginHorizontal: 10
    },
    most: {
        width: width - 30,
        height: 120,
        flexDirection: 'row',
        marginHorizontal: 15
    },
    left: {
        width: 120,
        height: 50
    },
    right: {
        height: 50
    },
    content: {
        flex: 1,
        padding: 15,
    },
    wrapTextCenter: {
        color: '#c4c0c0',
        fontSize: 14,
        alignSelf: 'center'
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
});

export default Sport;