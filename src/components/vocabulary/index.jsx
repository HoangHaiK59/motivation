import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import Text from '../text/regular';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from '../../firebase';
import { FontAwesome as Icon } from '@expo/vector-icons';
import CreateCategory from './createCategory';

const { width } = Dimensions.get('window');

const firestore = firebase.firestore();

const Item = ({ item, onPress }) => {
    return <LinearGradient colors={['#1d2561', '#1d2561']} style={styles.itemCtn}>
        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={styles.item}>
                <Text style={{ color: '#fff' }}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    </LinearGradient>
}

const Vocabulary = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
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
            headerRight: () => (
                <TouchableOpacity onPress={handleCreate}>
                    <Icon name='plus-circle' size={20} color='#fff' />
                </TouchableOpacity>
            )
        })
    }, [])
    useEffect(() => {
        getCategories();
    }, [])
    const handleCreate = () => {
        setVisible(true)
    }
    const getCategories = () => {
        firestore.collection('vocabulary_categories')
            .get()
            .then(snapshot => {
                setCategories(snapshot.docs.map(doc => doc.data()))
            })
    }
    const onPress = item => {
        navigation.navigate('Synthesis', {id: item.id})
    }
    const callback = () => {
        getCategories();
    }
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                data={categories}
                keyExtractor={item => item.id}
                numColumns={2}
                renderItem={({ item }) => <Item item={item} onPress={onPress} />}
            />
            {
                visible && <CreateCategory visible={visible} setVisible={setVisible} callback={callback} />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 10
    },
    itemCtn: {
        height: 100,
        width: width / 2 - 16,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 5,
        padding: 2
    },
    item: {
        height: 100,
        width: '100%',
    }
})

export default Vocabulary;