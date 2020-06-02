import * as React from 'react';
import {
    Button as ButtonModule,
    Dimensions,
    StyleSheet,
    Text, View
} from 'react-native';

import Button from '../button';

const { width: ww, height: wh } = Dimensions.get('screen')

class CardModal extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { modal } = this.props;
        this.modalListenerId = modal.addListener('onAnimate', this.handleAnimation)
    }

    componentWillUnmount() {
        this.modalListenerId?.remove()
    }

    handleAnimation = animatedValue => {
        const { currentModal } = this.props.modal;
        console.info(`${currentModal}:`, animatedValue)
    }

    render() {
        const {
            currentModal,
            closeModal,
            closeModals,
            closeAllModals,
            params: { color },
        } = this.props.modal;

        return (
            <View style={styles.card}>
                <Text style={styles.title(color)}>{currentModal}</Text>
                <Button label="Open" modalToOpen="Modal" color="tomato" />

                <ButtonModule title="Close" onPress={closeModal} color="dodgerblue" />
                <ButtonModule title={`Close all ${currentModal}`} onPress={() => closeModals(currentModal)} color="dodgerblue" />
                <ButtonModule title="Close all modals" onPress={closeAllModals} color="red" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: color => ({
        color,
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 50,
    }),
    card: {
        width: ww * 0.85,
        height: wh * 0.7,
        backgroundColor: 'white',
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
})


export default CardModal;