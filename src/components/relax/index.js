import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Dimensions, Image } from 'react-native';
import Modal from 'react-native-modal';
import { FontAwesome, Ionicons as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import Firebase from '../../firebase';
import Cover from '../common/cover';
import Content from './content';
import Animated from 'react-native-reanimated';
import { DB } from '../../helper/db';

const { width, height } = Dimensions.get('window');

class Relax extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            urls: [],
            hour: new Date().getHours(),
            showAction: false,
            idSelected: 0,
            message: '',
            item: null,
            uri: 'https://firebasestorage.googleapis.com/v0/b/motivation-b2dcb.appspot.com/o/Relax%2Frelax-image.jpg?alt=media&token=788fd555-b87f-42e3-98cb-8885f7f2ba5a'
        }

        this.storageRef = Firebase.storage().ref('Relax');
        this.firebaseRef = Firebase.firestore().collection(DB.relax);
        this.animatedValue = new Animated.Value(0);
    }

    getStringFromHour() {
        if (this.state.hour >= 4 && this.state.hour <= 12) {
            return 'Morning';
        } else if (this.state.hour > 12 && this.state.hour <= 18) {
            return 'Afternoon'
        } else if (this.state.hour > 18 && this.state.hour <= 22) {
            return 'Evening'
        } else {
            return 'Night'
        }
    }

    getFavourites() {
        this.firebaseRef.where('is_farvorite', '==', true)
            .get()
            .then(result => {
                let items = [];
                if (result.docs.length > 0) {
                    result.docs.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
                    console.log(items);
                    this.setState({ items })
                }
            })
    }

    componentDidMount() {
        this.getFavourites();
        // this.storageRef.listAll()
        //     .then(result => {
        //         var promises = [];
        //         if (result.items.length > 0) {
        //             promises = result.items.map(item => {
        //                 return this.storageRef.child(item.name).getDownloadURL()
        //                     .then(url => {
        //                         return url;
        //                     })
        //             });
        //             Promise.all(promises).then(urls => this.setState({ urls }))
        //         }
        //     })
    }

    //     <View style={styles.container}>
    //     <ImageBackground source={{uri: this.state.uri}} style={[styles.image]}>
    //         <Text style={[{ marginBottom: 120, marginLeft: 15, fontSize: 26, color: 'white' }]}>Good {this.getStringFromHour()}</Text>
    //     </ImageBackground>
    //     <LinearGradient
    //         start={[0, .3]}
    //         end={[0, 1]}
    //         colors={['transparent', 'rgba(0,0,0,.2)', 'black']}
    //         style={styles.gradient} />
    // </View>

    componentDidUpdate(prevProps, prevState) {
    }

    showAction = (isShow, idSelected) => {
        let item = this.state.items.find((item, id) => id === idSelected);

        this.setState({ showAction: isShow, idSelected, item })
    }

    displayAlert = () => {
        setTimeout(() => {
            this.setState({ visible: false })
        }, 1500)
    }

    handleChangeFarvourite = (id, state, message) => {
        this.firebaseRef.doc(id).update({is_farvorite: state})
        .then(()=> {
            this.firebaseRef.where('is_farvorite', '==', true)
            .get()
            .then(result => {
                let items = [];
                if (result.docs.length > 0) {
                    result.docs.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
                    console.log(items);
                    this.setState({ visible: true,showAction: false, items, message });
                    this.displayAlert()
                } else {
                    this.setState({ visible: true,showAction: false, message, items: [] });
                    this.displayAlert()
                }
            })
            //this.setState({visible: true, showAction: false});
        })
        // this.firebaseRef.doc(id)
        //     .get()
        //     .then(snapShot => {
        //         this.firebaseRef.doc(id)
        //         .update({...snapShot.data(), is_farvorite: state});
        //         this.setState({visible: true, showAction: false, update: true});
        //     })
    }

    render() {
        const style = {
            cover: { uri: this.state.uri },
            header: 'Good ' + this.getStringFromHour(),
            items: this.state.items.length > 0 ? this.state.items : []
        }
        return (
            <View style={styles.main}>

                {
                    !this.state.showAction ?
                        <>
                            <Cover style={style} animatedValue={this.animatedValue} />
                            <Content
                                showAction={this.showAction.bind(this)}
                                navigation={this.props.navigation}
                                style={style}
                                animatedValue={this.animatedValue} />
                        </> :
                        <View style={styles.actionContainer}>
                            <View style={styles.actionBackdrop}>
                                <Image source={{ uri: this.state.item.image_url }} resizeMode="contain" style={{ width: 200, height: 200 }} />
                            </View>
                            <View style={styles.actionContent}>
                                <TouchableOpacity style={styles.actionRow} onPress={() => {
                                    this.handleChangeFarvourite(this.state.item.id, !this.state.item.is_farvorite, 'Message');
                                    //this.displayAlert('Message');
                                    //navigation.goBack();
                                }}>
                                    <View style={styles.actionCell}>
                                        <Icon name={this.state.item.is_farvorite ? 'ios-heart' : 'ios-heart-empty'} size={24} color={this.state.item.is_farvorite ? '#a6392d' : '#fff'} />
                                    </View>
                                    <View style={[styles.actionCell, { flex: 1 }]}>
                                        <Text style={styles.text}>{this.state.item.is_farvorite ? 'Đã thích' : 'Thích'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionRow}>
                                    <View style={[styles.actionCell, { alignItems: 'center' }]}>
                                        <Icon name='ios-add' size={40} color='#a6392d' />
                                    </View>
                                    <View style={[styles.actionCell, { flex: 1 }]}>
                                        <Text style={styles.text}>Tạo mới</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionRow}>
                                    <View style={[styles.actionCell, { marginLeft: 3 }]}>
                                        <Icon name='ios-trash' size={26} color='#a6392d' />
                                    </View>
                                    <View style={[styles.actionCell, { flex: 1 }]}>
                                        <Text style={[styles.text, { marginLeft: 3 }]}>Xóa khỏi danh sách</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionRow} onPress={() => this.setState({showAction: false})}>
                                    <View style={[styles.actionCell, { marginLeft: 4 }]}>
                                        <Icon name='ios-arrow-back' size={30} color='#a6392d' />
                                    </View>
                                    <View style={[styles.actionCell, { flex: 1 }]}>
                                        <Text style={[styles.text, { marginLeft: 4 }]}>Quay lại</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                }

                <Modal
                    isVisible={this.state.visible}
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    onBackdropPress={() => this.setState({visible: false})}
                >
                    <View style={styles.swipeView}>
                        <View style={styles.modalView}>
                            <Text style={[styles.text, {color: '#000'}]}>{this.state.message}</Text>
                        </View>
                    </View>

                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        width: width,
        height: height / 2
    },
    type: {
        flex: 1,
        flexDirection: 'row'
    },
    typeItem: {
        width: 200,
        height: 200,
        backgroundColor: 'red',
        marginHorizontal: 10
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: 'flex-end',
        alignItems: 'center',
        opacity: .90
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2
    },
    buttonInBackdrop: {
        position: 'absolute',
        top: 50,
        right: 20,
        alignSelf: 'flex-end',
        borderColor: 'white',
        borderWidth: 2,
        backgroundColor: '#cdd1d1',
        zIndex: 3,
        borderRadius: 5,
        color: 'white',
        padding: 5
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
    actionContainer: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        flexDirection: 'column',
        padding: 8
    },
    actionBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionContent: {
        flex: 1,
        padding: 8,
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    actionRow: {
        flexDirection: "row",
        backgroundColor: "black",
        height: 40
    },
    actionCell: {
        padding: 16,
        justifyContent: "center",
    },
    actionIcon: {
        width: 50,
        height: 45
    }
});

export default Relax;