import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';

export default function Month({route}) {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Detail month</Text>
        </View>
    )
}

const styles= StyleSheet.create({
    container: {
        flex :1
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
})