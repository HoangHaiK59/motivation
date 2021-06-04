import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import Text from '../text/regular';
import TextBold from '../text/bold';
import { Entypo as Icon } from '@expo/vector-icons';
import New from './create';
import firebase from '../../firebase';

const firestore = firebase.firestore();

const Item = ({item, index, onPress}) => {
    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={styles.card}>
                <View style={styles.left}>
                    <Image source={{uri: item.url}} style={styles.image} />
                </View>
                <View style={styles.right}>
                    <Text style={{color: '#fff'}}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const Life = props => {
    const [stories, setStories] = useState([]);
    const [visible, setVisible] = useState(false);
    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeftContainerStyle: {
                paddingLeft: 8
            },
            headerRightContainerStyle: {
                paddingRight: 8
            },
            headerTitle: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => back()}>
                    <Icon name='chevron-left' size={25} color='#fff' />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => openOrClose(true)}>
                    <Icon name='circle-with-plus' size={25} color="#77a3a6" />
                </TouchableOpacity>
            )
        })
    }, [])
    useEffect(() => {
        getStories();
    }, [])
    const onPress = (item) => {
        props.navigation.navigate('Life Story', {id: item.id})
    }
    const openOrClose = (visible) => {
        setVisible(visible)
    }
    const getStories = () => {
        firestore.collection('life')
        .get()
        .then(snapShot => {
            setStories(snapShot.docs.map(doc => ({id: doc.id, ...doc.data()})))
        })
    }
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.info}>
                <TextBold style={styles.title}>Recent Post</TextBold>
            </View>
            <FlatList
            contentContainerStyle={{paddingHorizontal: 12}}
            data={stories}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => <Item item={item} index={index} onPress={onPress} />}
            />
            {
                visible && <New visible={visible} setVisible={openOrClose} callback={getStories} />
            }
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
        flex: 0.5,
        paddingHorizontal: 12
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff'
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#1c1b1b',
        height: 84
    },
    left: {
        flex: .5
    },
    right: {
        flex: 1
    },
    image: {
        resizeMode: 'cover',
        width: 100,
        height: 100
    }
})

export default Life;