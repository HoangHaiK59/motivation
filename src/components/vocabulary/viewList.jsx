import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import firebase from '../../firebase';
import { AnimatedFlatList } from '../common/flatcard';
import PropTypes from 'prop-types';
import { FontAwesome as Icon } from '@expo/vector-icons';
import AddVocabulary from './addVocabulary';
import base64 from 'base-64';

const firestore = firebase.firestore();

const Synthesis = ({ route, navigation }) => {
    const { id } = route.params;
    const [vocabulary, setVocabulary] = useState({name: base64.decode(id), data: []});
    const [visible, setVisible] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name='chevron-left' size={20} color='#fff' />
            </TouchableOpacity>,
            headerLeftContainerStyle: {
                paddingLeft: 8
            },
            headerRightContainerStyle: {
                paddingRight: 8
            },
            headerTitle: base64.decode(id),
            headerTitleStyle: {
                fontSize: 14,
                fontFamily: 'Lato',
                fontWeight: '700'
            },
            headerRight: () => (
                <TouchableOpacity onPress={handleCreate}>
                    <Icon name='plus-circle' size={20} color='#fff' />
                </TouchableOpacity>
            )
        })
    }, [])
    useEffect(() => {
        getVocabularyByCategory();
    }, [])
    const getVocabularyByCategory = () => {
        firestore.doc(`vocabulary/${id}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    setVocabulary({ id: doc.id, ...doc.data() })
                }
            })
            .catch(error => console.error(error))
    }
    const onPressItem = (item) => {

    }
    const handleCreate = () => {
        setVisible(true);
    }
    return (
        <SafeAreaView style={styles.container}>
            <AnimatedFlatList
                data={vocabulary.data}
                onPressItem={onPressItem}
            />
            {
                visible && <AddVocabulary
                visible={visible}
                setVisible={setVisible}
                callback={getVocabularyByCategory}
                vocabulary={vocabulary}
                id={id}
                />
            }
        </SafeAreaView>
    )
}

Synthesis.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginVertical: Constants.statusBarHeight,
        paddingHorizontal: 8
    }
})

export default Synthesis;