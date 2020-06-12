import * as React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons as Icon } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Action = ({ route, navigation }) => {
    const { params } = route;
    return (
        <View style={styles.container}>
            <View style={styles.backdrop}>
                <Image source={{uri: params.image_url}} resizeMode="contain" style={{width: 200, height: 200}}/>
            </View>
            <View style={styles.content}>
                <TouchableOpacity style={styles.row}>
                    <View style={styles.cell}>
                        <Icon name='ios-heart' size={24} color={params.is_farvorite? '#a6392d': 'transparent'}/>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                        <Text style={styles.text}>{params.is_farvorite? 'Đã thích': 'Thích'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        flexDirection: 'column',
        padding: 8
    },
    text: {
        fontSize: 14,
        color: '#fff'
    },
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        padding: 8,
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    row: {
        flexDirection: "row",
        backgroundColor: "black",
    },
    cell: {
        padding: 16,
        justifyContent: "center",
    },
    icon: {
        width: 50,
        height: 45
    },
})

export default Action;