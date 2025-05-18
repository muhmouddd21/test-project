import { db } from './firebase-config.js';

db.collection('shoes').get().then((snapshot)=>{
    console.log(snapshot);
    
})