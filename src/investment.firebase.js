import firebase from 'firebase';

require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAP-Pxg4SjKF_XX8hnE9O9rW1UfQ0ZNu20",
    authDomain: "journey-to-happiness.firebaseapp.com",
    databaseURL: "https://journey-to-happiness-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "journey-to-happiness",
    storageBucket: "journey-to-happiness.appspot.com",
    messagingSenderId: "84034544332",
    appId: "1:84034544332:web:48841ba7a04b39a4d3d869",
    measurementId: "G-W62THW2KRD"
};

var investFb = firebase.initializeApp(firebaseConfig, 'invest')

export default investFb;
