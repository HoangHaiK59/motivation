import * as React from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, SafeAreaView, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import Constants from 'expo-constants';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Entypo as Icon } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { ModalStyles, placeHolderTextColor } from '../../../common/styles/modal.style';
import Text from '../../text/regular';
import TextBold from '../../text/bold';

const { width } = Dimensions.get('window');

const Mapday = (day) => {
    const arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const valueId = moment(day, 'DD/MM/YYYY').toDate().getDay() - 1;
    console.log(valueId);
    return arr.find((val, id) => id === valueId)
}

const WIDTH = width * 0.9;
const RATIO = 100 / 362;
const HEIGHT = WIDTH * RATIO;
export const MARGIN = 16;

export const CARD_HEIGHT = HEIGHT + MARGIN * 2;
const { height: wHeight } = Dimensions.get('window');
const height = wHeight - 64;


const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

const Wallet = React.memo(({ y, id, index, year, collectionId, image, title, name, selected, onSelect }) => {
    const position = Animated.subtract(index * CARD_HEIGHT, y);
    const isDisappearing = -CARD_HEIGHT;
    const isTop = 0;
    const isBottom = height - CARD_HEIGHT;
    const isAppearing = height;

    const translateY = Animated.add(Animated.add(y,
        y.interpolate({
            inputRange: [0, 0.00001 + index * CARD_HEIGHT],
            outputRange: [0, - index * CARD_HEIGHT],
            extrapolateRight: 'clamp',
        })
    ),
        position.interpolate({
            inputRange: [isBottom, isAppearing],
            outputRange: [0, -CARD_HEIGHT / 4],
            extrapolate: 'clamp',
        })
    )

    const scale = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [0.5, 1, 1, 0.5],
        extrapolate: 'clamp',
    });
    const opacity = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [0.5, 1, 1, 0.5],
    });

    return (
        <Animated.View
            style={[styles.cardWall, { opacity, transform: [{ translateY }, { scale }] }]}
            key={index}
        >
            <Item
                id={id}
                collectionId={collectionId}
                year={year}
                image={image}
                title={title}
                name={name}
                selected={selected}
                onSelect={onSelect}
            />
        </Animated.View>
    )
})

const Item = ({ id, year, collectionId, image, title, name, selected, onSelect }) => {
    return <TouchableOpacity
        onPress={() => onSelect(id, year, collectionId, name)}
        style={[
            styles.item, {
                backgroundColor: selected ? '#2d4269' : '#132426'
            }
        ]}>
        <View style={styles.itemLeft}>
            <View style={styles.textInLeft}>
                <TextBold style={[styles.text, { fontWeight: 'bold' }]}>{id.slice(0, id.indexOf('-'))}</TextBold>
                <TextBold style={[styles.text, { fontWeight: 'bold' }]}>{id.slice(id.indexOf('-') + 1, id.length)}</TextBold>
            </View>
        </View>
        <View style={styles.itemRight}>
            {
                image !== '' ? <Image source={{ uri: image }} style={styles.image} /> :
                    <View style={{ width: width - 70, height: 'auto' }}>
                        <TextBold style={[styles.textStyle, { fontWeight: 'bold' }]}>&#8221;</TextBold>
                        <Text style={[styles.textStyle, { alignSelf: 'center' }]}>{title}</Text>
                        <TextBold style={[styles.textStyle, { alignSelf: 'flex-end', fontWeight: 'bold' }]}>&#8221;</TextBold>
                    </View>
            }
        </View>
    </TouchableOpacity>
}

export default function Month({ route, navigation }) {
    const [loaded] = useFonts({ Lato: require('../../../../assets/fonts/Lato-Regular.ttf') })
    const [file, setFile] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [selected, setSelected] = React.useState(new Map());
    const [date, setDate] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [extra, setExtra] = React.useState('');
    const [diary, setDiary] = React.useState('');
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [isCamera, setIsCamera] = React.useState(false);
    const y = new Animated.Value(0);
    const storageRef = Firebase.storage().ref();
    const { params } = route;

    const onSelect = React.useCallback((id, year, collectionId, name) => {
        const newSelected = new Map(selected);
        newSelected.set(id, !selected.get(id));

        setSelected(newSelected);
        navigation.navigate('Day', { id, year, collectionId, name })
    }, [selected]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeftContainerStyle: {
                paddingLeft: 8
            },
            headerRightContainerStyle: {
                paddingRight: 8
            },
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => {
                    setVisible(true);
                    setFile(null);
                }}>
                    <View>
                        <FontAwesome name='plus-circle' color="#fff" size={25} />
                    </View>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='chevron-left' size={25} color='#fff' />
                </TouchableOpacity>
            )
        })
    })

    React.useEffect(() => {
        Firebase.firestore().collection(`${DB.diary}/${params.year}/${params.id}`)
            .get()
            .then(result => {
                if (result.docs.length > 0) {
                    let items = [];
                    result.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
                    setItems(items);
                    setLoading(false);
                }
            })
    }, [loading === true])


    const upload = async (date, file) => {
        let response, blob;
        if (Object.keys(file).length > 0) {
            response = await fetch(file.uri);
            blob = await response.blob();
        }
        let is_input_date = date === '' ? false : true;
        let dateInp = '';
        if (is_input_date) {
            dateInp = moment(date, 'DD/MM/YYYY').toDate().getDate().toString();
        }
        if (Object.keys(file).length > 0) {
            storageRef
                .child(`Diary/${params.year}/${params.id}` + `/${file.name}`)
                .put(blob)
                .then(snapShot => {
                    storageRef
                        .child(snapShot.metadata.fullPath)
                        .getDownloadURL()
                        .then(url => {

                            // avoid intalics
                            Firebase.firestore().collection(DB.diary).doc(params.year).set({});

                            Firebase.firestore().collection(DB.diary).doc(params.year).collection(params.id).doc(is_input_date ? dateInp + '-' + Mapday(date) :
                                new Date().getDate() + '-' + Mapday(new Date()))
                                .set({
                                    title: title,
                                    extra: extra,
                                    diaries: [diary],
                                    url
                                })
                                .then(refer => {
                                    //console.log(refer.id);
                                    setVisible(false);
                                    setLoading(true);
                                })
                                .catch(error => console.log(error))
                        })

                },
                    reject => {
                        console.log(reject.message);
                    })
        } else {
            Firebase.firestore().collection(DB.diary).doc(params.year).set({})

            Firebase.firestore().collection(DB.diary).doc(params.year).collection(params.id).doc(is_input_date ? dateInp + '-' + Mapday(date) :
                new Date().getDate() + '-' + Mapday(new Date()))
                .set({
                    title: title,
                    extra: extra,
                    diaries: [diary],
                    url: ''
                })
                .then(refer => {
                    //console.log(refer.id);
                    setVisible(false);
                    setLoading(true);
                })
                .catch(error => console.log(error))
        }
    }

    const pickImage = async () => {
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
                setIsCamera(false)
                setFile({ uri: result.uri, name: fileName, type, width: result.width, height: result.height })
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    const cameraShot = async () => {
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
                setIsCamera(true)
                setFile({ uri: result.uri, name: fileName, type, width: result.width, height: result.height })
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    //     <View style={styles.bottom}>
    //     <TouchableOpacity onPress={() => { setVisible(true); setFile({}) }}>
    //         <FontAwesome name='plus-circle' size={30} color='#ed881c' />
    //     </TouchableOpacity>
    // </View>
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
        useNativeDriver: true,
    });
    if (!loaded) {
        return null
    }
    return (
        <View style={styles.main}>
            <SafeAreaView style={styles.container}>
                <AnimatedFlatlist
                    data={items}
                    {...{ onScroll }}
                    bounces={false}
                    renderItem={({ index, item }) => (<Wallet
                        y={y}
                        index={index}
                        id={item.id}
                        collectionId={params.id}
                        year={params.year}
                        image={item.url}
                        title={item.title}
                        name={params.name}
                        selected={!!selected.get(item.id)}
                        onSelect={onSelect}
                    />)}
                >

                </AnimatedFlatlist>
            </SafeAreaView>

            <Modal
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setVisible(false)}
                onBackButtonPress={() => {
                    setVisible(false);
                    navigation.goBack()
                }}
                // onBackdropPress={() => setVisible(false)}
                isVisible={visible}
            >
                <View style={ModalStyles.mainView}>
                    <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"}>
                        <View style={ModalStyles.contentView}>
                            <View style={ModalStyles.titleModal}>
                                <Text style={ModalStyles.titleText}>Create Diary</Text>
                            </View>
                            <Text style={ModalStyles.textLabel}>Date</Text>
                            <TextInput placeholderTextColor={placeHolderTextColor} placeholder='DD/MM/YYYY' style={ModalStyles.input} onChangeText={date => setDate(date)} selectTextOnFocus={true} multiline={true} />
                            <Text style={ModalStyles.textLabel}>Name</Text>
                            <TextInput placeholder='Title...' placeholderTextColor={placeHolderTextColor} style={ModalStyles.input} onChangeText={title => setTitle(title)} selectTextOnFocus={true} multiline={true} />
                            <Text style={ModalStyles.textLabel}>Description</Text>
                            <TextInput placeholder='Extra...' placeholderTextColor={placeHolderTextColor} style={ModalStyles.input} onChangeText={extra => setExtra(extra)} selectTextOnFocus={true} multiline={true} />
                            <Text style={ModalStyles.textLabel}>Content</Text>
                            <TextInput placeholder='Diary...' placeholderTextColor={placeHolderTextColor} style={ModalStyles.textArea} onChangeText={diary => setDiary(diary)} selectTextOnFocus={true} multiline={true} numberOfLines={6} />
                            <View style={ModalStyles.boxUploadContainer}>
                                <View style={ModalStyles.boxUploadItem}>
                                    <View style={ModalStyles.itemColumn}>
                                        {
                                            file === null ? <TouchableOpacity onPress={() => pickImage()}>
                                                <FontAwesome name="image" size={25} color='#bd4a20' />
                                            </TouchableOpacity> : !isCamera && <View style={{ width: '100%', height: '100%' }}>
                                                <Image source={{ uri: file.uri }} style={{ width: '100%', height: 50 }} />
                                            </View>
                                        }
                                    </View>
                                    <View style={ModalStyles.itemColumn}>
                                        {
                                            file === null ? <TouchableOpacity onPress={() => cameraShot()}>
                                                <FontAwesome name="camera" size={25} color='#bd4a20' />
                                            </TouchableOpacity> : isCamera && <View style={{ width: '100%', height: '100%' }}>
                                                <Image source={{ uri: file.uri }} width="100%" height={50} />
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={ModalStyles.button}
                                onPress={() => upload(date, file)}>
                                <Text style={ModalStyles.textButton}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
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
        flex: 1
    },
    bottom: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 5,
        //marginVertical: 8,
        marginHorizontal: 8,
        flexDirection: 'row'
    },
    itemLeft: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    image: {
        width: width - 65,
        height: 150
    },
    textInLeft: {
        alignItems: 'center',
    },
    itemRight: {
        justifyContent: 'center',
        height: 150
    },
    textStyle: {
        color: '#c4c0c0',
        fontSize: 17
    },
    text: {
        color: '#fff',
        fontSize: 14
    },
    textForm: {
        fontSize: 15,
        color: '#726f75',
        fontWeight: '600'
    },
    centerView: {
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
        backgroundColor: '#631ac9',
        width: width - 60,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonClose: {
        width: 60
    },
    input: {
        shadowOffset: {
            width: 1,
            headerRight: 2
        },
        shadowRadius: 2,
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderColor: '#edebec',
        backgroundColor: '#edebec',
        width: width - 60,
        marginVertical: 10
    },
    textArea: {
        width: width - 60,
        height: 120,
        marginVertical: 10,
        shadowOffset: {
            width: 1,
            headerRight: 2
        },
        shadowRadius: 2,
        borderRadius: 5,
        borderWidth: 1,
        padding: 6,
        borderColor: '#edebec',
        backgroundColor: '#edebec',
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
    cardTemplate: {
        width: WIDTH,
        height: HEIGHT
    },
    cardWall: {
        marginVertical: MARGIN,
        alignSelf: 'center'
    },
    split: {
        // borderStyle: 'dashed', borderColor: 'red', borderWidth: 1,
        width: (width - 60) / 2, display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: 50
    }
})