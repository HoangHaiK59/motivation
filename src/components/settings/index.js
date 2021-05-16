import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import firebase from '../../firebase';

export default function Settings(props) {
    const signOut = () => {
        firebase.auth().signOut();
    }
    const { context } = props;
    return (
        <ScrollView  showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, flexGrow: 1, paddingHorizontal: 10 }}>
            <View style={styles.container}>
                <Text style={styles.textHighlight}>Account</Text>
                <View style={[styles.box, {marginTop: 10}]}>
                    <View style={styles.avatar}>
                        <Text style={styles.text}>{context.user.email.slice(0,2).toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={[styles.textHighlight, {marginTop: 10}]}>Other</Text>
                <TouchableOpacity onPress={signOut} style={{marginTop: 10}}>
                    <View style={styles.button}>
                        <Text style={styles.text}>Sign out</Text>
                        <Text style={styles.textDescription}>You are logged in as {context.user.email}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column'
    },
    text: {
        color: '#fff',
        fontSize: 18
    },
    textDescription: {
        color: '#fff',
        fontSize: 12
    },
    textHighlight: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    box: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 500,
        backgroundColor: '#de6845',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})