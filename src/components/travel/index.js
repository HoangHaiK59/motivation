import * as React from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase, { getAppName } from '../../firebase';
import { FontAwesome } from '@expo/vector-icons';


class Travel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            folders: []
        }

        this.storageRef = firebase.storage().ref();
    }

    getAll() {
        this.storageRef.listAll()
        .then(result => {
            var folders = [];
            result.prefixes.forEach(folder => {
                // var items = [];
                // firebase.storage(getAppName()).ref(folder.name).listAll()
                // .then(res => {
                //     res.items.forEach(item => items.push({ 
                //         name: item.name, 
                //         fullPath: item.fullPath, 
                //         getDownloadURL: item.getDownloadURL(),
                //         getMetadata: item.getMetadata(),
                //         parent: item.parent.name
                //     }));

                // })
                //folders.push({name: folder.name, items})
                folders.push(folder.name)
            })
            this.setState({ folders })
        })
        .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getAll();
    }

    render() {
        return(
            <View style={styles.container}>
                {
                    this.state.folders.length > 0 && <View style={styles.travelContainer}>
                        {
                            this.state.folders.map((folder, id) => <View key={id} style={styles.item}>
                                <View style={{ alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Detail Travel', {ref: folder, title: folder})}>
                                        <FontAwesome name="folder" size={55} color='#eda32b'/>
                                    </TouchableOpacity>
                                </View>
                                <Text ellipsizeMode={"tail"} style={[styles.text, styles.textStyle]}>{folder}</Text>
                            </View>)
                        }
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    travelContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        marginHorizontal: 5
    },
    item: {
        width: 70,
        height: 80,
        marginHorizontal: 5,
        marginVertical: 5
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    textStyle: {
        overflow: 'hidden',
        textAlign: 'center'
    }
})

export default Travel;