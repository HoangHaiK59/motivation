import * as React from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('screen');

class Style extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Image source={require('../../assets/default-image.jpg')} style={{ width: width - 50, height: '100%', opacity: .7 }} />
                    <View style={styles.headerText}>
                        <Text style={[styles.text, { fontSize: 37, fontWeight: 'bold' }]}>STYLE</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.childLeft}>
                        <View style={styles.childLeftUp}>
                            <TouchableOpacity onPress={() => {}}>
                                <Image source={require('../../assets/memory.jpg')} style={{ width: '100%', height: '100%' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.childLeftDown}>
                            <TouchableOpacity onPress={() => {}}>
                                <Image source={require('../../assets/street.jpg')} style={{ width: '100%', height: '100%' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.childRight}>
                        <TouchableOpacity onPress={() => {}}>
                            <Image source={require('../../assets/style.jpg')} style={{ width: '100%', height: '100%' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        flex: .5,
        paddingTop: 35,
        alignItems: 'center',
        //marginRight: 15,
    },
    headerText: {
        position: 'absolute',
        top: '35%',
        left: width / 2 - 55
    },
    content: {
        flex: 1,
        padding: 25,
        flexDirection: 'row'
    },
    childLeft: {
        flex: 1,
        flexDirection: 'column'
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
        backgroundColor: 'white'
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
});

export default Style;