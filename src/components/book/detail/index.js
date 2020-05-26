import * as React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, TextInput, TouchableHighlight, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetailBook({ route }) {
    const { data } = route.params;
    const { book, handleChangeFarvorite, createCommentNote } = data;
    const [state, setState] = React.useState(book.is_farvorite);
    const [visible, setVisible] = React.useState(false);
    const [comment, setComment] = React.useState('');
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image resizeMode="contain" source={{ uri: book.image }} style={styles.image} />
                </View>
                <View style={styles.label}>
                    {
                        state ? <TouchableOpacity style={[styles.button]} onPress={() => {
                            setState(false)
                            handleChangeFarvorite(book.id, false)
                        }}>
                            <View >
                                <FontAwesome style={{ textAlign: 'left' }} name='heart' size={15} color='rgb(214, 49, 19)' />
                            </View>
                        </TouchableOpacity> :
                            <TouchableOpacity style={[styles.button]} onPress={() => {
                                setState(true)
                                handleChangeFarvorite(book.id, true)
                            }}>
                                <View >
                                    <FontAwesome style={{ textAlign: 'left' }} name='heart' size={15} color='rgb(168, 165, 165)' />
                                </View>
                            </TouchableOpacity>

                    }
                    <Text style={[styles.text, styles.labelItem, { textAlign: 'right' }]}>{book.num_of_page_read}/{book.total_page}</Text>
                    <View style={styles.labelItemRight}>
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>
                                <FontAwesome name="comment" size={15} color="#fff"/>
                             </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.commentContainer}>
                    {
                        book.note.map((note, id) => <View key={id} style={styles.commentContent}>
                            <Text style={styles.text}>{note}</Text>
                        </View>)
                    }
                </View>
            </View>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {}}
            >
                <View style={styles.centerView}>
                    <View style={styles.modalView}>
                        <TextInput 
                        selectTextOnFocus={true} 
                        autoFocus={true}
                        multiline={true}
                        style={styles.textInput} 
                        onChangeText={comment => setComment(comment)}
                        value={comment}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableHighlight style={comment !== '' ? styles.buttonModal: {...styles.buttonModal, opacity: .8}} onPress={() => {
                                createCommentNote(book.id, book.note, comment);
                                book.note = [...book.note, comment];
                                setVisible(false);
                            }} disabled={comment === '' ? true: false}>
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={[styles.buttonClose , { marginLeft: 5 }]} onPress={() => setVisible(false)}>
                                <Text style={styles.buttonText}>Close</Text>
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
        marginLeft: 30,
        marginTop: 10,
        width: width - 60,
        height: 'auto'
    },
    image: {
        width: '100%',
        height: 250
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
        marginVertical: 5
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    button: {
        alignItems: 'center'
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
        height: 50,
        width: width - 10,
        borderColor: 'rgb(199, 121, 105)'
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
    }
})