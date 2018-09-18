import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAua1-YKmA1bgNypIEJdhGpvLXkRX-ayms",
  authDomain: "seleqt-393e2.firebaseapp.com",
  databaseURL: "https://seleqt-393e2.firebaseio.com",
  projectId: "seleqt-393e2",
  storageBucket: "seleqt-393e2.appspot.com",
  messagingSenderId: "713899677304"
};
firebase.initializeApp(config);

export default firebase;