import * as React from 'react';
import { View, Text, StyleSheet, YellowBox, Modal, ScrollView, FlatList, TouchableHighlight, Dimensions } from 'react-native';
import firebase, { getAppName, DB } from '../../firebase';

YellowBox.ignoreWarnings(['Setting a timer']);

class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: null,
            visible: false
        }
    }

    componentDidMount() {
        firebase.firestore(getAppName()).collection(DB.activity).get()
            .then(result => {
                if (result.docs.length > 0) {
                    let activity = [];
                    result.docs.forEach(doc => activity.push(doc.data()));
                    this.setState({ activity })
                }
            })
    }

    render() {
        return (
            <View
                style={styles.container}>
                {
                    this.state.activity && <View style={styles.activityContainer}>
                        {
                            <>
                                <Text style={styles.header}>
                                    {
                                        this.state.activity[0].name
                                    }
                                </Text>
                                <View style={styles.list}>
                                    <FlatList
                                        data={this.state.activity[0].activities.map((activity, id) => ({ ...activity, key: `${id}` }))}
                                        renderItem={({ item }) => <TouchableHighlight onPress={() => this.setState({ visible: true })} >
                                            <Text style={styles.text}>{item.name}</Text>
                                        </TouchableHighlight>}
                                    />
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
        flexDirection: 'column'
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