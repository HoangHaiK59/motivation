import React from 'react';
import { SafeAreaView, TextInput, StyleSheet, Button, View, Text, TouchableOpacity } from 'react-native';
import firebase from '../../firebase';

const Authentication = props => {
    const [user, setUser] = React.useState({email: '', password: ''})
    const { context } = props;
    const handleChange = (name = '', text) => {
        setUser({...user, [name]: text})
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
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.text}>Hey,</Text>
                    <Text style={styles.text}>Login now.</Text>
                </View>
                <View style={styles.box2}>
                    <TextInput autoFocus style={styles.input} value={user.email} placeholder="Email" onChangeText={(text) => handleChange('email', text)}/>
                    <TextInput secureTextEntry={true} textContentType="password" autoCapitalize={'none'} value={user.password} style={[styles.input, styles.marginBox]} placeholder="Password" onChangeText={(text) => handleChange('password', text)}/>
                    <TouchableOpacity
                    style={[styles.button, styles.marginBox]}
                    onPress={signIn}
                    >
                        <Text style={styles.textButton}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
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
        fontSize: 40
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        height: 60
    },
    button: {
        height: 60,
        backgroundColor: '#387df5',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    textButton: {
        color: '#fff',
        fontSize: 20,
        textTransform: 'uppercase',
        fontWeight: '400'
    }
})

export default Authentication;