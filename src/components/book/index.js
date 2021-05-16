import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, CheckBox, Dimensions, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import { FontAwesome, Entypo as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants';

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

        this.firebaseRef = Firebase.firestore().collection(DB.book);
    }

    copyDocument() {
        this.firebaseRef.get()
            .then(result => result.docs.forEach(doc => {
                firebase.firestore().collection(DB.book).add(doc.data())
            }))
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

    handleViewDetail(router, options) {
        this.props.navigation.navigate(router, { data: options });
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

    back() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.getBooks();
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => this.setState({visible: true, model: {
                    name: '',
                    image: '',
                    category: 0,
                    is_farvorite: false,
                    note: [],
                    num_of_page_read: 0,
                    total_page: 0
                }})}>
                    <Text style={{ fontSize: 12, color: '#fff' }}>THÊM SÁCH</Text>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => this.back()}>
                    <Icon name='chevron-left' size={25} color='#fff'/>
                </TouchableOpacity>
            )
        })
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

    // <TouchableOpacity style={[styles.buttonBottom]} onPress={() => this.setState({
    //     visible: true, model: {
    //         name: '',
    //         image: '',
    //         category: 0,
    //         is_farvorite: false,
    //         note: [],
    //         num_of_page_read: 0,
    //         total_page: 0
    //     }
    // })}>
    //     <FontAwesome name='plus-circle' size={25} color='#cc3112' />
    // </TouchableOpacity>

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        {
                            this.state.books.length > 0 ? this.state.books.map((book, id) => <View style={[styles.bookContainer, { position: 'relative' }]} key={id} >
                                <View style={styles.label}>
                                    <Text style={styles.labelText}>{book.num_of_page_read}/{book.total_page}</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.handleViewDetail('Detail Book', {
                                    book: book
                                })}>
                                    <Image source={{ uri: book.image }} style={[styles.image, { opacity: .5 }]} />
                                </TouchableOpacity>
                            </View>) : null
                        }
                    </View>
                </View>
                <Modal
                    isVisible={this.state.visible}
                    onSwipeComplete={() => this.setState({ visible: false })}
                    swipeDirection={['up', 'left', 'right', 'down']}
                    onBackdropPress={() => this.setState({ visible: false })}
                    onBackButtonPress={() => {
                        this.setState({ visible: false });
                        this.props.navigation.goBack();
                    }}
                >
                    <View style={styles.swipeView}>
                        <View style={styles.modalView}>
                            <TextInput
                                placeholder='Name'
                                placeholderTextColor='black'
                                style={[styles.textInput, styles.marginLeft, { marginTop: 5 }]}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'name')}
                                value={this.state.model.name} />
                            <TextInput
                                placeholder='Image'
                                placeholderTextColor='black'
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'image')}
                                value={this.state.model.image} />
                            <TextInput
                                placeholder='Category'
                                placeholderTextColor='black'
                                style={[styles.textInput, styles.marginLeft]}
                                keyboardType={"numeric"}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(parseInt(text), 'category')}
                            />
                            <TextInput
                                placeholder='Note'
                                placeholderTextColor='black'
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(text, 'note')}
                            />
                            <TextInput
                                placeholder='Num of page read'
                                placeholderTextColor='black'
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                keyboardType={"numeric"}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(parseInt(text), 'num_of_page_read')}
                            />
                            <TextInput
                                placeholder='Total page'
                                placeholderTextColor='black'
                                style={[styles.textInput, styles.marginLeft]}
                                selectTextOnFocus={true}
                                keyboardType={"numeric"}
                                multiline={true}
                                onChangeText={text => this.handleChangeText(parseInt(text), 'total_page')}
                            />
                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <Text style={styles.marginLeft}>Farvorite</Text>
                                <CheckBox
                                    style={{ marginLeft: 5 }}
                                    onValueChange={value => this.handleChangeText(value, 'is_farvorite')}
                                    value={this.state.model.is_farvorite} />
                            </View>
                            <View style={styles.buttonGroup}>
                                <TouchableHighlight
                                    style={(this.state.model.name === '' || this.state.model.image === '') ? { ...styles.buttonSave, opacity: .8 } : styles.buttonSave}
                                    onPress={() => this.createBook()} disabled={(this.state.model.name === '' || this.state.model.image === '') ? true : false}>
                                    <Text style={[styles.buttonText, {fontSize: 16, fontWeight: 'bold'}]}>SAVE</Text>
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
    swipeView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15,
    },
    modalView: {
        backgroundColor: '#d7d8de',
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
    buttonText: {
        color: '#c4c0c0',
        fontSize: 15,
        textAlign: 'center'
    },
    textInput: {
        // borderWidth: 2,
        // borderColor: '#323330',
        width: width - 15,
        padding: 3,
        marginVertical: 5,
        borderRadius: 25,
        backgroundColor: '#fff',
        paddingLeft: 10
    },
    marginLeft: {
        marginLeft: 10
    },
    buttonGroup: {
        flexDirection: 'row',
        width: width,
        marginVertical: 10,
        justifyContent: 'center'
    },
    buttonSave: {
        width: 150,
        height: 40,
        marginLeft: 10,
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 50,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    buttonClose: {
        width: 50,
        position: 'absolute',
        top: 10,
        left: '50%'
    },
    buttonText: {
        textAlign: 'center'
    },
    button: {
        padding: 3,
        backgroundColor: 'rgba(92, 110, 191, .5)',
        borderRadius: 3,
        marginHorizontal: 3
    }
});

export default Book;