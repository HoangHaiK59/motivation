import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Statistic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Statistic Work!</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 14,
        color: '#c4c0c0'
    }
});

export default Statistic;