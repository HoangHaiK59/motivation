import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../firebase';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const UserContext = React.createContext({
    user: null,
    error: null,
    handleError: () => {},
    theme: null,
    setThemeProvider: () => {}
});

const getUser = async () => {
    const result = await AsyncStorage.getItem('userFirebase');
    return JSON.parse(result)
}

const getTheme = async () => {
    const result = await AsyncStorage.getItem('theme');
    console.log(JSON.parse(result))
    return JSON.parse(result)
}

const UserProvider = props => {
    const [user, setUser] = React.useState(getUser());
    const [ error , setError] = React.useState(null);
    const [ theme , setTheme] = React.useState(DarkTheme);
    React.useEffect(() => {
        getTheme();
    },[])
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setUser(user);
            setError(null)
            if (user) {
                AsyncStorage.setItem('userFirebase', JSON.stringify(user))
            } else {
                AsyncStorage.removeItem('userFirebase') 
            }
        })
    }, [])
    const handleError = error => {
        setError(error);
    }
    const getTheme = async () => {
        const result = await AsyncStorage.getItem('theme');
        setTheme(JSON.parse(result))
    }
    const setThemeProvider = (isDark = true) => {
        if(isDark) {
            setTheme(DarkTheme);
            AsyncStorage.setItem('theme', JSON.stringify(DarkTheme))
        } else {
            setTheme(DefaultTheme);
            AsyncStorage.setItem('theme', JSON.stringify(DefaultTheme))
        }
    }
    return (
        <UserContext.Provider value={{user, error, handleError, theme, setThemeProvider}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider;