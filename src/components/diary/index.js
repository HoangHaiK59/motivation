import React from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import Constants from 'expo-constants';
import * as _ from 'lodash';
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const mapMonth = (month) => {
    const monthArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', "JUL", 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return monthArr.find((str, id) => id === month -1);
}

class Diary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            year: new Date().getFullYear().toString(),
            file: {},
            visible: false,
            month: '',
            months: [],
            show: false
        }
        this.storageRef = Firebase.storage().ref();
        this.firestoreRef = Firebase.firestore();
        this.years = _.range(2020,new Date().getFullYear() + 1, 1)
    }

    getDate() {
        let date = new Date();
        return date.toDateString();
    }

    getMonth() {
        this.firestoreRef.collection(DB.month)
        .orderBy('month')
        .get()
        .then(result => {
            if(result.docs.length > 0) {
                let items = [];
                result.docs.forEach(doc => items.push({id: doc.id, data: doc.data()}));
                this.setState({months: items})
            }
        })
    }

    upload = async (ref, file) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        this.storageRef
        .child('Month' + `/${file.name}`)
        .put(blob)
        .then(snapShot=> {
            this.storageRef
            .child(snapShot.metadata.fullPath)
            .getDownloadURL()
            .then(url => {
                Firebase.firestore().collection(DB.month).doc(ref)
                .set({ 
                    contentType: snapShot.metadata.contentType,
                    fullPath: snapShot.metadata.fullPath,
                    name: snapShot.metadata.name,
                    size: snapShot.metadata.size,
                    timeCreated: snapShot.metadata.timeCreated,
                    updated: snapShot.metadata.updated,
                    index: 1,
                    show: true,
                    url
                })
                .then(refer => {
                    //console.log(refer.id);
                    this.setState({ visible: false });
                })
                .catch(error => console.log(error))
            })

        },
        reject => {
            console.log(reject.message);
        })
    }

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [2, 3],
                quality: 1
            });

            if (!result.cancelled) {
                let fileName = result.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(fileName);
                let type = match ? `image/${match[1]}` : `image`;
                this.setState({file:{ uri: result.uri, name: fileName, type, width: result.width, height: result.height }})
            }

            //console.log(result);
        } catch (error) {
            console.log(error)
        }

    }

    showDatePicker = () => {
        this.setState(state => ({...state, show: !state.show}))
    }

    onChageDate(event, selectedDate) {
        const curDate = selectedDate || new Date();
        const year = moment(curDate).toDate().getFullYear().toString();
        const month = moment(curDate).toDate().getMonth() + 1;
        const day = moment(curDate).toDate().getDate()
        this.firestoreRef.collection(`${DB.diary}/${year}/T${month}`)
        .get()
        .then(querySnapshot => {
            console.log(querySnapshot.size)
            if (querySnapshot.size > 0) {
                this.firestoreRef.doc(`${DB.diary}/${year}/T${month}/${day >= 10 ? day : '0' + day}-${this.mapDay(curDate)}`)
                .get()
                .then(doc => { 
                    if (doc.exists) {
                        this.props.navigation.navigate('Day', {id: doc.id, year, collectionId: `T${month}`, name: this.mapDay(curDate)})
                    }
                })
                .catch(err => console.log(err))
            }
        })
    }

    mapDay = (day) => {
        const arr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const valueId = moment(day, 'DD/MM/YYYY').toDate().getDay() - 1;
        return arr.find((val, id) => id === valueId)
    }

    componentDidMount() {
        this.getMonth();
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={styles.search}>
                        <View style={styles.icon}>
                            <FontAwesome name='search' size={20} color='#fff' />
                        </View>
                        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                            <TextInput placeholder='Search...' placeholderTextColor='#fff' style={styles.textInput} selectTextOnFocus={true} onChangeText={search => this.setState({ search })} />
                        </View>
                    </View>
                    <View style={styles.filter}>
                        <Picker mode={"dropdown"} style={styles.picker} selectedValue={this.state.year}
                            onValueChange={(year, index) => this.setState(state => ({show: false, year }))}>
                            {
                                this.years.map(year => <Picker.Item key={year.toString()} label={year.toString()} value={year.toString()} />)
                            }
                        </Picker>
                    </View>
                    <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false} centerContent={true} contentContainerStyle={{ flexGrow: 1, marginTop: 15 }}>
                        <View style={styles.cardContainer}>
                             {
                                 this.state.months.length > 0 ? this.state.months
                                 .slice(0, +this.state.year < new Date().getFullYear() ? 12: new Date().getMonth() + 1)
                                 .map((month, id) => <TouchableOpacity key={id} onPress={() => this.props.navigation.navigate('Month', {
                                     id: month.id,
                                     month: month.data.month,
                                     name: mapMonth(month.data.month),
                                     year: this.state.year
                                 })}>
                                 <View style={styles.item}>
                                     <Image source={{ uri: month.data.url }} style={{ width: width-85, height: 400, opacity: .5 }}/>
                                     <View style={styles.viewAbs}>
                                        <Text style={styles.textAbs}>{month.data.month}</Text>
                                        <Text style={styles.textAbs}>{mapMonth(month.data.month)}</Text>
                                     </View>
                                 </View>
                             </TouchableOpacity>) : null
                             }
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>Today</Text>
                        <Text style={styles.dateText}>{this.getDate()}</Text>
                    </View>
                    {/* <View style={styles.event}>
                        <TouchableOpacity style={styles.eventIcon} onPress={() => this.setState({visible: true, file: {}})}>
                            <FontAwesome name='pencil' size={19} color='#fff' />
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.event}>
                        <TouchableOpacity style={styles.eventIcon} onPress={() => this.showDatePicker()}>
                            <FontAwesome name='calendar' size={18} color='#fff' />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.show && (
                        <DateTimePicker 
                        testID="dateTimePicker"
                        value={new Date()}
                        mode="date"
                        display="calendar"
                        maximumDate={new Date()}
                        minimumDate={new Date(2020,1,1)}
                        onChange={this.onChageDate.bind(this)}
                        />
                    )
                }
                <Modal visible={this.state.visible} transparent={true} animationType="fade" onRequestClose={() => { }}>
                <View style={styles.centerView}>
                    <View style={styles.modalView}>
                        <TextInput placeholder='Month..' style={styles.input} onChangeText={month => this.setState({ month })} selectTextOnFocus={true}/>
                        {
                            this.state.file !== null && <View style={{ alignSelf: 'center' }}>
                                <Image source={{ uri: this.state.file.uri }} style={{ width: 50, height: 50 }} />
                            </View>
                        }
                        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => this.pickImage()}>
                                <FontAwesome name="image" size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity disabled={(Object.keys(this.state.file).length <= 0 || this.state.month === '') ? true : false} 
                            style={(Object.keys(this.state.file).length > 0 || this.state.month !=='') ? [styles.buttonModal, { alignItems: 'center' }] : [styles.buttonModal, { alignItems: 'center', opacity: .6 }]} 
                            onPress={() => this.upload(this.state.month, this.state.file)}>
                                <Text style={styles.text}>Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonClose, { alignItems: 'center' }]} onPress={() => this.setState({visible: false})}>
                                <Text style={styles.text2}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    search: {
        flexDirection: 'row',
        width: width - 30,
        height: 50,
        marginVertical: 15
    },
    viewAbs: {
        position: 'absolute',
        top: 20,
        left: 10,
        flexDirection: 'column'
    },
    textAbs: {
        color: '#fff',
        fontSize: 22,
        fontWeight: "bold"
    },
    icon: {
        position: 'absolute',
        left: 20,
        top: 10
    },
    textInput: {
        position: 'absolute',
        width: width - 100,
        left: 45,
        top: -18,
        color: '#fff'
    },
    filter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    picker: {
        width: 100,
        height: 30,
        color: '#fff'
    },
    cardContainer: {
        flexDirection: 'row',
        height: 400
    },
    item: {
        width: width - 80,
        height: 400,
        borderRadius: 5,
        marginHorizontal: 10
    },
    bottom: {
        width: width,
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        left: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        width: 200,
        height: 50,
        borderRadius: 200,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600'
    },
    event: {
        width: 50,
        height: 50,
        borderRadius: 200,
        backgroundColor: '#2b58ba',
        marginHorizontal: 10,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    eventIcon: {
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 14
    },
    text2: {
        color: '#c4c0c0',
        fontSize: 14
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    modalView: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 3.5,
        elevation: 5,
        width: width,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    buttonModal: {
        borderRadius: 30,
        backgroundColor: '#3e7cf0',
        width: 80,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonClose: {
        width: 80,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderBottomColor: '#173f6e',
        borderBottomWidth: 2,
        width: Dimensions.get('window').width
    }
});

export default Diary;