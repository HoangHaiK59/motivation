import * as React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
//import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { map } from '../../../helper/map';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

const options = {
    title: 'Select Image',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Gallery' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
}

export default function DetailTravel({ route, navigation }) {
    const [items, setItems] = React.useState([]);
    const [urls, setUrls] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [file, setFile] = React.useState({});
    const [update, setUpdate] = React.useState(false);
    const [name, setName] = React.useState('');
    const { params } = route;

    // React.useEffect(() => {
    //     firebase.storage(getAppName()).ref('Hà Nội/HN-01.jpg').getMetadata()
    //     .then(metadata => console.log(metadata));
    // },[])

    // React.useEffect(() => {
    //     firebase.storage(getAppName()).ref('Hà Nội/HN-01.jpg').getDownloadURL()
    //     .then(url => console.log(url));
    // },[])

    React.useEffect(() => {
        let items = [];
        //const name = map(params.ref);
        Firebase.firestore()
            .collection(`${DB.travel}/${params.ref}/albums`)
            .get()
            .then(result => {
                if (result.docs.length > 0) {
                    result.docs.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
                    setItems(items);
                }
                setUpdate(false);
            })
        // firebase.storage(getAppName()).ref(params.ref)
        //     .listAll()
        //     .then(result => {
        //         if (result.items.length > 0) {
        //             var promises = [];
        //             promises = result.items.map(item => {
        //                 return firebase.storage(getAppName()).ref(item.fullPath).getDownloadURL()
        //                     .then(url => {
        //                         return url;
        //                     })
        //             })

        //             Promise.all(promises).then(urls => {
        //                 setUrls(urls);
        //             });

        //             items = result.items.map(item => {
        //                 return { name: item.name, fullPath: item.fullPath, nameNoExtension: item.name.slice(0, item.name.length - 4) }
        //             });

        //             setItems(items);
        //             setUpdate(false);
        //         }
        //     }
        //     )
    }, [update === true]);

    React.useEffect(() => {
        getName();
    }, [])

    const getName = () => {
        Firebase.storage().ref()
        .listAll()
        .then(result => {
            for(const item of result.prefixes) {
                if(map(item.name) === params.ref) {
                    setName(item.name);
                }
            }
        })
    }

    const upload = async (ref, file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        Firebase.storage().ref()
            .child(name + `/${file.name}`)
            .put(blob)
            .then(snapShot => {
                Firebase.storage().ref()
                    .child(snapShot.metadata.fullPath)
                    .getDownloadURL()
                    .then(url => {

                        //avoid intalic in firestore
                        Firebase.firestore().collection(DB.travel).doc(params.ref).set({});

                        Firebase.firestore().collection(DB.travel).doc(params.ref).collection('albums')
                            .add({
                                contentType: snapShot.metadata.contentType,
                                fullPath: snapShot.metadata.fullPath,
                                name: snapShot.metadata.name,
                                size: snapShot.metadata.size,
                                timeCreated: snapShot.metadata.timeCreated,
                                updated: snapShot.metadata.updated,
                                url
                            })
                            .then(refer => {
                                console.log(refer.id);
                                setUpdate(true);
                                setVisible(false);
                            })
                            .catch(error => console.log(error))
                    })

            },
                reject => {
                    console.log(reject.message);
                })
    }

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
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

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, flexGrow: 1 }} >
            <View style={styles.mainContainer}>


                <View style={styles.container}>
                    {
                        items.length > 0 ? items.map((item, id) => <View key={id} style={styles.item}>
                            <TouchableOpacity onPress={() => navigation.navigate('View Image', item)}>
                                <Image style={styles.image} source={{ uri: item.url }} />
                            </TouchableOpacity>

                        </View>) :
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.text]}>No image to show</Text>
                            </View>
                    }
                </View>


                <View style={styles.bottom}>
                    <TouchableOpacity onPress={() => {
                        setVisible(true);
                        setFile({});
                    }}>
                        <FontAwesome name='plus-circle' size={30} color='#e0531b' />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                isVisible={visible}
                swipeDirection={['down', 'left', 'right', 'up']}
                onSwipeComplete={() => setVisible(false)}
                onBackdropPress={() => setVisible(false)}
                onBackButtonPress={() => setVisible(false)}
            >
                <View style={styles.swipeView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: 'row', padding: 5 }}>
                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', flexDirection: 'column' }}>
                                <TouchableOpacity onPress={() => pickImage()}>
                                    <FontAwesome name="image" size={40} color='#205fbd' />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => pickImage()}>
                                    <FontAwesome name="camera" size={40} color='#205fbd' />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: 100, height: 100, marginLeft: 100 }}>
                                {
                                    file !== null && <View style={{ alignSelf: 'center' }}>
                                        <Image source={{ uri: file.uri }} style={{ width: 100, height: 100 }} />
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ alignSelf: 'center', flexDirection: 'row', marginVertical: 10 }}>
                            <TouchableOpacity disabled={Object.keys(file).length <= 0 ? true : false} style={Object.keys(file).length > 0 ? [styles.buttonModal, { alignItems: 'center' }] : [styles.buttonModal, { alignItems: 'center', opacity: .6 }]} onPress={() => upload(params.ref, file)}>
                                <Ionicons name='md-cloud-upload' size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        marginVertical: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginHorizontal: 40
    },
    childContainer: {
        marginVertical: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bottom: {
        position: 'absolute',
        bottom: 20,
        right: 30,
        zIndex: 2
    },
    item: {
        width: 100,
        height: 120,
        marginHorizontal: 5,
        marginVertical: 5
    },
    image: {
        width: 100,
        height: 100
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
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
        width: width
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#bd2a20',
        width: 80,
        height: 25
    },
    buttonClose: {
        width: 60
    },
    textInput: {
        borderBottomColor: 'tomato',
        borderWidth: 2
    }
})