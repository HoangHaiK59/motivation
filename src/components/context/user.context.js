import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../firebase';

export const UserContext = React.createContext({
    user: null,
    error: null,
    handleError: () => {}
});

const getUser = async () => {
    const result = await AsyncStorage.getItem('userFirebase');
    return JSON.parse(result)
}

const UserProvider = props => {
    const [user, setUser] = React.useState(getUser());
    const [ error , setError] = React.useState(null);
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setUser(user);
            setError(null)
            if (user) {
                AsyncStorage.setItem('userFirebase', JSON.stringify(user), error => {
                    console.log(error)
                })
            } else {
                AsyncStorage.removeItem('userFirebase') 
            }
        })
    }, [])
    const handleError = error => {
        setError(error);
    }
    return (
        <UserContext.Provider value={{user, error, handleError}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider;