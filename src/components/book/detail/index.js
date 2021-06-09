import * as React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import Animated from 'react-native-reanimated';
import Cover from './cover';
import Content from './content';
import { ModalStyles, placeHolderTextColor } from '../../../common/styles/modal.style';

const { width, height } = Dimensions.get('window');

export default function DetailBook({ route, navigation, context }) {
    const { book } = route.params.data;
    const [state, setState] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [modal, setModal] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [bookInfo, setBookInfo] = React.useState({});
    const [update, setUpdate] = React.useState(false);
    const scrollY = new Animated.Value(0);
    const onScroll = Animated.event([{
        nativeEvent: {
            contentOffset: {
                y: scrollY
            }
        }
    }])
    const firebaseRef = Firebase.firestore().collection(DB.book);

    React.useEffect(() => {
        firebaseRef.doc(book.id).get()
            .then(result => {
                if (result.exists) {
                    setState(result.data().is_farvorite)
                    setBookInfo({
                        id: result.id,
                        ...result.data()
                    });
                    setUpdate(false)
                }
            })
    }, [update === true])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => {

                if (state) {
                    return (<TouchableOpacity style={[styles.button, {marginLeft: 5}]} onPress={() => {
                        setState(false);
                        handleChangeFarvorite(bookInfo.id, false)
                    }}>
                        <FontAwesome style={{ textAlign: 'left' }} name='heart' size={15} color='rgb(214, 49, 19)' />
                    </TouchableOpacity>)
                } else {
                    return (
                        <TouchableOpacity style={[styles.button ,{marginLeft: 5}]} onPress={() => {
                            setState(true)
                            handleChangeFarvorite(bookInfo.id, true)
                        }}>
                            <FontAwesome style={{ textAlign: 'left' }} name='heart' size={15} color='rgb(168, 165, 165)' />
                        </TouchableOpacity>
                    )
                }
            },
            headerTitle: () => (
                <TouchableOpacity style={[styles.labelItem]} onPress={() => setModal(true)}>
                    <Text style={[styles.text, { textAlign: 'right' }]}>{bookInfo.num_of_page_read}/{bookInfo.total_page}</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={{marginRight: 5}} onPress={() => setVisible(true)}>
                    <Text style={[styles.text, { textAlign: 'right' }]}>
                        <FontAwesome name="comment" size={15} color="#fff" />
                    </Text>
                </TouchableOpacity>
            )
        })
    }, [navigation, bookInfo])

    function createCommentNote(docId, comments, comment) {
        firebaseRef.doc(docId).update({
            note: [...comments, comment]
        }).then(setUpdate(true))
            .catch(err => console.log(err))
    }

    const updatePageRead = (docId, page) => {
        firebaseRef.doc(docId).update({
            num_of_page_read: page
        }).then(setUpdate(true))
            .catch(err => console.log(err))
    }

    function handleChangeFarvorite(docId, state) {
        firebaseRef.doc(docId).update({
            is_farvorite: state
        }).then(setUpdate(true))
            .catch(err => console.log(err))
    }

    const onSwipe = item => {
        const note = [...bookInfo.note];
        note.splice(note.indexOf(item), 1);
        console.log(note);
        setBookInfo({...bookInfo, note})
    }

    const item = {
        cover: {
            uri: bookInfo?.image
        },
        items: bookInfo?.note
    }

    const y = new Animated.Value(0);

    return (
        <View style={{flex: 1 }}>
            {
                Object.keys(bookInfo).length > 0 && <View style={styles.container}>
                    <Cover {...{ y, item }} />
                    <Content  {...{ y, item }} onSwipe={onSwipe}/>
                </View>
            }
            <Modal
                isVisible={visible}
                onBackButtonPress={() => {
                    setVisible(false);
                    navigation.goBack();
                }}
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setVisible(false)}
            >
                <View style={ModalStyles.mainView}>
                    <View style={ModalStyles.contentView}>
                        <TextInput
                            selectTextOnFocus={true}
                            placeholder='Comment'
                            placeholderTextColor={placeHolderTextColor}
                            multiline={true}
                            style={[ModalStyles.input, {height: 100, textAlignVertical: 'top'}]}
                            onChangeText={comment => setComment(comment)}
                            value={comment}
                            numberOfLines={3}
                        />
                        <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                            <TouchableHighlight style={ModalStyles.button} onPress={() => {
                                createCommentNote(bookInfo.id, bookInfo.note, comment);
                                bookInfo.note = [...bookInfo.note, comment];
                                setVisible(false);
                            }}>
                                <Text style={ModalStyles.textButton}>Create</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={modal}
                onBackButtonPress={() => {
                    setModal(false);
                    navigation.goBack();
                }}
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setModal(false)}
            >
                <View style={ModalStyles.mainView}>
                    <View style={ModalStyles.contentView}>
                        <TextInput
                            selectTextOnFocus={true}
                            placeholder='Number of pages read'
                            placeholderTextColor={placeHolderTextColor}
                            keyboardType={'numeric'}
                            multiline={true}
                            style={ModalStyles.input}
                            onChangeText={page => setPage(parseInt(page))}
                        />
                        <TouchableHighlight style={ModalStyles.button} onPress={() => {
                            updatePageRead(book.id, page);
                            setModal(false);
                        }}>
                            <Text style={ModalStyles.textButton}>Update</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    header: {
        flex: 1
    },
    image: {
        width: width,
        height: 300,
        resizeMode: "contain"
    },
    label: {
        flexDirection: 'row',
        width: width - 20,
        marginLeft: 10,
        height: 'auto',
        marginTop: 15
    },
    labelItem: {
    },
    labelItemRight: {
    },
    commentContainer: {
        flexDirection: 'column',
        width: width,
        height: 'auto',
        marginVertical: 10
    },
    commentContent: {
        width: width,
        height: 'auto',
        borderRadius: 10,
        backgroundColor: '#4d58b8',
        marginVertical: 5,
        padding: 5
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    button: {
        alignItems: 'center'
    },
    swipeView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15,
    },
    modalView: {
        backgroundColor: '#bcbdc2',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 3.5,
        elevation: 5,
        width: Dimensions.get('window').width
    },
    textInput: {
        height: 30,
        width: width - 10,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingLeft: 15
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#fff',
        width: 100
    },
    buttonClose: {
        borderRadius: 30,
        backgroundColor: '#124dcc',
        width: 60
    },
    buttonText: {
        color: '#000',
        fontSize: 15,
        textAlign: 'center'
    }
})