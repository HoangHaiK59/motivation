import * as React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import Animated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function DetailBook({ route, navigation }) {
    const { book } = route.params.data;
    const [state, setState] = React.useState(book.is_farvorite);
    const [visible, setVisible] = React.useState(false);
    const [modal, setModal] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [bookInfo, setBookInfo] = React.useState({});
    const [update, setUpdate] = React.useState(false);
    const scrollY = new Animated.Value(0);
    const onScroll = Animated.event([ {
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
                    setBookInfo({
                        id: result.id,
                        ...result.data()
                    });
                    setUpdate(false)
                }
            })
    }, [update === true])

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

    const threshold = height - 100 //- Constants.statusBarHeight;

    const backgroundColor = scrollY.interpolate({
        inputRange: [0 , threshold - 10, threshold],
        outputRange: [0 , .3, 1]
    })

    return (
        <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={1}  style={{ marginTop: Constants.statusBarHeight }}>
            {
                Object.keys(bookInfo).length > 0 && <View style={styles.container}>
                    <View style={[styles.header, {backgroundColor}]}>
                        <Image source={{ uri: bookInfo.image }} style={styles.image} />
                    </View>
                    <View style={styles.label}>
                        {
                            state ? <TouchableOpacity style={[styles.button]} onPress={() => {
                                setState(false)
                                handleChangeFarvorite(bookInfo.id, false)
                            }}>
                                <View >
                                    <FontAwesome style={{ textAlign: 'left' }} name='heart' size={15} color='rgb(214, 49, 19)' />
                                </View>
                            </TouchableOpacity> :
                                <TouchableOpacity style={[styles.button]} onPress={() => {
                                    setState(true)
                                    handleChangeFarvorite(bookInfo.id, true)
                                }}>
                                    <View >
                                        <FontAwesome style={{ textAlign: 'left' }} name='heart' size={15} color='rgb(168, 165, 165)' />
                                    </View>
                                </TouchableOpacity>

                        }
                        <TouchableOpacity style={styles.labelItem} onPress={() => setModal(true)}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>{bookInfo.num_of_page_read}/{bookInfo.total_page}</Text>
                        </TouchableOpacity>
                        <View style={styles.labelItemRight}>
                            <TouchableOpacity onPress={() => setVisible(true)}>
                                <Text style={[styles.text, { textAlign: 'right' }]}>
                                    <FontAwesome name="comment" size={15} color="#fff" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.commentContainer} >
                        {
                            bookInfo.note.map((note, id) => <View key={id} style={styles.commentContent}>
                                <Text style={styles.text}>{note}</Text>
                            </View>)
                        }
                    </View>
                </View>
            }
            <Modal
                isVisible={visible}
                onBackdropPress={() => setVisible(false)}
                onBackButtonPress={() => {
                    setVisible(false);
                    navigation.goBack();
                }}
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setVisible(false)}
            >
                <View style={styles.swipeView}>
                    <View style={styles.modalView}>
                        <TextInput
                            selectTextOnFocus={true}
                            placeholder='Comment'
                            placeholderTextColor='#000'
                            multiline={true}
                            style={[styles.textInput, { marginTop: 10 }]}
                            onChangeText={comment => setComment(comment)}
                            value={comment}
                        />
                        <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                            <TouchableHighlight style={comment !== '' ? styles.buttonModal : { ...styles.buttonModal, opacity: .8 }} onPress={() => {
                                createCommentNote(book.id, book.note, comment);
                                book.note = [...book.note, comment];
                                setVisible(false);
                            }} disabled={comment === '' ? true : false}>
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={modal}
                onBackdropPress={() => setModal(false)}
                onBackButtonPress={() => {
                    setModal(false);
                    navigation.goBack();
                }}
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setModal(false)}
            >
                <View style={styles.swipeView}>
                    <View style={styles.modalView}>
                        <TextInput
                            selectTextOnFocus={true}
                            placeholder='Page'
                            placeholderTextColor='#000'
                            keyboardType={'numeric'}
                            multiline={true}
                            style={[styles.textInput, { marginTop: 10 }]}
                            onChangeText={page => setPage(parseInt(page))}
                        />
                        <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                            <TouchableHighlight style={comment !== '' ? styles.buttonModal : { ...styles.buttonModal, opacity: .8 }} onPress={() => {
                                updatePageRead(book.id, page);
                                setModal(false);
                            }} disabled={page >= bookInfo.total_page  ? true : false}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
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
        width: '50%'
    },
    labelItemRight: {
        width: '45%'
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