import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image, Text, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, FlatList } from 'react-native';
import firebase from '../../firebase';
import moment from 'moment';

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
    const renderItem = ({item, index}) => {
        return <TouchableWithoutFeedback onPress={() => view(item)} style={[index > 0 && {marginTop:8}]}>
        <View style={styles.item}>
            <Image source={{uri: item.thumnail}} style={styles.image}/>
            <View style={styles.content}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{moment.unix(item.createdAt).fromNow()}</Text>
            </View>
        </View>
    </TouchableWithoutFeedback>
    }
    return (
        <SafeAreaView style={{padding: 8, flex: 1,}}>
            <FlatList 
            style={styles.container} 
            scrollEnabled={true}
            renderItem={renderItem}
            data={items}
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
    }
})

export default Investment;