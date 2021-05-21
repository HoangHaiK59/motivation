import * as React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, FlatList, SafeAreaView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Feather, FontAwesome, Entypo as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Action, { CARD_HEIGHT, WIDTH, MARGIN } from './action';
import Reanimated, { useCode, cond, set, Clock, clockRunning, eq, not, add, min, abs, call } from 'react-native-reanimated';
import {
    PanGestureHandler,
    State,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {
    clamp,
    snapPoint,
    timing,
    useClock,
    usePanGestureHandler,
    useValue
} from 'react-native-redash/lib/module/v1';
import { ModalStyles } from '../../common/styles/modal.style';
import * as Font from 'expo-font';

const { width } = Dimensions.get('window');

const { height: wHeight } = Dimensions.get('window');
const height = wHeight - 64;

const snapPoints = [-width, -180, 0];

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

const Item = ({ id, title, url, author, horizontal, onSwipe }) => {
    const { translation, velocity, state, gestureHandler } = usePanGestureHandler();
    const translateX = useValue(0);
    const offsetX = useValue(0);
    const height = useValue(CARD_HEIGHT);
    const deleteOpacity = useValue(1);
    const clock = useClock();
    const to = snapPoint(translateX, velocity.x, snapPoints);
    const shouldRemove = useValue(0);
    useCode(() => [
        cond(eq(state, State.ACTIVE), set(translateX, add(offsetX, min(translation.x, 0)))),
        cond(eq(state, State.END), [
            set(translateX, timing({ clock, from: CARD_HEIGHT, to })),
            set(offsetX, translateX),
            cond(eq(to, -width), set(shouldRemove, 1))
        ]),
        cond(shouldRemove, [
            set(height, timing({ from: CARD_HEIGHT, to: 0 })),
            set(deleteOpacity, 0),
            cond(not(clockRunning(clock)), call([], onSwipe)),
        ])
    ], [onSwipe])
    return (
        <>
            {
                horizontal ? <View style={styles.itemHorizoltal}>
                    <View style={styles.itemList}>
                        <Image source={{ uri: url }} style={{ width: width, height: Dimensions.get('window').height, margin: 0 }} />
                        <LinearGradient colors={['#190A05', '#870000']} start={[0.7, 0.2]} style={styles.maxim}>
                            <Text style={styles.text}>{title}</Text>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.text}>{author}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View> :
                    <Reanimated.View >
                        <View style={styles.background}>
                            <TouchableWithoutFeedback onPress={() => shouldRemove.setValue(1)}>
                                <Action x={abs(translateX)} deleteOpacity={deleteOpacity} />
                            </TouchableWithoutFeedback>
                        </View>
                        <PanGestureHandler {...gestureHandler}>
                            <Reanimated.View style={{ height, transform: [{ translateX }] }}>
                                <View style={[styles.cardTemplate, { padding: 5 }]}>
                                    <Text style={styles.text}>{title}</Text>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={styles.text}>{author}</Text>
                                    </View>
                                </View>
                            </Reanimated.View>
                        </PanGestureHandler>
                    </Reanimated.View>
            }
        </>
    )
};

const Wallet = ({ animatedValue, id, title, url, author, horizontal, onSwipe }) => {
    const position = Animated.subtract(id * CARD_HEIGHT, animatedValue);
    const isDisappearing = -CARD_HEIGHT;
    const isTop = 0;
    const isBottom = height - CARD_HEIGHT;
    const isAppearing = height;
    const translateY = Animated.add(Animated.add(animatedValue,
        animatedValue.interpolate({
            inputRange: [0, 0.00001 + id * CARD_HEIGHT],
            outputRange: [0, - id * CARD_HEIGHT],
            extrapolateRight: 'clamp',
        })
    ),
        position.interpolate({
            inputRange: [isBottom, isAppearing],
            outputRange: [0, -CARD_HEIGHT / 4],
            extrapolate: 'clamp',
        })
    );
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
            key={id}
        >
            <Item id={id} title={title} url={url} author={author} horizontal={horizontal} onSwipe={onSwipe} />
        </Animated.View>
    )
}

class Maxim extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            horizontal: true,
            visible: false,
            maxim: '',
            author: '',
            maxims: [],
            file: null,
        }

        this.firebaseRef = Firebase.firestore().collection(DB.maxim);
        this.storageRef = Firebase.storage().ref();
        this.animatedValue = new Animated.Value(0);
    }

    async loadFonts() {
        await Font.loadAsync({
            Lato: require('../../../assets/fonts/Lato-Regular.ttf')
        })
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

    back() {
        this.props.navigation.goBack();
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
                        Firebase.firestore().collection(DB.maxim)
                            .add({
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

    renderNavigation() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.button]} onPress={() => this.setState({ visible: true })}>
                        <Text style={[{ fontSize: 12, color: '#fff' }]}>THÊM MỚI</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                        <TouchableOpacity onPress={() => this.setState(state => ({ horizontal: !state.horizontal }))}>
                            {
                                this.state.horizontal ? <Feather name='list' size={20} color='#fff' /> :
                                    <Feather name='grid' size={20} color='#fff' />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => this.back()}>
                    <Icon name='chevron-left' size={25} color='#fff' />
                </TouchableOpacity>
            )
        })
    }

    componentDidMount() {
        this.loadFonts();
        this.getMaxims();
        this.renderNavigation();
    }


    componentDidUpdate(prevState, prevProps) {
        if (this.state.horizontal != prevState.horizontal) {
            this.renderNavigation();
        }
    }

    addMaxim() {
        this.firebaseRef.doc(this.state.author).set({
            created: new Date().toISOString(),
            author: this.state.author,
            maxim: this.state.maxim
        })
            .then(res => {
                this.setState({ visible: false })
                this.getMaxims();
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
        const y = new Animated.Value(0);
        const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
            useNativeDriver: true,
        });
        return (
            <SafeAreaView style={this.state.horizontal ? styles.main : { flex: 1, flexDirection: 'column' }}>

                {
                    this.state.horizontal ? <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal={this.state.horizontal}
                        data={this.state.maxims}
                        renderItem={({ index, item }) => <Item
                            horizontal={this.state.horizontal}
                            id={item.id}
                            title={item.maxim}
                            author={item.author}
                            url={item.url}
                        />}
                    /> : <AnimatedFlatlist
                        scrollEventThrottle={16}
                        bounces={false}
                        {...{ onScroll }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.maxims}
                        renderItem={({ index, item }) => <Wallet
                            onSwipe={() => {
                                const newItems = [...this.state.maxims];
                                newItems.splice(newItems.indexOf(item), 1);
                                this.setState({ maxims: newItems })
                            }}
                            animatedValue={y}
                            horizontal={this.state.horizontal}
                            id={index}
                            title={item.maxim}
                            author={item.author}
                            url={item.url}
                        />}
                    />
                }
                <Modal
                    isVisible={this.state.visible}
                    onSwipeComplete={() => this.setState({ visible: false })}
                    swipeDirection={['up', 'left', 'right', 'down']}
                    onBackdropPress={() => this.setState({ visible: false })}
                    onBackButtonPress={() => {
                        this.setState({ visible: false });
                        this.props.navigation.goBack();
                    }}
                >
                    <View style={ModalStyles.mainView}>
                        <View style={ModalStyles.contentView}>
                            <View style={ModalStyles.titleModal}>
                                <Text style={ModalStyles.titleText}>Create Maxim</Text>
                            </View>
                            <Text style={ModalStyles.textLabel}>Content</Text>
                            <TextInput
                                value={this.state.maxim}
                                onChangeText={maxim => this.setState({ maxim })}
                                selectTextOnFocus={true}
                                multiline={true}
                                style={[ModalStyles.input, {textAlignVertical: 'top', height: 120}]}
                                placeholder='Maxim...'
                                placeholderTextColor="#a39ea0"
                                numberOfLines={4}
                            />
                            <Text style={ModalStyles.textLabel}>Author</Text>
                            <TextInput
                                value={this.state.author}
                                onChangeText={author => this.setState({ author })}
                                selectTextOnFocus={true}
                                multiline={true}
                                style={ModalStyles.input}
                                placeholder='Author...'
                                placeholderTextColor="#a39ea0"
                            />
                            <View style={ModalStyles.boxUploadContainer}>
                                <View style={ModalStyles.boxUploadItem}>
                                    <View style={ModalStyles.itemRow}>
                                        {
                                            this.state.file === null ? <TouchableOpacity onPress={() => this.pickImage()}>
                                                <FontAwesome name="image" size={25} color='#bd4a20' />
                                            </TouchableOpacity> : <View style={{ width: '100%', height: '100%' }}>
                                                <Image source={{ uri: this.state.file.uri }} style={{ width: '100%', height: 50 }} />
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity
                                    style={ModalStyles.button}
                                    onPress={() => this.upload({
                                        maxim: this.state.maxim,
                                        author: this.state.author
                                    }, this.state.file)}>
                                    <Text style={ModalStyles.textButton}>Add</Text>
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
        marginVertical: 8,
        marginHorizontal: 8,

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
    },
    cardTemplate: {
        width: WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: '#2d4269',
    },
    cardWall: {
        marginVertical: MARGIN,
        alignSelf: 'center'
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        //backgroundColor: "#E1E2E3",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        overflow: "hidden",
    },
});

export default Maxim;