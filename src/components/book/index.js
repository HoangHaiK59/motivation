import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, CheckBox, Dimensions, TouchableHighlight } from 'react-native';
import firebase, { getAppName, DB } from '../../firebase';
import { FontAwesome } from '@expo/vector-icons';

console.ignoredYellowBox = ['Setting a timer'];

const { width, height } = Dimensions.get('window');

class Book extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            visible: false,
            update: false,
            model: {
                name: '',
                image: '',
                category: 0,
                is_farvorite: false,
                note: [],
                num_of_page_read: 0,
                total_page: 0
            }
        }

        this.firebaseRef = firebase.firestore(getAppName()).collection(DB.book);
    }

    copyDocument() {
        this.firebaseRef.get()
            .then(result => result.docs.forEach(doc => {
                firebase.firestore(getAppName()).collection(DB.book).add(doc.data())
            }))
    }

    updateDocument() {

    }

    getBooks() {
        this.firebaseRef
            .get()
            .then(result => {
                if (result.docs.length > 0) {
                    let books = [];
                    result.docs.forEach(doc => books.push({ id: doc.id, ...doc.data() }));
                    this.setState({ books })
                }
            })
    }

    createCommentNote(docId, comments, comment) {
        this.firebaseRef.doc(docId).update({
            note: [...comments, comment]
        }).then()
            .catch(err => console.log(err))
    }

    handleChangeFarvorite(docId, state) {
        this.firebaseRef.doc(docId).update({
            is_farvorite: state
        }).then()
            .catch(err => console.log(err))
    }

    handleViewDetail(router, options) {
        this.props.navigation.navigate(router, {data: options});
    }

    handleChangeText(text, modelField) {
        if (modelField === 'name')
            this.setState(state => ({ model: { ...state.model, name: text } }));
        else if (modelField === 'image')
            this.setState(state => ({ model: { ...state.model, image: text } }));
        else if (modelField === 'is_farvorite')
            this.setState(state => ({ model: { ...state.model, is_farvorite: text } }));
        else if (modelField === 'num_of_page_read')
            this.setState(state => ({ model: { ...state.model, num_of_page_read: text } }));
        else if (modelField === 'total_page')
            this.setState(state => ({ model: { ...state.model, total_page: text } }));
        else if (modelField === 'category')
            this.setState(state => ({ model: { ...state.model, category: text } }));
        else if (modelField === 'note') {
            let note = [];
            note.push(text);
            this.setState(state => ({ model: { ...state.model, note: note } }));
        }
    }

    createBook() {
        if (this.state.model.name !== '' && this.state.model.image !== '') {
            this.setState({ update: true, visible: false })
            this.firebaseRef.add(this.state.model)
                .then()
                .catch(err => console.log(err))
        }
    }

    componentDidMount() {
        this.getBooks()
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(nextState !== this.state) {
    //         return true
    //     }
    //     return false;
    // }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.update) {
            this.getBooks();
            this.setState({ update: false })
        }
    }

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, flexGrow: 1 }}>
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        {
                            this.state.books.length > 0 ? this.state.books.map((book, id) => <View style={[styles.bookContainer, { position: 'relative' }]} key={id} >
                                <View style={styles.label}>
                                    <Text style={styles.labelText}>{book.num_of_page_read}/{book.total_page}</Text>
                                </View>
                                <Image source={{ uri: book.image }} style={[styles.image, { opacity: .5 }]}>
                                </Image>
                                <TouchableOpacity onPress={() => this.handleViewDetail('Detail Book', {
                                    book: book,
                                    handleChangeFarvorite: this.handleChangeFarvorite.bind(this),
                                    createCommentNote: this.createCommentNote.bind(this)
                                })}>
                                    <Text style={[styles.text]}>{book.name}</Text>
                                </TouchableOpacity>
                            </View>) : null
                        }
                    </View>
                    <TouchableOpacity style={[styles.buttonBottom]} onPress={() => this.setState({ visible: true, model: {
                        name: '',
                        image: '',
                        category: 0,
                        is_farvorite: false,
                        note: [],
                        num_of_page_read: 0,
                        total_page: 0
                    } })}>
                        <FontAwesome name='plus-circle' size={25} color='#cc3112' />
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={this.state.visible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {}}>
                    <View style={styles.centerView}>
                        <View style={styles.modalView}>
                            <Text style={styles.marginLeft}>Name</Text>
                            <TextInput
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'name')}
                                value={this.state.model.name} />
                            <Text style={styles.marginLeft}>Farvorite</Text>
                            <CheckBox
                                style={{ marginLeft: 5 }}
                                onValueChange={value => this.handleChangeText(value, 'is_farvorite')}
                                value={this.state.model.is_farvorite} />
                            <Text style={styles.marginLeft}>Image</Text>
                            <TextInput
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'image')}
                                value={this.state.model.image} />
                            <Text style={styles.marginLeft}>Category</Text>
                            <TextInput
                                style={[styles.textInput, styles.marginLeft]}
                                keyboardType={"numeric"}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'category')}
                                value={this.state.model.category} />
                            <Text style={styles.marginLeft}>Note</Text>
                            <TextInput
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'note')}
                            />
                            <Text style={styles.marginLeft}>Num of page read</Text>
                            <TextInput
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                keyboardType={"numeric"}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(parseInt(text), 'num_of_page_read')}
                                value={this.state.model.num_of_page_read}
                            />
                            <Text style={styles.marginLeft}>Total page</Text>
                            <TextInput
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                keyboardType={"numeric"}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(parseInt(text), 'total_page')}
                                value={this.state.model.total_page}
                            />
                            <View style={styles.buttonGroup}>
                                <TouchableHighlight
                                    style={(this.state.model.name === '' || this.state.model.image === '') ? { ...styles.buttonSave, opacity: .8 } : styles.buttonSave}
                                    onPress={() => this.createBook()} disabled={(this.state.model.name === '' || this.state.model.image === '')? true: false}>
                                    <Text style={[styles.text, styles.buttonText]}>Save</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.buttonClose} onPress={() => this.setState({ visible: false })}>
                                    <Text style={[styles.text, styles.buttonText]}>Close</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
    },
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
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    buttonBottom: {
        position: 'absolute',
        bottom: 20,
        right: 35,
        zIndex: 2
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'flex-start',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 3.5,
        elevation: 5,
        width: width,
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#f2400f',
        width: 60
    },
    buttonClose: {
        borderRadius: 30,
        backgroundColor: '#124dcc',
        width: 60
    },
    buttonText: {
        color: '#c4c0c0',
        fontSize: 15,
        textAlign: 'center'
    },
    textInput: {
        borderBottomWidth: 2,
        borderBottomColor: 'red',
        width: width - 15
    },
    marginLeft: {
        marginLeft: 10
    },
    buttonGroup: {
        flexDirection: 'row',
        width: width,
        marginVertical: 10
    },
    buttonSave: {
        width: 50,
        marginLeft: 10,
        backgroundColor: '#f2400f'
    },
    buttonClose: {
        width: 50,
        marginLeft: 10
    },
    buttonText: {
        textAlign: 'center'
    }
});

export default Book;