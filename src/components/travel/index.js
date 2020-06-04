import * as React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Dimensions, Image } from 'react-native';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { map } from '../../helper/map';


class Travel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            medias: [],
            visible: false,
            name: '',
            file: {}
        }

        this.storageRef = Firebase.storage().ref();
    }

    upload = async (ref, file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const name = map(ref);
        this.storageRef
            .child(ref + `/${file.name}`)
            .put(blob)
            .then(snapShot => {
                this.storageRef
                    .child(snapShot.metadata.fullPath)
                    .getDownloadURL()
                    .then(url => {
                        Firebase.firestore().collection(`${DB.travel}/${name}/albums`)
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
                                this.setState({ visible: false });
                                this.getAll();
                            })
                            .catch(error => console.log(error))
                    })

            },
                reject => {
                    console.log(reject.message);
                })
    }

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 3],
                quality: 1
            });

            if (!result.cancelled) {
                let fileName = result.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(fileName);
                let type = match ? `image/${match[1]}` : `image`;
                this.setState({ file: { uri: result.uri, name: fileName, type, width: result.width, height: result.height } })
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    getAll() {
        Firebase.firestore().collection(DB.travel).get()
            .then(result => {
                if (result.docs.length > 0) {
                    let medias = [];
                    result.docs.forEach(doc => medias.push(doc.id));
                    this.setState({ medias })
                }
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getAll();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    {
                        this.state.medias.length > 0 && <View style={styles.travelContainer}>
                            {
                                this.state.medias.map((media, id) => <View key={id} style={styles.item}>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail Travel', { ref: media, title: media })}>
                                            <FontAwesome name="folder" size={55} color='#eda32b' />
                                        </TouchableOpacity>
                                    </View>
                                    <Text ellipsizeMode={"tail"} style={[styles.text, styles.textStyle]}>{media}</Text>
                                </View>)
                            }
                        </View>
                    }
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={() => this.setState({ visible: true, file: {} })}>
                        <FontAwesome name='plus-circle' size={30} color='#ed881c' />
                    </TouchableOpacity>
                </View>
                <Modal visible={this.state.visible} transparent={true} animationType="fade" onRequestClose={() => { }}>
                    <View style={styles.centerView}>
                        <View style={styles.modalView}>
                            <TextInput placeholder='Folder name' style={styles.textInput} onChangeText={name => this.setState({ name })} selectTextOnFocus={true} />
                            {
                                this.state.file !== null && <View style={{ alignSelf: 'center' }}>
                                    <Image source={{ uri: this.state.file.uri }} style={{ width: 50, height: 50 }} />
                                </View>
                            }
                            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity onPress={() => this.pickImage()}>
                                    <FontAwesome name="image" size={20} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity disabled={(Object.keys(this.state.file).length <= 0 || this.state.name === '') ? true : false}
                                    style={(Object.keys(this.state.file).length > 0 || this.state.name !== '') ? [styles.buttonModal, { alignItems: 'center' }] : [styles.buttonModal, { alignItems: 'center', opacity: .6 }]}
                                    onPress={() => this.upload(this.state.name, this.state.file)}>
                                    <Text style={styles.text}>Create</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttonClose, { alignItems: 'center' }]} onPress={() => this.setState({ visible: false })}>
                                    <Text style={styles.text}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 2
    },
    travelContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        marginHorizontal: 5
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
        width: Dimensions.get('window').width
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#f2400f',
        width: 60
    },
    buttonClose: {
        width: 60
    },
    item: {
        width: 70,
        height: 80,
        marginHorizontal: 5,
        marginVertical: 5
    },
    textInput: {
        borderBottomColor: '#173f6e',
        borderBottomWidth: 2,
        width: Dimensions.get('window').width
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    textStyle: {
        overflow: 'hidden',
        textAlign: 'center'
    }
})

export default Travel;