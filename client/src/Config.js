import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import AOS from "aos";
import "../node_modules/aos/dist/aos.css";

const aos = AOS.init();

const firebaseInitial = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  });

export { firebaseInitial as firebase, aos };
