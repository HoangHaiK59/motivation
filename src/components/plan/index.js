import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, SectionList, SafeAreaView, TouchableOpacity } from 'react-native';
import * as _ from 'lodash';
import moment from 'moment';
const { width } = Dimensions.get('window');
import base64 from 'base-64';
import Doughnut from '../doughnut';
import { FontAwesome } from '@expo/vector-icons'
import Schedule from './schedule';
import firebase from '../../firebase';
import Text from '../text/regular'
import UpdateProgress from './updateProgress';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { callToastWithGravity, Duration, Gravity } from '../../services/toast';
import { Entypo as Icon } from '@expo/vector-icons';

const Item = React.memo(({ item, index, onUpdateProgress }) => {
    return <TouchableOpacity onPress={() => onUpdateProgress(item)}>
        <View style={styles.sectionItem}>
            <View style={styles.index}>
                <Text style={styles.textIndex}>{index + 1}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.textDes}>{item.content}</Text>
            </View>
            <View style={styles.progress}>
                <Doughnut percentage={item.progress} radius={25} color={'tomato'} delay={500} max={100} />
            </View>
        </View>
    </TouchableOpacity>
})

const ItemDate = React.memo(({ item, index, date, changeDate }) => (
    <TouchableOpacity onPress={() => changeDate(item)}>
        <View key={item.key} style={styles.item}>
            <View style={[styles.children, item.day === date.getDate() && { backgroundColor: '#4c7cf5' }]}>
                <Text style={styles.text}>{item.th}</Text>
                <View style={styles.date}>
                    <Text style={styles.text}>{item.day}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
))



class Plan extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(),
            month: [],
            numInMonth: 0,
            visible: false,
            plan: [],
            updateVisible: false,
            itemUpdate: null
        }

        this.firestore = firebase.firestore();
    }

    /**
     * process show or hide modal
     * @param {boolean} visible 
     */
    handleShowOrClose(visible) {
        this.setState({ visible })
    }

    /**
     * process show or hide modal update
     * @param {boolean} updateVisible 
     */
    handleUpdateShowOrClose(updateVisible) {
        this.setState({ updateVisible })
    }

    setOptions() {
        this.props.navigation.setOptions({
            headerLeftContainerStyle: {
                paddingLeft: 8
            },
            headerRightContainerStyle: {
                paddingRight: 8
            },
            headerTitle: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => back()}>
                    <Icon name='chevron-left' size={25} color='#fff' />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={this.handleShowOrClose.bind(this, true)}>
                    <Icon name='circle-with-plus' size={25} color="#77a3a6" />
                </TouchableOpacity>
            )
        })
    }

    componentDidMount() {
        this.setOptions();
        this.getDayInMonth(this.state.date.getMonth() + 1, this.state.date.getFullYear())
        this.getTodayPlan();
    }

    componentDidUpdate() {
        // this.goIndex();
    }

    getTodayPlan(date = null) {
        this.firestore.collection('plan')
            .where('created', '==', moment(date || this.state.date).format('DD/MM/YYYY'))
            .get()
            .then(snapShot => {
                if (snapShot.docs.length > 0) {
                    this.setState({ plan: [...snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }))] })
                } else {
                    this.setState({ plan: [] })
                }
            })
    }

    onUpdateProgress(item) {
        this.setState({ itemUpdate: item, updateVisible: true })
    }

    async getDayInMonth(month, year) {
        const numDay = new Date(year, month, 0).getDate();
        let monthTemp = _.range(1, numDay + 1);
        // new Date(`${m < 10 ? '0'+ m: m + '/' + month < 10 ? '0' + month : month + '/' + year}`)
        // monthTemp = monthTemp.map(m => ({day: m, th: moment('01/05/2021').format('ddd')}))
        monthTemp = monthTemp.map(m => {
            const dateString = (m < 10 ? `0${m}` : m) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
            return { date: dateString, day: m, th: moment(dateString, 'DD/MM/YYYY').format('ddd'), key: m + moment(dateString, 'DD/MM/YYYY').format('ddd') }
        })
        this.setState({ month: monthTemp, numInMonth: numDay });
    }

    getItemLayout = (data, index) => {
        return { length: 60, offset: 60 * index, index }
    }

    changeDate(item) {
        this.setState({ date: moment(item.date, 'DD/MM/YYYY').toDate() })
        this.getTodayPlan(moment(item.date, 'DD/MM/YYYY').toDate())
    }

    callBackEvent() {
        this.getTodayPlan();
    }

    markAllDone() {
        this.firestore.doc(`plan/${this.state.plan[0].id}`)
            .update({ data: this.state.plan[0].data.map(d => ({ ...d, progress: 100 })) })
            .then(() => {
                callToastWithGravity('Mark all done success!', Duration.short, Gravity.bottom)
                this.getTodayPlan();
            })
            .catch(error => {

            })
    }

    resetProgress() {
        this.firestore.doc(`plan/${this.state.plan[0].id}`)
            .update({ data: this.state.plan[0].data.map(d => ({ ...d, progress: 0 })) })
            .then(() => {
                callToastWithGravity('Reset success!', Duration.short, Gravity.bottom)
                this.getTodayPlan();
            })
            .catch(error => {

            })
    }

    render() {
        const index = this.state.month.findIndex(m => m.day === this.state.date.getDate());
        return (
            <SafeAreaView style={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.calendar}>
                        <FlatList
                            ref={(ref) => this.flatListRef = ref}
                            horizontal
                            data={this.state.month}
                            getItemLayout={this.getItemLayout}
                            initialScrollIndex={index}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => <ItemDate item={item} index={index} date={this.state.date} changeDate={this.changeDate.bind(this)} />}
                        />
                    </View>
                    {
                        this.state.plan.length === 0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>No plan today.</Text>
                            <Text style={{ color: '#e34d4d' }}>Create now !</Text>
                            {/* <TouchableOpacity style={{width: 90, borderRadius: 100, backgroundColor: '#db1616', padding: 4, marginTop: 4}} onPress={this.handleShowOrClose.bind(this, true)}>
                                <Text style={{ color: '#fff' }}>Create now!</Text>
                            </TouchableOpacity> */}
                        </View>
                    }
                    {
                        this.state.plan.length > 0 && <SafeAreaView style={styles.plan}>
                            <SectionList
                                showsVerticalScrollIndicator={false}
                                sections={this.state.plan}
                                keyExtractor={(item) => item.key}
                                renderItem={({ item, index }) => (
                                    <Item item={item} index={index} onUpdateProgress={this.onUpdateProgress.bind(this)} />
                                )}
                                renderSectionHeader={({ section: { title } }) => (
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.text}>{title}</Text>
                                        <Menu >
                                            <MenuTrigger>
                                                <FontAwesome name='ellipsis-v' size={20} color='#fff' />
                                            </MenuTrigger>
                                            <MenuOptions customStyles={optionStyles}>
                                                <MenuOption onSelect={this.markAllDone.bind(this)} text="Mark all done" />
                                                <MenuOption onSelect={this.resetProgress.bind(this)} text="Reset all" />
                                                <MenuOption text="Take a copy" />
                                                <MenuOption text="Delete" />
                                            </MenuOptions>
                                        </Menu>
                                    </View>
                                )}
                            />
                        </SafeAreaView>
                    }
                    {/* <View style={styles.create}>
                        <TouchableOpacity style={styles.createBtn} onPress={this.handleShowOrClose.bind(this, true)}>
                            <View>
                                <FontAwesome color="#77a3a6" size={35} name="plus-circle" />
                            </View>
                        </TouchableOpacity>
                    </View> */}
                </View>
                {
                    this.state.visible && <Schedule
                        date={this.state.date}
                        visible={this.state.visible}
                        setVisible={this.handleShowOrClose.bind(this)}
                        callBackEvent={this.callBackEvent.bind(this)}
                    />
                }
                {
                    this.state.updateVisible && <UpdateProgress
                        visible={this.state.updateVisible}
                        setVisible={this.handleUpdateShowOrClose.bind(this)}
                        schedule={this.state.plan[0]}
                        item={this.state.itemUpdate}
                        callBackEvent={this.callBackEvent.bind(this)}
                    />
                }
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
        paddingTop: 8,
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
        height: 72
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

const optionStyles = {
    optionsContainer: {
        padding: 5,
        width: 120
    },
    optionsWrapper: {
        //backgroundColor: 'purple',
    },
    optionWrapper: {
        //backgroundColor: 'yellow',
        margin: 5,
    },
    optionTouchable: {
        // underlayColor: 'gold',
        activeOpacity: 70,
    },
    optionText: {
        color: 'brown',
    },
}

export default Plan;