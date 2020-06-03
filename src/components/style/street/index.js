import * as React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';

export default function Street ({ route }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Street</Text>
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