import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { ModalStyles, placeHolderTextColor } from '../../common/styles/modal.style';
import base64 from 'base-64';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import firebase from '../../firebase';
import { callToastWithGravity, Duration, Gravity } from '../../services/toast';

const firestore = firebase.firestore();

const Schedule = ({ visible, setVisible }) => {
    const [schedule, setSchedule] = useState(
        {
            key: base64.encode(moment(new Date()).toISOString()),
            title: 'Plan',
            created: moment(new Date()).format('DD/MM/YYYY'),
            data: []
        }
    );
    const handleAddItem = () => {
        setSchedule(schedule => ({
            ...schedule,
            data: [
                ...schedule.data,
                {
                    key: base64.encode(moment(new Date()).toISOString()),
                    name: '',
                    content: '',
                    progress: 0
                }
            ]
        }))
    }
    /**
     * remove item by key
     * @param {string} key 
     */
    const removeItem = (key) => {
        setSchedule(schedule => ({
            ...schedule,
            data: schedule.data.filter(s => s.key !== key)
        }))
    }
    const saveSchedule = () => {
        firestore.collection('plan')
            .add(schedule)
            .then(ref => {
                if (ref.id) {
                    callToastWithGravity('Saved', Duration.short, Gravity.bottom);

                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    /**
     * Process event text change
     * @param {string} text 
     * @param {string} key 
     * @param {string} field
     */
    const onChangeText = (text, key, field) => {
        setSchedule(schedule => ({
            ...schedule,
            data: schedule.data.map(d => {
                if (d.key === key) {
                    return ({...d, [field]: text})
                }
                return d
            })
        }))
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
                {
                    schedule.data.length > 0 && <View style={styles.container}>
                        {
                            schedule.data.map(d => <View key={d.key} style={styles.group}>
                                <View style={styles.item}>
                                    <TextInput placeholder="name" placeholderTextColor={placeHolderTextColor} multiline={true} value={d.name} onChangeText={text => onChangeText(text,d.key,'name')} style={[ModalStyles.input, { width: '100%' }]} />
                                </View>
                                <View style={styles.item}>
                                    <TextInput placeholder="content" placeholderTextColor={placeHolderTextColor} multiline={true} value={d.content} onChangeText={text => onChangeText(text,d.key,'content')} style={[ModalStyles.input, { width: '100%' }]} />
                                </View>
                                <TouchableOpacity onPress={() => removeItem(d.key)}>
                                    <FontAwesome name='minus-circle' size={25} color='#e88c35' />
                                </TouchableOpacity>
                            </View>)
                        }
                    </View>
                }
                <View style={styles.group}>
                    <View style={styles.item}>
                        <TouchableOpacity onPress={handleAddItem} style={[ModalStyles.buttonOther, {width: '100%'}]}>
                            <FontAwesome name='plus-circle' size={30} color='#fff' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        <TouchableOpacity onPress={saveSchedule} style={[ModalStyles.button, {width: '100%'}]}>
                            <FontAwesome name='check-circle' size={30} color='#fff' />
                        </TouchableOpacity>
                    </View>
                </View>
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

Schedule.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired
}

export default Schedule;