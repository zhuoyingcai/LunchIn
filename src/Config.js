import * as firebaseInitial from "firebase";
import AOS from "aos";
import "../node_modules/aos/dist/aos.css";

const aos = AOS.init();

const firebase = firebaseInitial.initializeApp({
    apiKey: "AIzaSyAiW-TzPFXngSQchx5IEJq1hjLB7kLFkN4",
    authDomain: "lunchin-9fe27.firebaseapp.com",
    databaseURL: "https://lunchin-9fe27.firebaseio.com",
    projectId: "lunchin-9fe27",
    storageBucket: "lunchin-9fe27.appspot.com",
    messagingSenderId: "214952763354"
  });

export { firebase, aos };
