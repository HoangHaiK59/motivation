import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList, SafeAreaView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Firebase, { DB } from '../../../firebase';
import Constants from 'expo-constants';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Mapday = (day) => {
    const arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const valueId = moment(day, 'DD/MM/YYYY').toDate().getDay() - 1;
    console.log(valueId);
    return arr.find((val, id) => id === valueId)
}

const Item = ({ id, title, selected, onSelect }) => {
    return <TouchableOpacity
        onPress={() => onSelect(id)}
        style={[
            styles.item, {
                backgroundColor: selected ? '#2d4269' : '#132426'
            }
        ]}>
        <View style={styles.itemLeft}>
            <View style={styles.textInLeft}>
                <Text style={styles.text}>{id.slice(0, id.indexOf('-'))}</Text>
                <Text style={styles.text}>{id.slice(id.indexOf('-') + 1, id.length)}</Text>
            </View>
        </View>
        <View style={styles.itemRight}>
            <Text style={styles.text}>{title}</Text>
        </View>
    </TouchableOpacity>
}

export default function Month({ route }) {
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

    const onSelect = React.useCallback(id => {
        const newSelected = new Map(selected);
        newSelected.set(id, !selected.get(id));

        setSelected(newSelected);
    }, [selected]);

    React.useEffect(() => {
        Firebase.firestore().collection(`${DB.diary}/${params.year}/${params.id}`)
        .get()
        .then(result => {
            if(result.docs.length > 0) {
                let items = [];
                result.forEach(doc => items.push({id: doc.id, ...doc.data()}));
                setItems(items);
            }
        })
    },[])


    const upload = async (date, file) => {
        let response, blob ;
        if(Object.keys(file).length > 0 ) {
            response = await fetch(file.uri);
            blob = await response.blob();
        }
        let is_input_date = date === '' ? false : true;
        let dateInp = '';
        if (is_input_date) {
            dateInp = moment(date, 'DD/MM/YYYY').toDate().getDate().toString();
        }
        if(Object.keys(file).length > 0) {
            storageRef
                .child(`Diary/${params.year}/${params.id}` + `/${file.name}`)
                .put(blob)
                .then(snapShot => {
                    storageRef
                        .child(snapShot.metadata.fullPath)
                        .getDownloadURL()
                        .then(url => {
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
                allowsEditing: true,
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

    return (
        <View style={styles.main}>
            <SafeAreaView style={styles.container}>
                <FlatList
                data={items}
                renderItem={({item}) => (<Item 
                    id={item.id}
                    title={item.title}
                    selected={!!selected.get(item.id)}
                    onSelect={onSelect}
                    />)}
                >
                
                </FlatList>
            </SafeAreaView>
            <View style={styles.bottom}>
                <TouchableOpacity onPress={() => {setVisible(true); setFile({})}}>
                    <FontAwesome name='plus-circle' size={30} color='#ed881c'/>
                </TouchableOpacity>
            </View>
            <Modal 
            animationType='slide'
            transparent={true}
            onRequestClose={() => {}}
            visible={visible}
            >
                <View style={styles.centerView}>
                    <View style={styles.modalView}>
                        <TextInput placeholder='DD/MM/YYYY' style={styles.input} onChangeText={date => setDate(date)} selectTextOnFocus={true} multiline={true}/>
                        <TextInput placeholder='Title...' style={styles.input} onChangeText={title => setTitle(title)} selectTextOnFocus={true} multiline={true}/>
                        <TextInput placeholder='Extra...' style={styles.input} onChangeText={extra => setExtra(extra)} selectTextOnFocus={true} multiline={true}/>
                        <TextInput placeholder='Diary...' style={styles.input} onChangeText={diary => setDiary(diary)} selectTextOnFocus={true} multiline={true}/>
                        {
                            file !== null && <View style={{ alignSelf: 'center' }}>
                                <Image source={{ uri: file.uri }} style={{ width: 50, height: 50 }} />
                            </View>
                        }
                        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => pickImage()}>
                                <FontAwesome name="image" size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity
                                disabled={(title === '' || extra === '' || diary === '') ? true: false}
                                style={title !== '' || extra !== '' || diary !== '' ? [styles.buttonModal, { alignItems: 'center' }] : [styles.buttonModal, { alignItems: 'center', opacity: .6 }]}
                                onPress={() => upload(date, file)}>
                                <Text style={styles.text}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonClose, { alignItems: 'center' }]} onPress={() => setVisible(false)}>
                                <Text style={styles.text}>Close</Text>
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
        padding: 20,
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
    textInLeft: {
        alignItems: 'center',
    },
    itemRight: {
        alignItems: 'center',
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
        width: width
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#f2400f',
        width: 60
    },
    buttonClose: {
        width: 60
    },
    input: {
        borderBottomColor: '#173f6e',
        borderBottomWidth: 2,
        width: width
    }
})