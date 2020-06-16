import React from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

class Creative extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.text}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.text}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.text}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.text}>Text</Text>
                    </TouchableOpacity>
                </View>
            </View>
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