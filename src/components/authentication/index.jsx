import React from 'react';
import { SafeAreaView, TextInput, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import firebase from '../../firebase';
import Constants from 'expo-constants'

const Authentication = props => {
    const [user, setUser] = React.useState({ email: '', password: '' })
    const { context } = props;
    const handleChange = (name = '', text) => {
        setUser({ ...user, [name]: text })
    }
    const signIn = async () => {
        await firebase.auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(
                user => {
                    context.handleError(null)
                }
            ).catch(error => {
                context.handleError(error)
            })

        // await firebase.auth().signOut();
    }
    return (
        <SafeAreaView style={{ flexGrow: 1, marginTop: Constants.statusBarHeight + 5 }}>
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={[styles.box, { justifyContent: 'center' }]}>
                        <Text style={[styles.text, {fontWeight: '700'}]}>Let's sign you in.</Text>
                        <Text style={styles.textNotify}>Welcome back</Text>
                        <Text style={styles.textNotify}>You've been miessed!</Text>
                    </View>
                    <View style={[styles.box2, { justifyContent: 'center' }]}>
                        <TextInput placeholderTextColor="#949999" autoFocus style={styles.input} value={user.email} placeholder="Email" onChangeText={(text) => handleChange('email', text)} />
                        <TextInput placeholderTextColor="#949999" secureTextEntry={true} textContentType="password" autoCapitalize={'none'} value={user.password} style={[styles.input, styles.marginBox]} placeholder="Password" onChangeText={(text) => handleChange('password', text)} />
                    </View>
                    <View style={[styles.box, { justifyContent: 'flex-end' }]}>
                        <TouchableOpacity
                            style={[styles.button, styles.marginBox]}
                            onPress={signIn}
                        >
                            <Text style={styles.textButton}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        paddingVertical: 10,
        display: 'flex',
        flexDirection: 'column'
    },
    box: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    box2: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    marginBox: {
        marginTop: 15
    },
    text: {
        color: '#fff',
        fontSize: 36
    },
    textNotify: {
        color: '#fff',
        fontSize: 30
    },
    input: {
        backgroundColor: '#1d1f1f',
        borderRadius: 5,
        height: 60,
        paddingHorizontal: 8,
        color: '#949999'
    },
    button: {
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 5
    },
    textButton: {
        color: '#000',
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: '400'
    }
})

export default Authentication;