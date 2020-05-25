import * as React from 'react';

import { View, Text, StyleSheet } from 'react-native';

class Maxim extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Maxim</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
});

export default Maxim;