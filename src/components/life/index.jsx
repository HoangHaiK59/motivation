import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import TextBold from '../text/bold';
import { Entypo as Icon } from '@expo/vector-icons';
import New from './create';
import firebase from '../../firebase';
import { AnimatedFlatList } from '../common/flatlist';

const firestore = firebase.firestore();

const Life = props => {
    const [stories, setStories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState('');
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
    const getStoriesByFilter = () => {
        firestore.collection('life')
        .orderBy('name')
        .where('name', '>=', filter.toUpperCase())
        .where('name', '<=', filter.toUpperCase() + '~')
        .get()
        .then(snapShot => {
            setStories(snapShot.docs.map(doc => ({id: doc.id, ...doc.data()})))
        })
    }
    const getStories = () => {
        firestore.collection('life')
        .get()
        .then(snapShot => {
            setStories(snapShot.docs.map(doc => ({id: doc.id, ...doc.data()})))
        })
    }
    const back = () => {
        props.navigation.goBack();
    }
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.info}>
                <TextBold style={styles.title}>Recent Post</TextBold>
                <TextInput
                placeholder="Search.."
                placeholderTextColor={styles.placeholderText.color}
                style={styles.input}
                value={filter}
                onChangeText={filter => setFilter(filter)}
                returnKeyType="search"
                onSubmitEditing={getStoriesByFilter}
                />
            </View>
            <AnimatedFlatList
            contentContainerStyle={{paddingHorizontal: 12}}
            showsVerticalScrollIndicator={false}
            data={stories}
            typeRender={'BOTH'}
            onPressItem={onPress}
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
        //paddingVertical: Constants.statusBarHeight,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 12
    },
    info: {
        paddingHorizontal: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: 80,
        paddingBottom: 5
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff'
    },
    input: {
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#1d1f1f',
        color: '#949999'
    },
    placeholderText: {
        color: '#949999'
    }

})

export default Life;