import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, Dimensions } from 'react-native';
import Firebase from '../../../firebase';
import { DB } from '../../../helper/db';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { ItemStyles } from '../../../common/styles/list-item.style';

const Item = ({ title, index, created }) => (
    // <View style={styles.row}>
    //     <View style={styles.cell}>
    //         <Text style={[styles.text, {fontSize: 15}, styles.index]}>{index}</Text>
    //     </View>
    //     <View style={[styles.cell, {flex: 1}]}>
    //         <Text style={[styles.title]}>{title}</Text>
    //         <Text style={[styles.title]}>{created}</Text>
    //     </View>
    //     <View style={[styles.cell]}>
    //         <Icon  name='more-vertical' size={20} color='#fff' />
    //     </View>
    // </View>
    <View style={ItemStyles.sectionItem}>
        <View style={ItemStyles.index}>
            <Text style={ItemStyles.textIndex}>{index}</Text>
        </View>
        <View style={ItemStyles.content}>
            <Text style={ItemStyles.text}>{title}</Text>
            <Text style={ItemStyles.textDes}>{created}</Text>
        </View>
        <View style={ItemStyles.progress}>
            <Icon  name='more-vertical' size={20} color='#fff' />
        </View>
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
                if (result.docs.length > 0) {
                    result.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
                    this.setState({ items })
                }
            })
    }

    componentDidMount() {
        this.getFocus();
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <SectionList
                    sections={[
                        {
                            title: 'Focus',
                            data: this.state.items
                        }
                    ]}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => <Item index={index + 1} title={item.name} created={item.created} />}
                    renderSectionHeader={({ section: { title } }) => (<Text style={[styles.text, styles.header]}>{title}</Text>)}
                />
            </SafeAreaView>
        )
    }
}

export default Focus;

const styles = StyleSheet.create({
    container: {
        paddingVertical: Constants.statusBarHeight,
        flexGrow: 1,
        marginHorizontal: 16
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    },
    item: {
        //backgroundColor: '#93a0f5',
        padding: 20,
        marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 15,
        color: "#b2b3b4"
    },
    row: {
        flexDirection: "row",
        backgroundColor: "transparent",
    },
    cell: {
        padding: 16,
        justifyContent: "center",
    },
    index: {
        color: "#b2b3b4"
    },
})