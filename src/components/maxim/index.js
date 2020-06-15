import * as React from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, FlatList, SafeAreaView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Item = ({ id, title, url, author, horizontal }) => (
    <View style={horizontal ? styles.itemHorizoltal : styles.item}>
        {
            horizontal ? <View style={styles.itemList}>
                <Image source={{ uri: url }} style={{ width: width, height: height, margin: 0 }} />
                <LinearGradient colors={['#190A05', '#870000']} start={[0.7, 0.2]} style={styles.maxim}>
                    <Text style={styles.text}>{title}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.text}>{author}</Text>
                    </View>
                </LinearGradient>
            </View> : <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.text}>{title}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.text}>{author}</Text>
                    </View>
                </View>
        }
    </View>
);

class Maxim extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            horizontal: true,
            visible: false,
            maxim: '',
            author: '',
            maxims: [],
            update: false,
            file: {},
        }

        this.firebaseRef = Firebase.firestore().collection(DB.maxim);
        this.storageRef = Firebase.storage().ref();
    }

    getMaxims() {
        this.firebaseRef.get()
            .then(result => {
                if (result.docs.length > 0) {
                    let maxims = [];
                    result.forEach(doc => maxims.push({ id: doc.id, ...doc.data() }))
                    this.setState({ maxims, update: false })
                }
            })
    }

    upload = async (ref, file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        this.storageRef
            .child('Maxim' + `/${file.name}`)
            .put(blob)
            .then(snapShot => {
                this.storageRef
                    .child(snapShot.metadata.fullPath)
                    .getDownloadURL()
                    .then(url => {
                        Firebase.firestore().collection(DB.maxim).doc(ref.author)
                            .set({
                                author: ref.author,
                                created: new Date().toISOString(),
                                maxim: ref.maxim,
                                url
                            })
                            .then(refer => {
                                //console.log(refer.id);
                                this.setState({ visible: false, update: true });
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

    componentDidMount() {
        this.getMaxims();
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => this.setState({ visible: true })}>
                    <Text style={[{ fontSize: 12, color: '#fff' }]}>THÊM MỚI</Text>
                </TouchableOpacity>
            )
        })
    }

    componentDidUpdate(prevState, prevProps) {
        if (this.state.update) {
            this.getMaxims();
        }
    }

    addMaxim() {
        this.firebaseRef.doc(this.state.author).set({
            created: new Date().toISOString(),
            author: this.state.author,
            maxim: this.state.maxim
        })
            .then(res => {
                this.setState({ visible: false, update: true })
            })
            .catch(error => console.log(error))
    }

    //     <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 20, marginHorizontal: 5 }}>
    //     <TouchableOpacity onPress={() => this.setState(state => ({ horizontal: !state.horizontal }))}>
    //         {
    //             this.state.horizontal ? <Feather name='list' size={20} color='#fff' /> :
    //                 <Feather name='grid' size={20} color='#fff' />
    //         }
    //     </TouchableOpacity>
    // </View>

    // <View style={styles.bottom}>
    // <TouchableOpacity onPress={() => this.setState({ visible: true, file: {} })}>
    //     <Feather name='plus-circle' size={25} color='#db3514' />
    // </TouchableOpacity>
    // </View>

    render() {
        return (
            <SafeAreaView style={styles.main}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal={this.state.horizontal}
                    data={this.state.maxims}
                    renderItem={({ item }) => <Item
                        horizontal={this.state.horizontal}
                        id={item.id}
                        title={item.maxim}
                        author={item.author}
                        url={item.url}
                    />}
                />
                <Modal
                    isVisible={this.state.visible}
                    backdropOpacity={0.8}
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    animationInTiming={350}
                    animationOutTiming={350}
                >
                    <View style={styles.centerView}>
                        <View style={styles.modalView}>
                            <TextInput
                                value={this.state.maxim}
                                onChangeText={maxim => this.setState({ maxim })}
                                selectTextOnFocus={true}
                                multiline={true}
                                style={styles.textInput}
                                placeholder='Maxim...'
                            />
                            <TextInput
                                value={this.state.author}
                                onChangeText={author => this.setState({ author })}
                                selectTextOnFocus={true}
                                multiline={true}
                                style={styles.textInput}
                                placeholder='Author...'
                            />
                            <View style={{ alignSelf: 'center' }}>
                                <Image source={{ uri: this.state.file?.uri }} style={{ width: 50, height: 50 }} />
                            </View>
                            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.pickImage()}>
                                    <FontAwesome name="image" size={20} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity
                                    disabled={(Object.keys(this.state.file).length <= 0 || this.state.maxim === '' || this.state.author === '') ? true : false}
                                    style={(Object.keys(this.state.file).length <= 0 || this.state.maxim === '' || this.state.author === '') ? [styles.buttonOpacity, { alignItems: 'center' }] :
                                        [styles.buttonModal, { alignItems: 'center' }]}
                                    onPress={() => this.upload({
                                        maxim: this.state.maxim,
                                        author: this.state.author
                                    }, this.state.file)}>
                                    <Text style={styles.text}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonClose} onPress={() => this.setState({ visible: false })}>
                                    <Text style={styles.text}>Close</Text>
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
    main: {
        flex: 1,
        flexDirection: 'column',
        //marginTop: Constants.statusBarHeight
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    itemList: {
        //width: Dimensions.get('window').width - 30,
        //padding: 35,
        flexDirection: 'column'
    },
    maxim: {
        position: 'absolute',
        width: width,
        height: 200,
        bottom: 0,
        //backgroundColor: '#785250',
        opacity: .8,
        padding: 16
    },
    bottom: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    item: {
        backgroundColor: '#2d4269',
        //padding: 20,
        //marginVertical: 8,
        //marginHorizontal: 8,
        width: Dimensions.get('window').width - 20
    },
    itemHorizoltal: {
        //backgroundColor: '#2d4269',
        //padding: 20,
        //marginVertical: 8,
        //marginHorizontal: 8,
        flex: 1
    },
    title: {
        color: 'white',
        fontSize: 54,
        fontWeight: 'bold',
        marginBottom: 50,
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
        width: Dimensions.get('window').width
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#f2400f',
        width: 60,
    },
    buttonOpacity: {
        borderRadius: 30,
        backgroundColor: '#f2400f',
        width: 60,
        opacity: .6
    },
    buttonClose: {
        width: 60,
        marginHorizontal: 5
    },
    textInput: {
        width: Dimensions.get('window').width - 20,
        borderBottomColor: 'tomato',
        borderBottomWidth: 2
    },
    button: {
        padding: 3,
        backgroundColor: 'rgba(173, 163, 163, .5)',
        borderRadius: 3,
        marginHorizontal: 3
    }
});

export default Maxim;