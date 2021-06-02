import * as React from 'react';
//import Animated from 'react-native-reanimated';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions, LogBox, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Activity from '../activity';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../text/regular';

const { width, height } = Dimensions.get('window');

// LogBox.ignoreLogs(['Setting a timer']);


export default function Dashboard(props) {
    const [index, setIndex] = React.useState(new Date().getDay() - 1);
    const [data, setData] = React.useState(null);
    const [routes] = React.useState([
        { key: 'Monday', title: 'MON', day: 1 },
        { key: 'Tuesday', title: 'TUE', day: 2 },
        { key: 'Wednesday', title: 'WED', day: 3 },
        { key: 'Thursday', title: 'THU', day: 4 },
        { key: 'Friday', title: 'FRI', day: 5 },
        { key: 'Saturday', title: 'SAT', day: 6 },
        { key: 'Sunday', title: 'SUN', day: 7 },
    ]);

    const renderScene = ({ route }) => {
        switch (route.day) {
            case 1:
                return <Activity {...props} day={1} />
            case 2:
                return <Activity {...props} day={2} />
            case 3:
                return <Activity {...props} day={3} />
            case 4:
                return <Activity {...props} day={4} />
            case 5:
                return <Activity {...props} day={5} />
            case 6:
                return <Activity {...props} day={6} />
            case 7:
                return <Activity {...props} day={7} />
        }
    }

    const handlePress = (componentName) => {
        props.navigation.navigate(componentName);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.activity}>
                    <TabView
                        renderTabBar={(props) => <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: 'red' }}
                            indicatorContainerStyle={styles.tabBar}
                            renderLabel={({ route }) => {
                                return (
                                    <View key={route.key}>
                                        <Text style={styles.labelText}>
                                            {route.title}
                                        </Text>
                                    </View>
                                )
                            }}
                        />}
                        springVelocityScale={2}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={width}
                        style={styles.tabView}
                    />
                </View>
                <View style={styles.content}>

                    <LinearGradient colors={['rgb(35, 107, 96)', 'rgb(35, 145, 128)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Book')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Book</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(195, 102, 8)', 'rgb(195, 122, 22)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Sport')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Sport</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(191, 44, 36)', 'rgb(237, 35, 24)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Plan')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Plan</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(37, 148, 131)', 'rgb(35, 168, 148)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Creative')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Creative</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(25, 135, 166)', 'rgb(25, 143, 176)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Diary')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Diary</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(32, 80, 201)', 'rgb(28, 87, 235)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Relax')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Relax</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(123, 141, 186)', 'rgb(128, 150, 207)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Maxim')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Maxim</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(217, 91, 63)', 'rgb(240, 91, 58)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Travel')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Travel</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['rgb(173, 122, 194)', 'rgb(187, 127, 212)']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Style')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Style</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                    <LinearGradient colors={['#cc2b5e', '#753a88']} style={[styles.item]}>
                        <TouchableWithoutFeedback onPress={() => handlePress('Investment')}>
                            <Animated.View style={[styles.button]}>
                                <Text style={[styles.text, { padding: 5 }]}>Investment</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </LinearGradient>

                </View>
            </View>
        </ScrollView>
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
    content: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        height: 'auto',
        flexWrap: 'wrap'
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
    button: {
        width: '100%',
        height: '100%'
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
        fontSize: 10,
        fontWeight: '700',
        color: '#c4c0c0'
    }
})