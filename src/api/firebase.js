// src/api/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA9A33X1VjW5VveGN2DBVJV7-8yjR77NyY",
    authDomain: "advanta-report.firebaseapp.com",
    projectId: "advanta-report",
    storageBucket: "advanta-report.appspot.com",
    messagingSenderId: "1049506934296",
    appId: "1:1049506934296:web:b4656d2be9456a1bc21d6d",
    measurementId: "G-ETGNNL41R5"
};

let app;
let auth;
let db;

export const initializeFirebase = () => {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("Firebase Initialized!");
    } else {
        app = getApps()[0];
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("Firebase already initialized.");
    }
};

// Pastikan untuk memanggil initializeFirebase() di awal aplikasi
// export { app, auth, db }; // Ini bisa di-export jika dibutuhkan, tapi lebih baik lewat hooks
export { auth, db }; // Export auth dan db langsung untuk digunakan di api/auth.js dan api/firestore.js