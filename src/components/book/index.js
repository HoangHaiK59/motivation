import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import firebase, { getAppName, DB } from '../../firebase';

console.ignoredYellowBox = ['Setting a timer'];

class Book extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: []
        }
    }

    copyDocument() {
        firebase.firestore(getAppName()).collection(DB.book).get()
            .then(result => result.docs.forEach(doc => {
                firebase.firestore(getAppName()).collection(DB.book).add(doc.data())
            }))
    }

    handleViewDetail(router, options) {
        this.props.navigation.navigate(router, {
            data: options
        })
    }

    componentDidMount() {
        firebase.firestore(getAppName()).collection(DB.book)
            .get()
            .then(result => {
                if (result.docs.length > 0) {
                    let books = [];
                    result.docs.forEach(doc => books.push(doc.data()));
                    this.setState({ books })
                }
            })
        //this.copyDocument()
    }

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{marginTop: 10}}>
                <View style={styles.container}>
                    {
                        this.state.books.length > 0 ? this.state.books.map((book, id) => <View style={[styles.bookContainer, { position: 'relative' }]} key={id} >
                            <View style={styles.label}>
                                <Text style={styles.labelText}>{book.num_of_page_read}/{book.total_page}</Text>
                            </View>
                            <Image source={{ uri: book.image }} style={[styles.image, { opacity: .5 }]}>
                            </Image>
                            <TouchableOpacity onPress={() => this.handleViewDetail('Detail Book', book)}>
                                <Text style={[styles.text]}>{book.name}</Text>
                            </TouchableOpacity>
                        </View>) : null
                    }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginLeft: 25
    },
    bookContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 105,
        height: 'auto',
        marginLeft: 10
    },
    image: {
        width: 100,
        height: 100
    },
    label: {
        position: 'absolute',
        right: 0,
        top: 10
    },
    labelText: {
        color: '#d5dbe8',
        fontSize: 10,
        zIndex: 1
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
});

export default Book;