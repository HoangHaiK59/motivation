import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableWithoutFeedback, SafeAreaView, TextInput } from 'react-native';
import firebase from '../../investment.firebase';
import moment from 'moment';
import { AnimatedFlatList } from '../common/flatlist'
//import investFirebase from '../../investment.firebase';

const { width } = Dimensions.get('window');

const firestore = firebase.firestore();

const Investment = props => {
    const [items, setItems] = React.useState([]);
    const [filter, setFilter] = React.useState('');
    React.useEffect(() => {
        getInvestment();
    }, [])
    const getInvestment = () => {

        firestore.collection('posts')
            .where('categories', 'array-contains', { id: 'usCdOk7HaxgnXokYViLJ', name: 'Investment' })
            .get()
            .then(querySnapshot => {
                setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            })
    }
    const getInvestmentByFilter = () => {

        firestore.collection('posts')
            .where('categories', 'array-contains', { id: 'usCdOk7HaxgnXokYViLJ', name: 'Investment' })
            .orderBy('name')
            .where('name', '>=', filter.toUpperCase())
            .where('name', '<=', filter.toUpperCase() + '~')
            .get()
            .then(querySnapshot => {
                setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            })
    }
    const view = item => {
        props.navigation.navigate('View Invest', {
            id: item.id
        })
    }
    // const renderItem = ({ item, index }) => {
    //     return <TouchableWithoutFeedback onPress={() => view(item)} style={[index > 0 && { marginTop: 8 }]}>
    //         <View style={styles.item}>
    //             <Image source={{ uri: item.thumnail }} style={styles.image} />
    //             <View style={styles.content}>
    //                 <Text style={styles.name}>{item.name}</Text>
    //                 <Text style={styles.time}>{moment.unix(item.createdAt).fromNow()}</Text>
    //             </View>
    //         </View>
    //     </TouchableWithoutFeedback>
    // }
    return (
        <SafeAreaView style={{ padding: 8, flexGrow: 1 }}>
            <View style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TextInput
                    placeholder="Search.."
                    placeholderTextColor={styles.placeholderText.color}
                    style={styles.input}
                    value={filter}
                    onChangeText={filter => setFilter(filter)}
                    returnKeyType="search"
                    onSubmitEditing={getInvestmentByFilter}
                />
            </View>
            <AnimatedFlatList
                data={items}
                onPressItem={view}
                typeRender='BOTH'
            />
        </SafeAreaView>
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
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10
    },
    image: {
        flex: 1,
        height: 100,
        resizeMode: 'cover',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 2,
        paddingHorizontal: 5,
    },
    name: {
        fontSize: 16,
        color: '#000'
    },
    time: {
        fontSize: 13,
        color: '#000'
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

export default Investment;