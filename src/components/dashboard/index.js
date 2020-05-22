import * as React from 'react';
//import Animated from 'react-native-reanimated';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Activity from '../activity';
import firebase from '../../firebase';

const { width, height } = Dimensions.get('window');



export default function Dashboard(props) {
    const [index, setIndex] = React.useState(new Date().getDay() - 1);
    const [data, setData] = React.useState(null);
    const [routes] = React.useState([
        {key: 'Monday', title: 'Monday'},
        {key: 'Tuesday', title: 'Tuesday'},
        {key: 'Wednesday', title: 'Wednesday'},
        {key: 'Thursday', title: 'Thursday'},
        {key: 'Friday', title: 'Friday'},
        {key: 'Saturday', title: 'Saturday'},
        {key: 'Sunday', title: 'Sunday'},
    ]);

    React.useEffect(() => {
        // firebase.firestore(firebase.app('motivation')).collection('activity').get()
        // .then(result => {
        //     console.log(result.docs)
        //     if(result.docs.length> 0) {
        //         let activity = [];
        //         result.docs.forEach(doc => activity.push(doc.data()));
        //         setData(activity);
        //     }
        // })
    }, [])

    const renderScene = SceneMap({
        Monday: () => <Activity />,
        Tuesday: () => <Activity />,
        Wednesday: () => <Activity />,
        Thursday: () => <Activity />,
        Friday: () => <Activity />,
        Saturday: () => <Activity />,
        Sunday: () => <Activity />,
    })

    let y, i, k, m, n, o;
    y = new Animated.Value(1);
    i = new Animated.Value(1);
    k = new Animated.Value(1);
    m = new Animated.Value(1);
    n = new Animated.Value(1);
    o = new Animated.Value(1);
    // const scale = interpolate(y, {
    //     inputRange: [0, 1],
    //     outputRange: [0, 0.2],
    //     extrapolate: Extrapolate.CLAMP
    // });
    const handlePressIn = (animatedValue, componentName) => {
        Animated.spring(animatedValue, {
            toValue: .95
        }).start();
        props.navigation.navigate(componentName);
    }
    const handlePressOut = (animatedValue) => {
        Animated.spring(animatedValue, {
            toValue: 1,
            tension: 40,
            friction: 3
        }).start()
    }
    const handlePress = (componentName) => {
        props.navigation.navigate(componentName);
    }

    return (
        <View style={styles.container}>
            <View style={styles.activity}>
                <TabView 
                renderTabBar={(props) => <TabBar 
                    {...props}
                    indicatorStyle={{backgroundColor: 'red'}}
                    indicatorContainerStyle={styles.tabBar}
                    renderLabel={({route}) => {
                        return <View >
                            <Text style={styles.labelText}>
                                {route.title}
                            </Text>
                        </View>
                    }}
                    />}
                springVelocityScale={2} 
                navigationState={{index, routes}} 
                renderScene={renderScene} 
                onIndexChange={setIndex} 
                initialLayout={width} 
                style={styles.tabView}
                />
            </View>
            <TouchableWithoutFeedback onPress={() => handlePress('Book')}>
                <Animated.View style={[styles.item, { transform: [{ scale: y }] }]}>
                    <Text style={styles.text}>Book</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handlePress('Sport')}>
                <Animated.View style={[styles.item, { transform: [{ scale: i }] }]}>
                    <Text style={styles.text}>Sport</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handlePress('Task')}>
                <Animated.View style={[styles.item, { transform: [{ scale: k }] }]}>
                    <Text style={styles.text}>Task</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handlePress('Creative')}>
                <Animated.View style={[styles.item, { transform: [{ scale: m }] }]}>
                    <Text style={styles.text}>Creative</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handlePress('Diary')}>
                <Animated.View style={[styles.item, { transform: [{ scale: n }] }]}>
                    <Text style={styles.text}>Diary</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handlePress('Relax')}>
                <Animated.View style={[styles.item, { transform: [{ scale: o }] }]}>
                    <Text style={styles.text}>Relax</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        display: 'flex'
    },
    activity: {
        width: width,
        height: height / 3,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        marginLeft: 12,
    },
    item: {
        width: width / 2 - 20,
        height: 100,
        backgroundColor: '#363030',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 12,
        borderRadius: 5
    },
    text: {
        color: 'white',
        fontSize: 14
    },
    tabView: {
        fontSize: 14
    },
    tabBar: {
        fontSize: 14,
        backgroundColor: '#80422a'
    },
    labelText: {
        fontSize: 9, 
        fontWeight: '700', 
        color: '#c4c0c0'
    }
})