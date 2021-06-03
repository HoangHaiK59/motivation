import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import Text from '../text/regular';
import TextBold from '../text/bold';

const Item = ({item, index, onPress}) => {
    return (
        <TouchableOpacity>
            <View style={styles.card}>
                <View style={styles.left}></View>
                <View style={styles.right}></View>
            </View>
        </TouchableOpacity>
    )
}

const Life = props => {
    const [stories, setStories] = useState([]);
    const onPress = (item) => {

    }
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.info}>
                <TextBold style={styles.title}>Recent Post</TextBold>
            </View>
            <FlatList
            data={stories}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => <Item item={item} index={index} onPress={onPress} />}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flexGrow: 1,
        paddingVertical: Constants.statusBarHeight,
        display: 'flex',
        flexDirection: 'column'
    },
    info: {
        flex: 0.5
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff'
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1c1b1b'
    },
    left: {
        flex: .5
    },
    right: {
        flex: 1
    }
})

export default Life;