import * as React from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
// import { ModalProvider, createModalStack } from 'react-native-modalfy';
// import Button from './button';
// import CardModal from './modal';

// const { width } = Dimensions.get('screen')

// const config = { Modal: CardModal};

// const defaultOptions = {
//     animateInConfig: {
//         easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
//         duration: 450,
//     },
//     animateOutConfig: {
//         easing: Easing.bezier(0.42, -0.03, 0.27, 0.95),
//         duration: 450,
//     },
//     transitionOptions: animatedValue => ({
//         opacity: animatedValue.interpolate({
//             inputRange: [0, 1, 2],
//             outputRange: [0, 1, 0.9],
//         }),
//         transform: [
//             { perspective: 2000 },
//             {
//                 translateX: animatedValue.interpolate({
//                     inputRange: [0, 1, 2],
//                     outputRange: [-width / 1.5, 0, width / 1.5],
//                     extrapolate: 'clamp',
//                 }),
//             },
//             {
//                 rotateY: animatedValue.interpolate({
//                     inputRange: [0, 1, 2],
//                     outputRange: ['90deg', '0deg', '-90deg'],
//                     extrapolate: 'clamp',
//                 }),
//             },
//             {
//                 scale: animatedValue.interpolate({
//                     inputRange: [0, 1, 2],
//                     outputRange: [1.2, 1, 0.9],
//                     extrapolate: 'clamp',
//                 }),
//             },
//         ],
//     }),
// }

// const stack = createModalStack(config, defaultOptions)

const Item = ({ id, title, horizontal }) => (
    <View style={horizontal ? styles.itemHorizoltal : styles.item}>
        {
            horizontal ? <View style={styles.itemList}>
                <Text style={styles.text}>{title}</Text>
            </View> : <Text style={styles.text}>{title}</Text>
        }
    </View>
);

const data = [
    {
        id: '1',
        title: 'Title 1'
    },
    {
        id: '2',
        title: 'Title 2'
    },
    {
        id: '3',
        title: 'Title 3'
    }
]

class Maxim extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            horizontal: true,
            visible: false,
            maxim: '',
            author: '',
            maxims: [],
            update: false
        }

        this.firebaseRef = Firebase.firestore().collection(DB.maxim);
    }

    getMaxims() {
        this.firebaseRef.get()
        .then(result => {
            if(result.docs.length > 0) {
                let maxims = [];
                result.forEach(doc => maxims.push({id: doc.id, ...doc.data()}))
                this.setState({ maxims, update: false })
            }
        })
    }

    componentDidMount() {
        this.getMaxims();
    }

    componentDidUpdate(prevState, prevProps) {
        if(this.state.update) {
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
            this.setState({visible: false, update: true})
        })
        .catch(error => console.log(error))
    }

    render() {
        return (
            <View style={styles.main}>
                <SafeAreaView style={styles.container}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 20, marginHorizontal: 5 }}>
                        <TouchableOpacity onPress={() => this.setState(state => ({ horizontal: !state.horizontal }))}>
                            {
                                this.state.horizontal ? <Feather name='list' size={20} color='#fff' /> :
                                    <Feather name='grid' size={20} color='#fff' />
                            }
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal={this.state.horizontal}
                        data={data}
                        renderItem={({ item }) => <Item
                            horizontal={this.state.horizontal}
                            id={item.id}
                            title={item.title}
                        />}
                    />
                </SafeAreaView>
                <View style={styles.bottom}>
                    <TouchableOpacity onPress={() => this.setState({ visible: true })}>
                        <Feather name='plus-circle' size={25} color='#db3514' />
                    </TouchableOpacity>
                </View>
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
                            <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity style={[styles.buttonModal, {alignItems: 'center'}]} onPress={() => this.addMaxim()}>
                                    <Text style={styles.text}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonClose} onPress={() => this.setState({ visible: false })}>
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
    main: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 1.5 * Constants.statusBarHeight
    },
    itemList: {
        width: Dimensions.get('window').width - 30,
        height: 250,
        padding: 10
    },
    bottom: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    item: {
        backgroundColor: '#2d4269',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        width: Dimensions.get('window').width - 20
    },
    itemHorizoltal: {
        backgroundColor: '#2d4269',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        height: 250
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
    }
});

export default Maxim;