import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import firebase from '../../../firebase';
import HTML from 'react-native-render-html';

const firestore = firebase.firestore();

const { width } = Dimensions.get('window');

const ViewInvest = ({route, navigation}) => {
    const [docItem, setDocItem] = React.useState(null);
    const { id } = route.params;
    React.useEffect(() => {
        getDoc()
    }, [])
    const getDoc = () => {
        firestore.doc(`investment/${id}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                setDocItem(doc.data())
            }
        })
    }
    const text2html = (str) => {
        return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {
                    docItem && <View style={styles.content}>
                        <Image style={styles.image} source={{uri: docItem.thumnail}} />
                        <HTML source={{html: text2html(docItem.content)}} tagsStyles={{p: {fontSize: 14, color: '#fff'}, strong: {fontSize: 16, color: '#fff'}, li: {fontSize: 14, color: '#fff'}}}/>
                    </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    image: {
        width: width,
        height: 250
    },
    content: {
        padding: 10,
        flex: 1
    },
    textContent: {
        fontSize: 14,
        color: '#fff'
    }
})

export default ViewInvest;