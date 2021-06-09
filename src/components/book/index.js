import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, CheckBox, Dimensions, TouchableHighlight, Platform, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import { FontAwesome, Entypo as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { ModalStyles, placeHolderTextColor } from '../../common/styles/modal.style';

const { width, height } = Dimensions.get('window');

class Book extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            visible: false,
            file: null,
            isCamera: false,
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
        this.storageRef = Firebase.storage().ref()
    }

    copyDocument() {
        this.firebaseRef.get()
            .then(result => result.docs.forEach(doc => {
                firebase.firestore().collection(DB.book).add(doc.data())
            }))
    }

    async loadFonts() {
        await Font.loadAsync({
            Lato: require('../../../assets/fonts/Lato-Regular.ttf')
        })
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

    async createBook(file) {
        if (file) {
            let response, blob;
            if (Object.keys(file).length > 0) {
                response = await fetch(file.uri);
                blob = await response.blob();
            }
            const unix = moment(new Date()).unix()
            this.storageRef.child(`Book/${unix + file.name}`)
            .put(blob)
            .then(snapshot => {
                this.storageRef.child(snapshot.metadata.fullPath)
                .getDownloadURL()
                .then(url => {
                    if (this.state.model.name !== '') {
                        this.setState({ visible: false })
                        this.firebaseRef.add({...this.state.model, image: url})
                            .then(ref => {
                                this.getBooks();
                            })
                            .catch(err => console.log(err))
                    }
                })
            })
        }
    }

    back() {
        this.props.navigation.goBack();
    }

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [2, 3],
                quality: 1
            });

            console.log(result);

            if (!result.cancelled) {
                let fileName = result.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(fileName);
                let type = match ? `image/${match[1]}` : `image`;
                const file = { uri: result.uri, name: fileName, type, width: result.width, height: result.height };
                this.setState({ file, isCamera: false })
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    cameraShot = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [2, 3],
                quality: 1
            });

            if (!result.cancelled) {
                let fileName = result.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(fileName);
                let type = match ? `image/${match[1]}` : `image`;
                const file = { uri: result.uri, name: fileName, type, width: result.width, height: result.height };
                this.setState({ file, isCamera: true })
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    componentDidMount() {
        this.loadFonts();
        this.getBooks();
        this.props.navigation.setOptions({
            headerLeftContainerStyle: {
                paddingLeft: 8
            },
            headerRightContainerStyle: {
                paddingRight: 8
            },
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => this.setState({
                    visible: true, model: {
                        name: '',
                        image: '',
                        category: 0,
                        is_farvorite: false,
                        note: [],
                        num_of_page_read: 0,
                        total_page: 0
                    }
                })}>
                    <View>
                        <FontAwesome name='plus-circle' color="#fff" size={25} />
                    </View>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => this.back()}>
                    <Icon name='chevron-left' size={25} color={this.props.context.theme.colors.text} />
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
                                    <Text style={[styles.labelText, { color: this.props.context.theme.colors.text }]}>{book.num_of_page_read}/{book.total_page}</Text>
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
                    onBackButtonPress={() => {
                        this.setState({ visible: false });
                        this.props.navigation.goBack();
                    }}
                >
                    <View style={ModalStyles.mainView}>
                        <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"}>
                            <View style={ModalStyles.contentView}>
                                <View style={ModalStyles.titleModal}>
                                    <Text style={ModalStyles.titleText}>Add Book</Text>
                                </View>
                                <TextInput
                                    placeholder='Name'
                                    placeholderTextColor={placeHolderTextColor}
                                    style={[ModalStyles.input]}
                                    selectTextOnFocus={true}
                                    multiline={true}
                                    onChangeText={text => this.handleChangeText(text, 'name')}
                                    value={this.state.model.name} />
                                <TextInput
                                    placeholder='Image'
                                    placeholderTextColor={placeHolderTextColor}
                                    style={[ModalStyles.input]}
                                    selectTextOnFocus={true}
                                    multiline={true}
                                    onChangeText={text => this.handleChangeText(text, 'image')}
                                    value={this.state.model.image} />
                                <TextInput
                                    placeholder='Category'
                                    placeholderTextColor={placeHolderTextColor}
                                    style={[ModalStyles.input]}
                                    keyboardType={"numeric"}
                                    selectTextOnFocus={true}
                                    multiline={true}
                                    onChangeText={text => this.handleChangeText(parseInt(text), 'category')}
                                />
                                <TextInput
                                    placeholder='Note'
                                    placeholderTextColor={placeHolderTextColor}
                                    style={ModalStyles.textArea}
                                    selectTextOnFocus={true}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={text => this.handleChangeText(text, 'note')}
                                />
                                <TextInput
                                    placeholder='Num of page read'
                                    placeholderTextColor={placeHolderTextColor}
                                    style={[ModalStyles.input]}
                                    selectTextOnFocus={true}
                                    keyboardType={"numeric"}
                                    multiline={true}
                                    onChangeText={text => this.handleChangeText(parseInt(text), 'num_of_page_read')}
                                />
                                <TextInput
                                    placeholder='Total page'
                                    placeholderTextColor={placeHolderTextColor}
                                    style={[ModalStyles.input]}
                                    selectTextOnFocus={true}
                                    keyboardType={"numeric"}
                                    multiline={true}
                                    onChangeText={text => this.handleChangeText(parseInt(text), 'total_page')}
                                />
                                <View style={ModalStyles.boxUploadContainer}>
                                    <View style={ModalStyles.boxUploadItem}>
                                        <View style={ModalStyles.itemColumn}>
                                            {
                                                this.state.file === null ? <TouchableOpacity onPress={() => this.pickImage()}>
                                                    <FontAwesome name="image" size={25} color='#bd4a20' />
                                                </TouchableOpacity> : !this.state.isCamera && <View style={{ width: '100%', height: '100%' }}>
                                                    <Image source={{ uri: this.state.file.uri }} width="100%" height={50} />
                                                </View>
                                            }
                                        </View>
                                        <View style={ModalStyles.itemColumn}>
                                            {
                                                this.state.file === null ? <TouchableOpacity onPress={() => this.cameraShot()}>
                                                    <FontAwesome name="camera" size={25} color='#bd4a20' />
                                                </TouchableOpacity> : this.state.isCamera && <View style={{ width: '100%', height: '100%' }}>
                                                    <Image source={{ uri: this.state.file.uri }} width="100%" height={50} />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={ModalStyles.checkbox}>
                                    <Text style={ModalStyles.textLabel}>Farvorite</Text>
                                    <CheckBox
                                        style={{ marginTop: -5 }}
                                        onValueChange={value => this.handleChangeText(value, 'is_farvorite')}
                                        value={this.state.model.is_farvorite} />
                                </View>
                                <TouchableHighlight
                                    style={ModalStyles.button}
                                    onPress={() => this.createBook(this.state.file)}>
                                    <Text style={ModalStyles.textButton}>SAVE</Text>
                                </TouchableHighlight>
                            </View>
                        </KeyboardAvoidingView>
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
        fontSize: 10,
        zIndex: 1
    },
    text: {
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
        width: width - 20
    },
    modalView: {
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 30,
        elevation: 5,
        paddingHorizontal: 30,
        paddingBottom: 10,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 20,
        marginLeft: -20,
        marginBottom: -20
    },
    titleModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginBottom: 10
    },
    buttonModal: {
        borderRadius: 5,
        backgroundColor: '#994ce6',
        width: width - 60,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center'
    },
    textInput: {
        // borderWidth: 2,
        // borderColor: '#323330',
        shadowOffset: {
            width: 1,
            headerRight: 2
        },
        shadowRadius: 2,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: '#edebec',
        backgroundColor: '#edebec',
        width: width - 60,
        marginVertical: 10
    },
    textForm: {
        fontSize: 16,
        color: '#726f75',
        fontWeight: '600'
    },
    marginLeft: {
        marginLeft: 10
    },
    buttonGroup: {
        flexDirection: 'row',
        width: width - 60,
        marginVertical: 10,
        justifyContent: 'center'
    },
    buttonSave: {
        borderRadius: 5,
        backgroundColor: '#631ac9',
        width: width - 60,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        // backgroundColor: 'rgba(92, 110, 191, .5)',
        borderRadius: 3,
        marginHorizontal: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    split: {
        // borderStyle: 'dashed', borderColor: 'red', borderWidth: 1,
        width: (width - 60)/2, display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: 50
    }
});

export default Book;