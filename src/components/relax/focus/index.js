import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList } from 'react-native';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import Constants from 'expo-constants';

const Item = ({title}) => (
    <View style={styles.item}>
        <Text style={[ styles.title]}>{title}</Text>
    </View>
)

class Focus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        }

        this.firebaseRef = Firebase.firestore().collection(DB.relax);
    }

    getFocus() {
        this.firebaseRef.where('type', '==', 'focus')
        .get()
        .then(result => {
            let items = [];
            if(result.docs.length > 0) {
                result.forEach(doc => items.push({id: doc.id, ...doc.data()}));
                this.setState({ items })
            }
        })
    }

    componentDidMount() {
        this.getFocus();
    }
    
    render() {
        return(
            <SafeAreaView style={styles.container}>
                <SectionList
                    sections={[
                        {
                            title: 'Focus',
                            data: this.state.items
                        }
                    ]}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => <Item title={item.name} />}
                    renderSectionHeader={({ section: { title } }) => (<Text style={[styles.text, styles.header]}>{title}</Text>)}
                />
            </SafeAreaView>
        )
    }
}

export default Focus;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        marginHorizontal: 16
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    item: {
        backgroundColor: '#93a0f5',
        padding: 20,
        marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 24
    }
})