import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions, FlatList, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { ModalStyles, placeHolderTextColor } from '../../common/styles/modal.style';
import base64 from 'base-64';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../../firebase';
import { callToastWithGravity, Duration, Gravity } from '../../services/toast';
import Text from '../text/regular';

const { height } = Dimensions.get('window');

const firestore = firebase.firestore();

const AddVocabulary = ({ id, visible, setVisible, callback, vocabulary }) => {
    const [data, setData] = useState([]);
    const handleAddItem = () => {
        setData(data => ([
            {
                id: base64.encode(moment(new Date()).unix().toString()),
                name: '',
                content: ''
            },
            ...data
        ]))
    }
    /**
     * remove item by id
     * @param {string} id 
     */
    const removeItem = (id) => {
        setData(data => data.filter(s => s.id !== id))
    }
    const save = () => {
        if ((vocabulary && vocabulary.data.length === 0) || !vocabulary) {

            firestore.doc(`vocabulary/${id}`)
                .set({ name: base64.decode(id), data })
                .then(() => {
                    callToastWithGravity('Created!', Duration.short, Gravity.bottom);
                    setVisible(false);
                    callback();
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            firestore.doc(`vocabulary/${id}`)
                .update({ data: [...vocabulary.data, ...data] })
                .then(() => {
                    callToastWithGravity('Updated!', Duration.short, Gravity.bottom);
                    setVisible(false);
                    callback();
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
    /**
     * Process event text change
     * @param {string} text 
     * @param {string} id 
     * @param {string} field
     */
    const onChangeText = (text, id, field) => {
        setData(data => (
            data.map(d => {
                if (d.id === id) {
                    return ({ ...d, [field]: text })
                }
                return d
            })
        ))
    }
    return <Modal
        isVisible={visible}
        onBackButtonPress={() => {
            setVisible(false);
        }}
        swipeDirection={['down', 'left', 'right', 'up']}
        onSwipeComplete={() => setVisible(false)}
    >
        <View style={[ModalStyles.mainViewAvoidKeyboard, { height: height - 30 }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"}>
                <View style={ModalStyles.contentView}>
                    <View style={ModalStyles.titleWithBtn}>
                        <View style={{ flex: 1 }}>
                            <Text style={ModalStyles.titleText}>Add Vocabulary</Text>
                        </View>
                        <View style={{ flex: 0 }}>
                            <TouchableOpacity onPress={handleAddItem}>
                                <FontAwesome name='plus-circle' size={25} color='#c72712' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SafeAreaView style={styles.container}>
                        <FlatList
                            horizontal={false}
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => <View style={styles.group}>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="name"
                                        placeholderTextColor={placeHolderTextColor}
                                        multiline={true}
                                        value={item.name}
                                        onChangeText={text => onChangeText(text, item.id, 'name')}
                                        style={[ModalStyles.input, { width: '100%' }]}
                                    />
                                </View>
                                <View style={styles.item}>
                                    <TextInput
                                        placeholder="content"
                                        placeholderTextColor={placeHolderTextColor}
                                        multiline={true}
                                        value={item.content}
                                        onChangeText={text => onChangeText(text, item.id, 'content')}
                                        style={[ModalStyles.input, { width: '100%' }]}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => removeItem(item.key)}>
                                    <FontAwesome name='minus-circle' size={25} color='#e88c35' />
                                </TouchableOpacity>
                            </View>}
                        />
                    </SafeAreaView>
                    <View style={styles.group}>
                        <View style={styles.item}>
                            <TouchableOpacity onPress={save} style={[ModalStyles.button, { width: '100%' }]}>
                                <FontAwesome name='check-circle' size={25} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 500
    },
    group: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    item: {
        flex: 1
    }
})

AddVocabulary.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
    vocabulary: PropTypes.object.isRequired,
}

export default AddVocabulary;