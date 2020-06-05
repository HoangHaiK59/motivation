import * as React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function Settings(props) {
    console.log(props)
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Settings</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
})