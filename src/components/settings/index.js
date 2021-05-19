import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import firebase from '../../firebase';
import { useTheme } from '@react-navigation/native';

export default function Settings(props) {
    const { colors, dark } = useTheme();
    const signOut = () => {
        firebase.auth().signOut();
    }
    const { context } = props;
    return (
        <ScrollView  showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginTop: 10, flexGrow: 1, paddingHorizontal: 10 }}>
            <View style={styles.container}>
                <Text style={[styles.textHighlight, {color: colors.text}]}>Account</Text>
                <View style={[styles.box, {marginTop: 10}]}>
                    <View style={styles.avatar}>
                        <Text style={[styles.text, {color: colors.text}]}>{context.user.email.slice(0,2).toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={[styles.textHighlight, {marginTop: 10,color: colors.text}]}>Device</Text>
                <View style={[styles.split, {marginTop: 10}]}>
                    <Text style={[styles.text, {color: colors.text}]}>
                        Dark Theme
                    </Text>
                    <Switch
                    trackColor={{false: colors.text, true: colors.text}}
                    thumbColor={dark ? '#fff': '#000'}
                    onValueChange={() => context.setThemeProvider(!dark)}
                    value={dark}
                    />
                </View>
                <Text style={[styles.textHighlight, {marginTop: 10,color: colors.text}]}>Other</Text>
                <TouchableOpacity onPress={signOut} style={{marginTop: 10}}>
                    <View style={styles.button}>
                        <Text style={[styles.text, {color: colors.text}]}>Sign out</Text>
                        <Text style={[styles.textDescription, {color: colors.text}]}>You are logged in as {context.user.email}</Text>
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
        fontSize: 18
    },
    textDescription: {
        fontSize: 12
    },
    textHighlight: {
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
    },
    split: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    }
})