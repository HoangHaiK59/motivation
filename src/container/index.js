 import * as React from 'react';
// import { View, StyleSheet } from 'react-native';
//import { Navigation } from 'react-native-navigation';
import { View, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../components/dashboard';
import Book from '../components/book';
import Sport from '../components/sport';
import Task from '../components/task';
import Creative from '../components/creative';
import Diary from '../components/diary';
import Relax from '../components/relax';

const Stack = createStackNavigator();

export default function Container() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#121212'/>
            <NavigationContainer theme={{colors: {
                background: '#121212',
                text: '#c4c0c0'
            }}}>
                <Stack.Navigator>
                    <Stack.Screen name="Dashboard" component={Dashboard} options={{headerTitleAlign: 'center' }}/>
                    <Stack.Screen name="Book" component={Book} options={{headerTitleAlign: 'center' }}/>
                    <Stack.Screen name="Sport" component={Sport} options={{headerTitleAlign: 'center' }}/>
                    <Stack.Screen name="Task" component={Task} options={{headerTitleAlign: 'center' }}/>
                    <Stack.Screen name="Creative" component={Creative} options={{headerTitleAlign: 'center' }}/>
                    <Stack.Screen name="Diary" component={Diary} options={{headerTitleAlign: 'center' }}/>
                    <Stack.Screen name="Relax" component={Relax} options={{headerTitleAlign: 'center' }}/>
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})