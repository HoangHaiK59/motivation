import * as React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';

export default function Clothes ({ route }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Clothes</Text>
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