import * as React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetailBook({ route }) {
    const { data } = route.params;
    return(
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image resizeMode="contain" source={{uri: data.image}} style={styles.image}/>
                </View>
                <View style={styles.label}>
                    {
                        data.is_farvorite ? <FontAwesome style={styles.labelItem} name='heart' size={15} color='rgb(214, 49, 19)' />: 
                        <FontAwesome style={styles.labelItem} name='heart' size={15} color='rgb(168, 165, 165)'/>
                    }
                    <Text style={[styles.text, styles.labelItem, {textAlign: 'right'}]}>{data.num_of_page_read}/{data.total_page}</Text>
                </View>
                <View style={styles.commentContainer}>
                    {
                        data.note.map((note, id) => <View key={id} style={styles.commentContent}>
                            <Text style={styles.text}>{note}</Text>
                        </View>)
                    }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    header: {
        marginLeft: 30,
        marginTop: 10,
        width: width - 60,
        height: 'auto'
    },
    image: {
        width: '100%',
        height: 250
    },
    label: {
        flexDirection: 'row',
        width: width - 20,
        marginLeft: 10,
        height: 'auto',
        marginTop: 15
    },
    labelItem: {
        width: '50%'
    },
    commentContainer: {
        flexDirection: 'column',
        width: width,
        height: 'auto',
        marginVertical: 10

    },
    commentContent: {
        width: width,
        height: 'auto',
        borderRadius: 10,
        backgroundColor: '#4d58b8',
        marginVertical: 5
    },
    text: {
        color: '#c4c0c0',
        fontSize: 14
    }
})