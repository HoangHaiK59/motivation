import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

export default function List() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.childLeft}>
                    <View style={styles.childLeftUp}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image source={require('../../../assets/memory.jpg')} style={{ width: 175, height: 100 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.childLeftDown}>
                        <TouchableOpacity onPress={() => { }}>
                            <Image source={require('../../../assets/street.jpg')} style={{ width: 175, height: 100 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.childRight}>
                    <TouchableOpacity onPress={() => { }}>
                        <Image source={require('../../../assets/style.jpg')} style={{ width: 175, height: '100%' }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    content: {
        flex: 1,
        padding: 25,
        flexDirection: 'row',
    },
    childLeft: {
        flex: 1,
        flexDirection: 'column',
    },
    childLeftUp: {
        flex: 1
    },
    childLeftDown: {
        flex: 1,
        marginTop: 15
    },
    childRight: {
        flex: 1,
        marginLeft: 15,
    },
})