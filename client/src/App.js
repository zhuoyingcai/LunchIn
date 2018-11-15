import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import UserRoutes from "./User/UserRoutes.js";
import Home from "./Home/Home.js";
import Signup from "./Home/Signup/Signup.js";
import { firebase } from "./Config";

class App extends Component {
  constructor(props) {
    super(props);
    // console.log(process.env);
    this.authListener = this.authListener.bind(this);
    this.firebaseListener = null;
    this.history = createHistory();
    this.state = {
      loggedIn: false,
      userType: null,
      lastLocation: "init"
    };
  }
  componentDidMount() {
    this.authListener();
    this.history.listen((loc, act) => {
      if (this.state.lastLocation === "/sign-up") {
        if (firebase.auth().currentUser) {
          firebase
            .database()
            .ref(`Users/${firebase.auth().currentUser.uid}/type`)
            .once("value", snap => {
              if (!snap.val()) {
                firebase.auth().currentUser.delete();
              }
            });
        }
        window.location.reload();
      }
      this.setState({
        lastLocation: loc.pathname
      });
    });
  }
  authListener() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loggedIn: true
        });
        /*
                    User is logged in, check type and redirect here
                    How to redirect -- this.history.push('/sign-up');
                */
        firebase
          .database()
          .ref(`Users/${user.uid}/type`)
          .once("value", snap => {
            if (snap.val()) {
              const userType = snap.val();
              if (userType === "user") {
                this.history.push(`/user/home`);
              }
              this.setState({
                userType: userType
              });
            }
          });
      } else {
        this.setState({
          loggedIn: false,
          userType: null
        });
        this.history.push("/");
      }
    });
  }
  componentWillUnmount() {
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }
  render() {
    return (
      <Router history={this.history}>
        <div style={{ width: "100%", height: "100%" }}>
          <Switch>
            <Route
              exact
              path="/"
              render={props => {
                return (
                  <Home
                    {...props}
                    userType={this.state.userType}
                    loggedIn={this.state.loggedIn}
                  />
                );
              }}
            />
            <Route path="/sign-up" component={Signup} />
            <Route path="/user" component={UserRoutes} />>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
