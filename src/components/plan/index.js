import React from 'react';

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as _ from 'lodash';
import moment from 'moment';

class Plan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            month: []
        }
    }

    componentDidMount() {
        this.getDayInMonth(this.state.date.getMonth() + 1, this.state.date.getFullYear())
    }

    getDayInMonth(month, year) {
        const numDay = new Date(year, month, 0).getDate();
        this.setState({month: _.range(1, numDay)});
    }

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.calendar}>
                            {
                                this.state.month.map(v => <View key={v.toString()} style={styles.item}>
                                    <Text style={styles.text}>{moment(new Date(`${v}/${this.state.date.getMonth() + 1}/${this.state.date.getFullYear()}`)).format('dd')}</Text>
                                    <Text style={styles.text}>{v}</Text>
                                </View>)
                            }
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    calendar: {
        display: 'flex',
        flexDirection: 'row'
    },
    item: {
        display: 'flex',
        flexDirection: 'column'
    }
});

export default Plan;