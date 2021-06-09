import React, { useState } from 'react';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { ModalStyles, placeHolderTextColor } from '../../common/styles/modal.style';
import Text from '../text/regular';
import base64 from 'base-64';
import firebase from '../../firebase';
import { callToastWithGravity, Duration, Gravity } from '../../services/toast';

const firestore = firebase.firestore();

const CreateCategory = ({ visible, setVisible, callback }) => {
    const [ name, setName ] = useState('');
    const save = () => {
        const category = {id: base64.encode(name), name};
        firestore.collection('vocabulary_categories')
        .add(category)
        .then(docRef => {
            if (docRef.id) {
                callToastWithGravity('Created!', Duration.short, Gravity.bottom);
                setVisible(false);
                callback();
            }
        })
    }
    return (
        <Modal
        isVisible={visible}
        onBackButtonPress={() => {
            setVisible(false);
        }}
        swipeDirection={['down', 'left', 'right', 'up']}
        onSwipeComplete={() => setVisible(false)}
        >
            <View style={ModalStyles.mainView}>
                <View style={ModalStyles.contentView}>
                    <View style={ModalStyles.titleModal}>
                        <Text style={ModalStyles.titleText}>Create Category</Text>
                    </View>
                    <Text style={ModalStyles.textLabel}>Name</Text>
                    <TextInput
                    style={ModalStyles.input}
                    placeholderTextColor={placeHolderTextColor}
                    onChangeText={name => setName(name)}
                    value={name}
                    />
                    <TouchableOpacity style={ModalStyles.button} onPress={save}>
                        <Text style={ModalStyles.textButton}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

CreateCategory.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired
}

export default CreateCategory;