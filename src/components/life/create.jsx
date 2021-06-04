import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import { callToastWithGravity, Duration, Gravity } from '../../services/toast';
import { ModalStyles, placeHolderTextColor } from '../../common/styles/modal.style';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import base64 from 'base-64';
import moment from 'moment';
import Text from '../text/regular';

const storageRef = firebase.storage().ref();

const New = ({ visible, setVisible, callback }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isCamera, setIsCamera] = React.useState(false);
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [2, 3],
                quality: 1
            });

            console.log(result);

            if (!result.cancelled) {
                let fileName = result.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(fileName);
                let type = match ? `image/${match[1]}` : `image`;
                setIsCamera(false)
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
                setIsCamera(true)
                setFile({ uri: result.uri, name: fileName, type, width: result.width, height: result.height })
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    const save = async (file) => {
        let response, blob;
        if (Object.keys(file).length > 0) {
            response = await fetch(file.uri);
            blob = await response.blob();

            storageRef
                .child(`Life/${base64.encode(new Date().toISOString())}` + `/${file.name}`)
                .put(blob)
                .then(snapShot => {
                    snapShot.ref.getDownloadURL()
                    .then(url => {
                        firebase.firestore()
                        .collection('life')
                        .add({name, content, url, created: moment(new Date()).unix()})
                        .then(ref => {
                            if (ref.id) {
                                callToastWithGravity('Added!', Duration.short, Gravity.bottom);
                                setVisible(false);
                                callback();
                            }
                        })
                    })
                },
                    reject => {
                        console.log(reject.message);
                    })
        }
    }

    return <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        onBackButtonPress={() => {
            setVisible(false);
        }}
        swipeDirection={['down', 'left', 'right', 'up']}
        onSwipeComplete={() => setVisible(false)}
    >
        <View style={ModalStyles.mainView}>
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"}>
                <View style={ModalStyles.contentView}>
                    <View style={ModalStyles.titleModal}>
                        <Text style={ModalStyles.titleText}>Create New</Text>
                    </View>
                    <Text style={ModalStyles.textLabel}>Name</Text>
                    <TextInput placeholder='Title...' placeholderTextColor={placeHolderTextColor} style={ModalStyles.input} onChangeText={name => setName(name)} selectTextOnFocus={true} multiline={true} />
                    <Text style={ModalStyles.textLabel}>Content</Text>
                    <TextInput placeholder='Diary...' placeholderTextColor={placeHolderTextColor} style={ModalStyles.textArea} onChangeText={content => setContent(content)} selectTextOnFocus={true} multiline={true} numberOfLines={6} />
                    <View style={ModalStyles.boxUploadContainer}>
                        <View style={ModalStyles.boxUploadItem}>
                            <View style={ModalStyles.itemColumn}>
                                {
                                    file === null ? <TouchableOpacity onPress={() => pickImage()}>
                                        <FontAwesome name="image" size={25} color='#bd4a20' />
                                    </TouchableOpacity> : !isCamera && <View style={{ width: '100%', height: '100%' }}>
                                        <Image source={{ uri: file.uri }} style={{ width: '100%', height: 50 }} />
                                    </View>
                                }
                            </View>
                            <View style={ModalStyles.itemColumn}>
                                {
                                    file === null ? <TouchableOpacity onPress={() => cameraShot()}>
                                        <FontAwesome name="camera" size={25} color='#bd4a20' />
                                    </TouchableOpacity> : isCamera && <View style={{ width: '100%', height: '100%' }}>
                                        <Image source={{ uri: file.uri }} width="100%" height={50} />
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={ModalStyles.button}
                        onPress={() => save(file)}>
                        <Text style={ModalStyles.textButton}>Create</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    </Modal>
}

New.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired
}

export default New;


const styles = StyleSheet.create({

})