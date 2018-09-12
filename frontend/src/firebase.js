import firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDAKAMXyZ36M_qgXTq-x61TN88lP0KsF6s",
    authDomain: "testprojekt1-cecfc.firebaseapp.com",
    databaseURL: "https://testprojekt1-cecfc.firebaseio.com",
    projectId: "testprojekt1-cecfc",
    storageBucket: "testprojekt1-cecfc.appspot.com",
    messagingSenderId: "180590043679"
  };
firebase.initializeApp(config);

export default firebase;