import * as React from 'react';

import { Image, View, StyleSheet } from 'react-native';

export default function ViewImage({route}) {
    const { params } = route;
    return (
        <View style={styles.container}>
            <Image source={{uri: params.url}} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "contain"
    }
})