import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import Text from '../text/regular';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from '../../firebase';

const { width } = Dimensions.get('window');

const firestore = firebase.firestore();

const Item = ({ item, onPress }) => {
    return <LinearGradient colors={['#eb1010', '#eb1010']} style={styles.itemCtn}>
        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={styles.item}>
                <Text style={{color: '#fff'}}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    </LinearGradient>
}

const Vocabulary = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        getCategories();
    }, [])
    const getCategories = () => {
        firestore.collection('vocabulary_categories')
        .get()
        .then(snapshot => {
            setCategories(snapshot.docs.map(doc => doc.data() ))
        })
    }
    const onPress = item => {

    }
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                contentContainerStyle={{flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                data={categories}
                keyExtractor={item => item.docId}
                numColumns={2}
                renderItem={({item}) => <Item item={item} onPress={onPress} />}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginVertical: Constants.statusBarHeight
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