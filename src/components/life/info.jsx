import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from '../../firebase';
import Cover from '../common/cover';
import Content from './content';
import { useValue } from 'react-native-reanimated';
import Constants from 'expo-constants'

const firestore = firebase.firestore();

const Story = ({route, navigation}) => {
    const {id} = route.params;
    const [style, setStyle] = React.useState(null);
    const animatedValue = useValue(0);
    React.useEffect(() => {
        getStory()
    }, [])
    const getStory = () => {
        firestore.doc(`life/${id}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                setStyle({item: doc.data(), header: doc.data().name, cover: {uri: doc.data().url}});
            }
        })
    }

    return (
        <View style={styles.main}>
            {
                style && <View style={styles.container}>
                    <Cover {...{ animatedValue, style }} />
                    <Content {...{ animatedValue, style }} />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flexGrow: 1,
        paddingTop: Constants.statusBarHeight
    },
    container: {
        flexGrow: 1,
        flexDirection: 'column'
    },
})

export default Story