import * as React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const Detail = ( { route } ) => {
    const { data } = route.params;
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{data.name}</Text>
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
});

export default Detail;