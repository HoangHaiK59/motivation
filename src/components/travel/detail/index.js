import * as React from 'react';
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import firebase, { getAppName, DB } from '../../../firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function DetailTravel({ route }) {
    const [items, setItems] = React.useState([]);
    const [urls, setUrls] = React.useState([]);
    const { params } = route;
    function forEachPromise(items, fn) {
        return items.reduce(function (promise, item) {
            return promise.then(function () {
                return fn(item)
            })
        }, Promise.resolve())
    }

    function getItem(item) {
        return new Promise((resolve, reject) => {
            console.log(item);
            resolve();
        })
    }

    React.useEffect(() => {
        let items = [];
        firebase.storage(getAppName()).ref(params.ref)
            .listAll()
            .then(result => {
                if (result.items.length > 0) {
                    var promises = [];
                    promises = result.items.map(item => {
                        return firebase.storage(getAppName()).ref(item.fullPath).getDownloadURL()
                            .then(url => {
                                return url;
                            })
                    })

                    Promise.all(promises).then(urls => {
                        setUrls(urls);
                    });

                    items = result.items.map(item => {
                        return { name: item.name, fullPath: item.fullPath, nameNoExtension: item.name.slice(0, item.name.length - 4) }
                    });

                    setItems(items);
                }
            }
            )
    }, []);
    return (
        <View style={styles.mainContainer}>

                {
                    items.length > 0 ? <View style={styles.container}>
                        {
                            items.map((item, id) => <View key={id} style={styles.item}>
                                <Image style={styles.image} source={{ uri: urls[id] }} />

                            </View>)
                        }
                    </View> :
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.text]}>No image to show</Text>
                        </View>
                }

            <TouchableOpacity style={styles.bottom} onPress={() => {}}>
                <FontAwesome name='plus' size={30} color='red' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        marginVertical: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    childContainer: {
        marginVertical: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bottom: {
        position: 'absolute',
        bottom: 20,
        right: 30,
        zIndex: 2
    },
    item: {
        width: 100,
        height: 120,
        marginHorizontal: 5,
        marginVertical: 5
    },
    image: {
        width: 100,
        height: 100
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
})