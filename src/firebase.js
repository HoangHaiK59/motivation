import firebase from 'firebase';

require('firebase/firestore');
require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyCZNJFEhEfu6K379zKgiItnGU-Ng6KOSFQ",
    authDomain: "motivation-b2dcb.firebaseapp.com",
    databaseURL: "https://motivation-b2dcb.firebaseio.com",
    projectId: "motivation-b2dcb",
    storageBucket: "motivation-b2dcb.appspot.com",
    messagingSenderId: "144363705261",
    appId: "1:144363705261:web:b762c516961ff422130724",
    measurementId: "G-C4SB0JVYLL"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export default firebase;