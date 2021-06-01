import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';
import { ModalStyles } from '../../common/styles/modal.style';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../../firebase';
import { callToastWithGravity, Duration, Gravity } from '../../services/toast';
import Slider from '@react-native-community/slider';

const firestore = firebase.firestore();

const UpdateProgress = ({ schedule, item, visible, setVisible }) => {
    const [itemState, setItemState] = useState(item);
    const update = () => {

        const data = schedule.data.map(d => {
            if (d.key === itemState.key) {
                return itemState;
            }
            return d;
        })

        firestore.collection('plan')
            .doc(schedule.id)
            .update({ data })
            .then(() => {
                callToastWithGravity('Updated', Duration.short, Gravity.bottom);
            })
            .catch(error => {
                console.log(error)
            })
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
            <View style={ModalStyles.contentView}>
                <View style={styles.group}>
                    <View style={styles.item}>
                        <Slider
                        style={{width: '100%', height: 40}}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={update}>
                    <Text style={ModalStyles.textButton}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
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

UpdateProgress.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired
}

export default UpdateProgress;