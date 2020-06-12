import * as React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput } from 'react-native';
import Constants from 'expo-constants';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import { FontAwesome, Ionicons as Icon } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

import Cover from '../../common/cover';
import Content from './content';

const Item = ({ id, title }) => (
    <View key={id} style={styles.item}>
        <Text style={styles.text}>{title}</Text>
    </View>
)

const Day = ({ route, navigation }) => {
    const { params } = route;
    const firebaseRef = Firebase.firestore().collection(DB.diary).doc(params.year).collection(params.collectionId).doc(params.id);
    const [item, setItem] = React.useState({});
    const [style, setStyle] = React.useState({});
    const [visible, setVisible] = React.useState(false);
    const [text, setText] = React.useState('');
    const [update, setUpdate] = React.useState(false);

    React.useEffect(() => {
        firebaseRef
            .get()
            .then(result => {
                if (result.exists) {
                    setItem(result.data());
                    setStyle({
                        header: params.id.slice(params.id.indexOf('-') + 1, params.id.length) + ' ' + params.id.slice(0, params.id.indexOf('-')) + ',' + params.name + '/' + params.year,
                        cover: result.data().url !== '' ? { uri: result.data().url } : require('../../../assets/default-image.jpg'),
                        items: result.data().diaries
                    })
                    setUpdate(false);
                }
            })
    }, [params, update === true]);

    const updateDoc = (diaries) => {
        firebaseRef.update({
            diaries: [...diaries, text]
        })
            .then(res => {
                setVisible(false);
                setUpdate(true);
            })
            .catch(err => console.log(err))
    }

    const animatedValue = new Animated.Value(0);

    return (
        <View style={styles.main}>
            {
                Object.keys(style).length > 0 && <View style={styles.container}>
                    <Cover {...{ animatedValue, style }} />
                    <Content {...{ animatedValue, style }} />
                </View>
            }
            <View style={styles.bottom}>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <FontAwesome name='pencil' size={25} color='#d13430' />
                </TouchableOpacity>
            </View>
            <Modal isVisible={visible}
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setVisible(false)}
                onBackdropPress={() => setVisible(false)}
                onBackButtonPress={() => navigation.goBack()}
            >
                <View style={styles.swipeView}>
                    <View style={styles.modalView}>

                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                multiline={true}
                                autoFocus={true}
                                placeholder='type here'
                                selectTextOnFocus={true}
                                style={styles.textInput}
                                onChangeText={text => setText(text)} />

                            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>

                                <TouchableOpacity disabled={text !== '' ? false : true}
                                    style={text !== '' ? styles.buttonModal : styles.buttonOpacity}
                                    onPress={() => updateDoc(item?.diaries)}>
                                    <Icon name='md-send' size={25} />
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        alignItems: 'center',
        flex: 1
    },
    image: {
        width: width - 30,
        height: 300
    },
    content: {
        flex: 1,
        flexDirection: 'column'
    },
    item: {
        //backgroundColor: '#f9c2ff',
        backgroundColor: '#2d4269',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
    },
    bottom: {
        position: 'absolute',
        bottom: 30,
        right: 25
    },
    swipeView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15,
    },
    modalView: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 3.5,
        elevation: 5,
        width: width,
        paddingHorizontal: 8
    },
    buttonModal: {
        width: 50,
        borderRadius: 30,
        alignItems: 'center',
        height: 25,
    },
    buttonOpacity: {
        borderRadius: 30,
        width: 50,
        opacity: .6,
        alignItems: 'center',
        height: 25,
    },
    buttonClose: {
        width: 80,
        marginHorizontal: 5,
        alignItems: 'center',
        height: 25,
    },
    textInput: {
        width: width - 50,
        height: 50,
        borderBottomColor: '#bd4a20',
        borderBottomWidth: 1,
        marginVertical: 8
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
})

export default Day;