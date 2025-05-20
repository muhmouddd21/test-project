 import {initializeApp} from 'firebase/app'
 import{
    getFirestore,collection,getDocs,addDoc
 } from 'firebase/firestore'

const firebaseConfig = {

  apiKey: "AIzaSyBKwseko7JItznt37s6Ed8MX46qD0Nu8Sk",
  authDomain: "jsproj-group.firebaseapp.com",
  projectId: "jsproj-group",
  storageBucket: "jsproj-group.firebasestorage.app",
  messagingSenderId: "857452922932",
  appId: "1:857452922932:web:17a57941d2c2ede533e261",
  measurementId: "G-FSS7ZWQ06C"

};


  initializeApp(firebaseConfig)
  const db = getFirestore();
  export {db,collection,getDocs,addDoc}