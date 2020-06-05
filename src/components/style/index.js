import * as React from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('screen');
import Cover from '../common/cover';
import Content from './content';
import Animated from 'react-native-reanimated';

const style = {
    cover: require('../../assets/default-image.jpg'),
    header: 'STYLE',
}

class Style extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.animatedValue = new Animated.Value(0);
    }

    render() {
        return (
            <View style={styles.main}>
                <Cover animatedValue={this.animatedValue} style={style} />
                <Content  animatedValue={this.animatedValue} style={style}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        //flexDirection: 'column'
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