import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import firebase from '../../firebase';

const { width } = Dimensions.get('window');

const firestore = firebase.firestore();

const Investment = props => {
    const [items, setItems] = React.useState([]);
    React.useEffect(() => {
        getInvestment();
    }, [])
    const getInvestment = () => {
        firestore.collection('investment')
        .get()
        .then(querySnapshot => {
            setItems(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})))
        })
    }
    const view = item => {
        props.navigation.navigate('View Invest', {
            id: item.id
        })
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {
                    items.map(item => <TouchableOpacity key={item.id} onPress={() => view(item)}>
                            <View style={styles.item}>
                                <Image source={{uri: item.thumnail}} style={styles.image}/>
                                <Text style={styles.name}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>)
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    item: {
        width: width,
        display: 'flex',
        flexDirection: 'column'
    },
    image: {
        width: width,
        height: 200,
        resizeMode: 'cover'
    },
    name: {
        fontSize: 16,
        color: '#fff'
    }
})

export default Investment;