import * as React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image, ScrollView, FlatList, SafeAreaView } from 'react-native';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import { FontAwesome , Entypo as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { map } from '../../helper/map';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window')

class Travel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            medias: [],
            visible: false,
            name: '',
            file: {},
            folderName: '',
            up: false
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
                        Firebase.firestore().collection(`${DB.travel}`).doc(name)
                        .set({});

                        Firebase.firestore().collection(`${DB.travel}`).doc(name).collection('albums')
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
                allowsEditing: false,
                aspect: [2, 3],
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
                    this.setState({ medias: this.sortArray(true, result.docs.map(doc => doc.id)) })
                }
            })
            .catch(error => console.log(error))
    }

    back() {
        this.props.navigation.goBack();
    }

    componentDidMount() {
        this.getAll();
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => this.setState({visible: true, file: {}})}>
                    <View>
                        <FontAwesome name='plus-circle' color="#fff" size={25} />
                    </View>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => this.back()}>
                    <Icon name='chevron-left' size={25} color='#fff'/>
                </TouchableOpacity>
            )
        })
    }

    handleSortByName() {
        this.setState(state => ({medias: this.sortArray(state.up, this.state.medias), up: !state.up}))
    }

    sortArray(asc = true, array = []) {
        if (asc) {
            array.sort((a,b) => a.localeCompare(b))
        } else {
            array.sort((a,b) => -a.localeCompare(b))
        }
        return array;
    }

    // <View style={styles.bottomContainer}>
    //     <TouchableOpacity onPress={() => this.setState({ visible: true, file: {} })}>
    //         <FontAwesome name='plus-circle' size={30} color='#ed881c' />
    //     </TouchableOpacity>
    // </View>
    renderItem = ({item, index}) => {
        return <View style={[styles.fview, index % 2!== 0 && {marginLeft: 25}]}>
            <TouchableOpacity style={[styles.fItem]} onPress={() => this.props.navigation.navigate('Detail Travel', { ref: item, title: item, name: this.state.folderName })}>
                <View>
                    <FontAwesome name="folder" size={35} color='#2cebf5' />
                </View>
            </TouchableOpacity>
            <Text style={[styles.textFolder]}>{item}</Text>
        </View>
    }

    HeaderComponent = () => {
        return (
            <View>
                <View style={styles.searchBox}>
                    <TextInput 
                    placeholder="Search..."
                    placeholderTextColor='#000'
                    style={[styles.inputSearch]}
                    />
                </View>
                <View style={styles.filter}>
                    <TouchableOpacity style={styles.sort} onPress={() => this.handleSortByName()}>
                        <View style={styles.sView}>
                            <Text style={styles.textBold}>Name</Text>
                            <FontAwesome name={this.state.up ? 'sort-up': 'sort-down' } size={20} color='#fff' style={{marginTop: this.state.up ? 4: -4, marginLeft: 5}} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {/* <View style={styles.container}>
                    {
                        this.state.medias.length > 0 && <View style={styles.travelContainer}>
                            {
                                this.state.medias.map((media, id) => <View key={id} style={styles.item}>
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail Travel', { ref: media, title: media, name: this.state.folderName })}>
                                            <FontAwesome name="folder" size={55} color='#eda32b' />
                                        </TouchableOpacity>
                                    </View>
                                    <Text ellipsizeMode={"tail"} style={[styles.text, styles.textStyle]}>{media}</Text>
                                </View>)
                            }
                        </View>
                    }
                </View> */}
                <FlatList
                scrollEnabled={true}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                data={this.state.medias}
                keyExtractor={(item, index) => item + index}
                renderItem={this.renderItem}
                ListHeaderComponent={this.HeaderComponent}
                />
                <Modal
                    isVisible={this.state.visible}
                    swipeDirection={['down', 'left', 'right', 'up']}
                    onSwipeComplete={() => this.setState({ visible: false })}
                    onBackButtonPress={() => this.setState({ visible: false })}
                >
                    <View style={styles.swipeView}>
                        <View style={styles.modalView}>
                            <View style={{ display: 'flex',flexDirection: 'row', padding: 5 }}>
                                <View style={{ alignItems: 'flex-start', flexDirection: 'row', display: 'flex' }}>
                                    <View style={styles.split}>
                                        <TouchableOpacity onPress={() => this.pickImage()}>
                                            <FontAwesome name="image" size={40} color='#205fbd' />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.split}>
                                        <TouchableOpacity onPress={() => this.pickImage()}>
                                            <FontAwesome name="camera" size={40} color='#205fbd' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ width: 100, height: 100, marginLeft: 100 }}>
                                    {
                                        this.state.file !== null && <View style={{ alignSelf: 'center' }}>
                                            <Image source={{ uri: this.state.file.uri }} style={{ width: 100, height: 100 }} />
                                        </View>
                                    }
                                </View>
                            </View>
                            <TextInput placeholder='Folder name'  
                            placeholderTextColor='#565785'
                            style={[styles.textInput, { marginVertical: 10 }]} 
                            onChangeText={name => this.setState({ name })} selectTextOnFocus={true} />
                            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity disabled={(Object.keys(this.state.file).length <= 0 || this.state.name === '') ? true : false}
                                    style={(Object.keys(this.state.file).length > 0 || this.state.name !== '') ? [styles.buttonModal, { alignItems: 'center' }] : [styles.buttonModal, { alignItems: 'center', opacity: .6 }]}
                                    onPress={() => this.upload(this.state.name, this.state.file)}>
                                    <Text style={styles.text}>Create</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        flexDirection: 'column',
        paddingHorizontal: 25
    },
    container: {
        flex: 1,
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
        width: Dimensions.get('window').width,
        paddingHorizontal: 8,
        paddingVertical: 8,
        height: 250,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#305ed1',
        width: 80,
        height: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
        shadowOffset: {
            width: 1,
            headerRight: 2
        },
        shadowRadius: 2,
        borderRadius: 5,
        borderWidth: 1,
        padding: 6,
        borderColor: '#cfccc6',
        backgroundColor: '#f5f4f2',
        width: Dimensions.get('window').width - 20
    },
    text: {
        color: '#fff',
        fontSize: 14
    },
    textStyle: {
        overflow: 'hidden',
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
    fItem: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: 100,
        backgroundColor: '#1e212b',
        borderRadius: 5
    },
    textFolder: {
        color: '#fff',
        fontSize: 14
    },
    searchBox: {
        marginTop: 10,
        height: 50,
        alignItems: 'center'
    },
    inputSearch: {
        width: '100%',
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        height: 40
    },
    fview: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: 120,
        justifyContent: 'flex-start',
        marginBottom: 25,
    },
    filter: {
        marginTop: 10,
        height: 40,
        display: 'flex',
        justifyContent: 'space-between'
    },
    sort: {
        flex: 1,
    },
    sView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    textBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    split: {
        // borderStyle: 'dashed', borderColor: 'red', borderWidth: 1,
        width: width /2 - 10, display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: 100
    }
})

export default Travel;