import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const Item = ({index, item }) => (
        <View style={styles.row}>
        <View style={styles.cell}>
            <Image source={{uri: item.image_url}} resizeMode='cover' style={styles.index} />
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.farvorite}>{item.is_farvorite? 'Remove': 'Add'}</Text>
        </View>
    </View>
    )

export default Item;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        backgroundColor: "black",
    },
    cell: {
        padding: 16,
        justifyContent: "center",
    },
    index: {
        //color: "#b2b3b4",
        width: 50,
        height: 45
    },
    farvorite: {
        color: "#b2b3b4",
    },
    name: {
        color: "white",
    },
})