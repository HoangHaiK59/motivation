import React from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Sections from './sections';

const { width, height } = Dimensions.get('window');

const mariner = '#3B5F8F';
const mediumPurple = '#8266D4';
const tomato = '#F95B57';
const mySin = '#F3A646';

class Creative extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {

        const sections = [
            {
                title: 'IDEA',
                leftColor: mediumPurple,
                rightColor: mariner,
                image: { uri: 'https://i.imgur.com/waJJXLb.jpg' },
            },
            {
                title: 'BUSINESS',
                leftColor: tomato,
                rightColor: mediumPurple,
                image: { uri: 'https://i.imgur.com/waJJXLb.jpg' },
            },
            {
                title: 'PROJECT',
                leftColor: mySin,
                rightColor: tomato,
                image: { uri: 'https://i.imgur.com/waJJXLb.jpg' },
            },
            {
                title: 'WORKSHOP',
                leftColor: '#3e6b8a',
                rightColor: tomato,
                image: { uri: 'https://i.imgur.com/waJJXLb.jpg' },
            },
            {
                title: 'HOME',
                leftColor: mediumPurple,
                rightColor: mariner,
                image: { uri: 'https://i.imgur.com/waJJXLb.jpg' },
            },
        ];

        return (
            <Sections  {...{ sections }} />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        width: width / 2 - 20,
        height: 50,
        padding: 8,
        backgroundColor: '#8c3323',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
});

export default Creative;