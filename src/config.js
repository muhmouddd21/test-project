 import {initializeApp} from 'firebase/app'
 import{
    getFirestore,collection,getDocs,addDoc
 } from 'firebase/firestore'

const firebaseConfig = {

    apiKey: "AIzaSyARS1Jzh_fjTXY6tUZPwYUbsjmsD-R2P7g",
    authDomain: "mahmoud-testing.firebaseapp.com",
    projectId: "mahmoud-testing",
    storageBucket: "mahmoud-testing.firebasestorage.app",
    messagingSenderId: "784858890781",
    appId: "1:784858890781:web:bfde83d2a38b24f48b3cf4",
    measurementId: "G-W6HNRR9RZ5"
  
  };

  initializeApp(firebaseConfig)
  const db = getFirestore();
  export {db,collection,getDocs,addDoc}