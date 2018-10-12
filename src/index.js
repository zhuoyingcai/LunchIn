import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import * as firebase from "firebase";
import AOS from "aos";
import "../node_modules/aos/dist/aos.css";

AOS.init();
var config = {
  apiKey: "AIzaSyAiW-TzPFXngSQchx5IEJq1hjLB7kLFkN4",
  authDomain: "lunchin-9fe27.firebaseapp.com",
  databaseURL: "https://lunchin-9fe27.firebaseio.com",
  projectId: "lunchin-9fe27",
  storageBucket: "lunchin-9fe27.appspot.com",
  messagingSenderId: "214952763354"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
