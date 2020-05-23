import * as React from 'react';
// import { View, StyleSheet } from 'react-native';
//import { Navigation } from 'react-native-navigation';
import { View, StatusBar, StyleSheet } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Book" component={Book} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Sport" component={Sport} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Task" component={Task} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Creative" component={Creative} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Diary" component={Diary} options={{ headerTitleAlign: 'center' }} />
            <Stack.Screen name="Relax" component={Relax} options={{ headerTitleAlign: 'center' }} />
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
                screenOptions={( {route} ) => ({tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if(route.name === 'Home') {
                        iconName = focused ? 'ios-information-circle': 'ios-information-circle-outline'
                    } else if ((route.name === 'Statistic')) {
                        iconName = focused
                        ? 'ios-list-box'
                        : 'ios-list';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
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