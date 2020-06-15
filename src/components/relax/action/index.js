import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { Ionicons as Icon } from '@expo/vector-icons';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';

const { width } = Dimensions.get('window');

const Action = ({ route, navigation }) => {
    const { params } = route;
    const { id, displayAlert } = params;
    const [item, setItem] = React.useState(null);
    const [fa, setFa] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [text, setText] = React.useState('');
    const firebaseRef= Firebase.firestore().collection(DB.relax);

    React.useEffect(() => {
        firebaseRef.doc(id)
        .get()
        .then(doc => {
            if(doc.exists) {
                setItem({id:doc.id, ...doc.data()});
                setFa(doc.data().is_farvorite)
            }
        })
    }, [])

    const handleChangeFarvourite = (id, state) => {
        firebaseRef.doc(id)
            .get()
            .then(snapShot => {
                firebaseRef.doc(id)
                .update({...snapShot.data(), is_farvorite: state});
                setVisible(true);
            })
    }

    // React.useEffect(() => {
    //     Firebase.firestore().collection(DB.relax).doc(params.id)
    //     .get()
    //     .then(result => {
    //         setItem(result.data())
    //     })
    //     .catch(error => console.log(error))
    // }, [])
    return (
        <View style={styles.container}>
            <View style={styles.backdrop}>
                <Image source={{ uri: item?.image_url }} resizeMode="contain" style={{ width: 200, height: 200 }} />
            </View>
            <View style={styles.content}>
                <TouchableOpacity style={styles.row} onPress={() => {
                    handleChangeFarvourite(item?.id, !fa);
                    displayAlert('Message');
                    navigation.goBack();
                }}>
                    <View style={styles.cell}>
                        <Icon name={item?.is_farvorite ?'ios-heart': 'ios-heart-empty'} size={24} color={item?.is_farvorite ? '#a6392d' : '#fff'} />
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                        <Text style={styles.text}>{item?.is_farvorite ? 'Đã thích' : 'Thích'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <View style={[styles.cell, {alignItems: 'center'}]}>
                        <Icon name='ios-add' size={40} color='#a6392d' />
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                        <Text style={styles.text}>Tạo mới</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <View style={[styles.cell, {marginLeft: 3}]}>
                        <Icon name='ios-trash' size={26} color='#a6392d' />
                    </View>
                    <View style={[styles.cell, { flex: 1 }]}>
                        <Text style={[styles.text, {marginLeft: 3}]}>Xóa khỏi danh sách</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        flexDirection: 'column',
        padding: 8
    },
    text: {
        fontSize: 14,
        color: '#fff'
    },
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        padding: 8,
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    row: {
        flexDirection: "row",
        backgroundColor: "black",
        height: 40
    },
    cell: {
        padding: 16,
        justifyContent: "center",
    },
    icon: {
        width: 50,
        height: 45
    }
})

export default Action;