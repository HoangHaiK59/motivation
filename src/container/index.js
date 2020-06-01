import * as React from 'react';
// import { View, StyleSheet } from 'react-native';
//import { Navigation } from 'react-native-navigation';
import { View, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../components/dashboard';
import Book from '../components/book';
import Sport from '../components/sport';
import Task from '../components/task';
import Creative from '../components/creative';
import Diary from '../components/diary';
import Relax from '../components/relax';
import Statistic from '../components/statistic';
import { FontAwesome } from '@expo/vector-icons';
import Maxim from '../components/maxim';
import Travel from '../components/travel';
import Style from '../components/style';
import Detail from '../components/activity/detail';
import DetailBook from '../components/book/detail';
import DetailTravel from '../components/travel/detail';
import Month from '../components/diary/detail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Book" component={Book} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Sport" component={Sport} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Task" component={Task} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Creative" component={Creative} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Diary" component={Diary} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Relax" component={Relax} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Maxim" component={Maxim} options={{headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Travel" component={Travel} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Style" component={Style} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false, headerTitleAlign: 'center' }} />
            <Stack.Screen name="Detail Book" component={DetailBook} options={({route, navigation}) => ({ data: route.params.data, headerShown: false, headerTitleAlign: 'center' })} />
            <Stack.Screen name="Detail Travel" component={DetailTravel} options={({ route }) => ({ headerShown: true, headerTitleAlign: 'center', title: route.params.title })} />
            <Stack.Screen name="Detail Diary" component={Month} options={{ headerShown: false, headerTitleAlign: 'center' }} />
        </Stack.Navigator>
    )
}

function StatisticStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Statistic" component={Statistic} options={{ headerTitleAlign: 'center' }} />
        </Stack.Navigator>
    )
}

export default function Container() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#121212' />
            <NavigationContainer theme={{
                colors: {
                    background: '#121212',
                    text: '#c4c0c0'
                }
            }}>
                <Tab.Navigator
                tabBarOptions={{
                    style: {
                        backgroundColor: '#121212'
                    },
                    tabStyle: {
                        height: 45
                    },
                    labelStyle: {
                        color: '#c4c0c0'
                    },
                    keyboardHidesTabBar: true
                }}
                screenOptions={( {route} ) => ({tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if(route.name === 'Home') {
                        iconName = focused ? 'home': 'home'
                    } else if ((route.name === 'Statistic')) {
                        iconName = focused
                        ? 'line-chart'
                        : 'line-chart';
                    }
                    return <FontAwesome name={iconName} size={size} color={color} />;
                } })}
                >
                    <Tab.Screen name="Home" component={HomeStack} />
                    <Tab.Screen name="Statistic" component={StatisticStack} />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})