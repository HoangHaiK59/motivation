import * as React from 'react';
import { View, Text, StyleSheet, LogBox, Modal, ScrollView, FlatList, TouchableHighlight, Dimensions } from 'react-native';
import Firebase from '../../firebase';
import { DB } from '../../helper/db';
import { FontAwesome } from '@expo/vector-icons';

// LogBox.ignoreLogs(['Setting a timer']);

const { width, height } = Dimensions.get('window');

class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            visible: false,
        }

        this._isMounted = false;
    }

    handlePressView(router, options) {
        this.props.navigation.navigate(router, {
            data: options
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.day !== this.props.day || nextState !== this.state) {
            return true;
        }
        return false;
    }   

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            Firebase.firestore().collection(DB.activity).get()
                .then(result => {
                    if (result.docs.length > 0) {
                        this.setState({ activity: result.docs.map(doc => ({id: doc.id, ...doc.data()})) })
                    }
                })
        }
    }
    
    componentDidUpdate() {
        Firebase.firestore().collection(DB.activity).get()
        .then(result => {
            if (result.docs.length > 0) {
                this.setState({ activity: result.docs.map(doc => ({id: doc.id, ...doc.data()})) })
            }
        })
    }

    componentWillUnmount() {
        //this.props.processMounting(false)
        this._isMounted = false;
        this.setState = (state,callback) => {
            return;
        };
    }

    render() {
        return (
            <View
                style={styles.container}>
                {
                    this.state.activity && <View style={styles.activityContainer}>
                        {
                            <>
                                <View style={styles.headerContainer}>
                                    <FontAwesome style={{ marginTop: 5 }} name="tasks" size={15} color="#db9e5c" />
                                    <Text style={[styles.header, { marginLeft: 10 }]}>
                                        {
                                            this.state.activity[0].name
                                        }
                                    </Text>
                                </View>
                                <View style={styles.list}>
                                    {
                                        this.state.activity[0].activities.map((activity, id) =>
                                            <View key={id} style={styles.content}>
                                                <View style={styles.left}></View>
                                                <TouchableHighlight style={styles.center} key={id} onPress={() => this.handlePressView('Detail', activity)} >
                                                    <Text numberOfLines={1} ellipsizeMode="head" style={styles.text}>{activity.name}</Text>
                                                </TouchableHighlight>
                                                <Text style={[styles.right, styles.text]}>{activity.time_start} - {activity.time_end + 'h'}</Text>
                                            </View>)
                                    }
                                </View>
                            </>
                        }

                    </View>
                }
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.visible}

                >
                    {
                        this.state.activity && <View style={styles.centerView}>
                            <View style={styles.modalView}>
                                <Text style={styles.text}>
                                    {
                                        this.state.activity[0].activities[0].name
                                    }
                                </Text>
                                <Text style={styles.text}>
                                    Comments
                                </Text>
                                <Text style={styles.text}>
                                    Point
                                </Text>
                                <Text>
                                    {
                                        this.state.activity[0].activities[0].point
                                    }
                                </Text>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.setState({ visible: false })
                                    }}
                                >
                                    <Text style={styles.text}>Close</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    }
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        marginTop: 3
    },
    headerContainer: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    header: {
        color: '#c4c0c0',
        fontSize: 17,
    },
    list: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    left: {
        width: 15,
        borderRadius: 500,
        height: 15,
        backgroundColor: '#295191',
        marginTop: 3
    },
    center: {
        marginLeft: 20,
        width: width - 110,
        overflow: 'hidden'
    },
    right: {
        width: 45,
        textAlign: 'right'
    },
    text: {
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
        borderRadius: 20,
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .25,
        shadowRadius: 3.5,
        elevation: 5,
        width: Dimensions.get('window').width
    }
})

export default Activity;