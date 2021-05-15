import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const UserContext = React.createContext({
    user: null,
    error: null,
    handleError: () => {}
});

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
                localStorage.removeItem('userFirebase') 
            }
        })
    }, [])
    const handleError = error => {
        setError(error);
    }
    const getUser = async () => {
        return await AsyncStorage.getItem('userFirebase');
    }
    return (
        <UserContext.Provider value={{user, error, handleError}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider;