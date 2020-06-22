import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import { SMALL_HEADER_HEIGHT } from './model';
import MockEntry from './entry';
import MockCard from './card';

const { height, width } = Dimensions.get('window');
const { multiply } = Animated;

export default class Pages extends React.PureComponent {
    render() {
        const { sections, y, x } = this.props;
        const translateX = multiply(x, -1);
        const translateY = multiply(y, -1);
        return (
            <View style={styles.container}>
                {
                    sections.map(({ image }, key) => (
                        <Animated.View style={[styles.page, { transform: [{ translateX }, { translateY }] }]} {...{ key }}>
                            <MockEntry {...{ image }} />
                            <MockCard {...{ image }} />
                            <MockEntry {...{ image }} />
                            <MockEntry {...{ image }} />
                            <MockEntry {...{ image }} />
                            <MockEntry {...{ image }} />
                        </Animated.View>
                    ))
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    page: {
        backgroundColor: 'white',
        width,
        height: height - SMALL_HEADER_HEIGHT,
    },
});