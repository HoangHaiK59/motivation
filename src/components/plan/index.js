import React from 'react';

import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions, SectionList, SafeAreaView, TouchableOpacity } from 'react-native';
import * as _ from 'lodash';
import moment from 'moment';
const { width } = Dimensions.get('window');
import base64 from 'base-64';
import Doughnut from '../doughnut';
import { FontAwesome } from '@expo/vector-icons'

const Item = ({item, index}) => {
    return <View style={styles.sectionItem}>
        <View style={styles.index}>
            <Text style={styles.textIndex}>{index + 1}</Text>
        </View>
        <View style={styles.content}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.textDes}>{item.content}</Text>
        </View>
        <View style={styles.progress}>
            <Doughnut percentage={50} radius={25} color={'tomato'} delay={500} max={100} />
        </View>
    </View>
}

class Plan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            month: [],
            numInMonth: 0,
            plan: [
                {
                    key: base64.encode('12321321132'),
                    title: 'Plan',
                    data: [
                        {key: base64.encode('abd'), name: 'Water', content: '6 cups of day', progress: 0},
                        {key: base64.encode('abc'), name: 'Sleep', content: '8 hours a day', progress: 0},
                        {key: base64.encode('abcde'), name: 'Running', content: '2km', progress: 0},
                        {key: base64.encode('abcdef'), name: 'Walking', content: '4000 steps', progress: 0},
                        {key: base64.encode('123456'), name: 'Reading Book', content: '30 pages', progress: 0}
                    ]
                }
            ]
        }
    }

    componentDidMount() {
        this.getDayInMonth(this.state.date.getMonth() + 1, this.state.date.getFullYear())
    }

    componentDidUpdate() {
        // this.goIndex();
    }

    async getDayInMonth(month, year) {
        const numDay = new Date(year, month, 0).getDate();
        let monthTemp = _.range(1, numDay + 1);
        // new Date(`${m < 10 ? '0'+ m: m + '/' + month < 10 ? '0' + month : month + '/' + year}`)
        // monthTemp = monthTemp.map(m => ({day: m, th: moment('01/05/2021').format('ddd')}))
        monthTemp = monthTemp.map(m => {
            const dateString = (m < 10 ? `0${m}`: m) + '/' + (month < 10 ? '0' + month: month) + '/' + year;
            return {day: m, th: moment(dateString, 'DD/MM/YYYY').format('ddd'), key: m + moment(dateString, 'DD/MM/YYYY').format('ddd')}
        })
        this.setState({ month: monthTemp, numInMonth: numDay });
    }

    getItemLayout = (data, index) => {
        return {length: 60, offset: 60 * index, index}
    }

    render() {
        const index = this.state.month.findIndex(m => m.day === this.state.date.getDate());
        return (
            <SafeAreaView style={{flexGrow: 1}}>
                <View style={styles.container}>
                    <View style={styles.calendar}>
                        <FlatList
                        ref={(ref) => this.flatListRef = ref}
                        horizontal
                        data={this.state.month}
                        getItemLayout={this.getItemLayout}
                        initialScrollIndex={index}
                        renderItem={({item, index}) => (<View key={item.key} style={styles.item}>
                                    <View style={[styles.children, item.day === this.state.date.getDate() && {backgroundColor: '#4c7cf5'}]}>
                                        <Text style={styles.text}>{item.th}</Text>
                                        <View style={styles.date}>
                                            <Text style={styles.text}>{item.day}</Text>
                                        </View>
                                    </View>
                                </View>)}
                        />
                    </View>
                    <SafeAreaView style={styles.plan}>
                        <SectionList 
                            sections={this.state.plan}
                            keyExtractor={(item) => item.key}
                            renderItem={({item, index}) => (
                                <Item item={item} index={index} />
                            )}
                            renderSectionHeader={({section: {title}}) => (
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.text}>{title}</Text>
                                    <Text style={styles.text}>More</Text>
                                </View>
                            )}
                        />
                    </SafeAreaView>
                    <View style={styles.create}>
                        <TouchableOpacity style={styles.createBtn}>
                            <View>
                                <FontAwesome color="#77a3a6" size={35} name="plus-circle" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 8,
        position: 'relative',
        paddingTop:8,
        paddingBottom: 16
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    textDes: {
        color: '#c4c0c0',
        fontSize: 12
    },
    calendar: {
        display: 'flex',
        flexDirection: 'row',
        height: 64
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60
    },
    children: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 500,
    },
    date: {
        borderRadius: 500,
        width: 30,
        height: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    plan: {
        flex: 1,
        paddingHorizontal: 8,
        marginTop: 10
    },
    sectionItem: {
        display: 'flex',
        flexDirection: 'row',
        height: 65,
        paddingVertical: 10,
        marginVertical: 8,
        backgroundColor: '#2e2d2d',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 8
    },
    index: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.35,
        backgroundColor: '#9dafed',
        height: 45,
        borderRadius: 10
    },
    content: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 5
    },
    progress: {
        flex: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 100
    },
    sectionHeader: {
        display: 'flex',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    sectionHeaderLeft: {
    },
    sectionHeaderRight: {
    },
    textIndex: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    create: {
        width: 80,
        position: 'absolute',
        bottom: 5,
        left: (width - 80) / 2
    },
    createBtn: {
        width: '100%',
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Plan;