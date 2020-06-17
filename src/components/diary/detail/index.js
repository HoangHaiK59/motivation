import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import Constants from 'expo-constants';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Entypo as Icon } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Mapday = (day) => {
    const arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const valueId = moment(day, 'DD/MM/YYYY').toDate().getDay() - 1;
    console.log(valueId);
    return arr.find((val, id) => id === valueId)
}

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
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{id.slice(0, id.indexOf('-'))}</Text>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{id.slice(id.indexOf('-') + 1, id.length)}</Text>
            </View>
        </View>
        <View style={styles.itemRight}>
            {
                image !== '' ? <Image source={{ uri: image }} style={styles.image} /> :
                    <View style={{ width: width - 70, height: 'auto' }}>
                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>&#8221;</Text>
                        <Text style={[styles.textStyle, { alignSelf: 'center' }]}>{title}</Text>
                        <Text style={[styles.textStyle, { alignSelf: 'flex-end', fontWeight: 'bold' }]}>&#8221;</Text>
                    </View>
            }
        </View>
    </TouchableOpacity>
}

export default function Month({ route, navigation }) {
    const [file, setFile] = React.useState({});
    const [visible, setVisible] = React.useState(false);
    const [selected, setSelected] = React.useState(new Map());
    const [date, setDate] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [extra, setExtra] = React.useState('');
    const [diary, setDiary] = React.useState('');
    const [items, setItems] = React.useState([]);
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
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                    <Text style={{ fontSize: 12, color: '#fff' }}>THÊM NHẬT KÝ</Text>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='chevron-left' size={25} color='#fff'/>
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
                }
            })
    }, [])


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
                                })
                                .catch(error => console.log(error))
                        })

                },
                    reject => {
                        console.log(reject.message);
                    })
        } else {
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

    return (
        <View style={styles.main}>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={items}
                    renderItem={({ item }) => (<Item
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

                </FlatList>
            </SafeAreaView>
            <Modal
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setVisible(false)}
                onBackButtonPress={() => {
                    setVisible(false);
                    navigation.goBack()
                }}
                onBackdropPress={() => setVisible(false)}
                isVisible={visible}
            >
                <View style={styles.centerView}>
                    <View style={styles.modalView}>
                        <TextInput placeholder='DD/MM/YYYY' style={styles.input} onChangeText={date => setDate(date)} selectTextOnFocus={true} multiline={true} />
                        <TextInput placeholder='Title...' style={styles.input} onChangeText={title => setTitle(title)} selectTextOnFocus={true} multiline={true} />
                        <TextInput placeholder='Extra...' style={styles.input} onChangeText={extra => setExtra(extra)} selectTextOnFocus={true} multiline={true} />
                        <TextInput placeholder='Diary...' style={styles.input} onChangeText={diary => setDiary(diary)} selectTextOnFocus={true} multiline={true} />
                        <View style={{ flexDirection: 'row', width: width, height: 70, justifyContent: 'flex-start' }}>
                            <View style={{ alignItems: 'center', flexDirection: 'column', padding: 5 }}>
                                <TouchableOpacity onPress={() => pickImage()} style={{ alignSelf: 'center' }}>
                                    <FontAwesome name="image" size={25} color='#bd4a20' />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginVertical: 10, alignSelf: 'center' }} onPress={() => cameraShot()}>
                                    <FontAwesome name="camera" size={25} color='#bd4a20' />
                                </TouchableOpacity>
                            </View>
                            <View style={{width: 60, height: 60, alignSelf: 'center'}}>
                                {
                                    file !== null && <View style={{ alignSelf: 'center', marginLeft: 50 }}>
                                        <Image source={{ uri: file.uri }} style={{ width: 60, height: 60 }} />
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity
                                disabled={(title === '' || extra === '' || diary === '') ? true : false}
                                style={title !== '' || extra !== '' || diary !== '' ? [styles.buttonModal, { alignItems: 'center' }] : [styles.buttonModal, { alignItems: 'center', opacity: .6 }]}
                                onPress={() => upload(date, file)}>
                                <Text style={[styles.text, { fontSize: 18 }, { marginTop: 5 }]}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        marginTop: Constants.statusBarHeight,
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
        marginVertical: 8,
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
        color: '#c4c0c0',
        fontSize: 14
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
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
        padding: 10
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#f2400f',
        width: 120,
        height: 40
    },
    buttonClose: {
        width: 60
    },
    input: {
        borderBottomColor: '#7b82a6',
        borderBottomWidth: 2,
        width: width,
        marginVertical: 10
    },
    button: {
        padding: 3,
        backgroundColor: 'rgba(92, 110, 191, .5)',
        borderRadius: 3,
        marginHorizontal: 3
    }
})