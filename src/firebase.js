import * as firebase from 'firebase';
require('firebase/firestore');

const firebaseConfig = {     
    apiKey : "AIzaSyCZNJFEhEfu6K379zKgiItnGU-Ng6KOSFQ" ,    
    authDomain : "motivation-b2dcb.firebaseapp.com" , 
    databaseURL : "https://motivation-b2dcb.firebaseio.com" ,     
    projectId : "motivation-b2dcb" ,     
    storageBucket : "motivation-b2dcb.appspot.com" ,     
    messagingSenderId : "144363705261 " ,     
    appId : " 1: 144363705261: web: 88042707c7104c06130724 " ,     
    measurementId : " G-66GKN8R0BR " 
};

firebase.initializeApp(firebaseConfig);

export const DB = {
    activity: 'activity',
    book: 'book',
    creative: 'creative',
    diary: 'diary',
    relax: 'relax',
    sport: 'sport',
    task: 'task',
    travel: 'travel'
};

const appName = 'motivation';

export const getAppName = () => {
    return firebase.app(appName);
}

export default firebase;