import React, { Component } from "react";
import "./UserHome.css";
import { firebase } from "../../Config";
import { Typography, Divider, Button } from "@material-ui/core";
import Logout from "@material-ui/icons/ExitToApp";
import CssBaseline from "@material-ui/core/CssBaseline";
import UserInputFoodChoices from "./UserInputFoodChoices/UserInputFoodChoices.js";
import Profile from "@material-ui/icons/Person";

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userUID: "",
        userName: ""
      }
    };
    this.firebaseListener = null;
  }
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: {
            userUID: user.uid
          }
        });
      }
      firebase
        .database()
        .ref(`Users/${user.uid}/name`)
        .once(
          "value",
          snapshot => {
            if (snapshot.val() != null) {
              this.setState({
                userName: snapshot.val()
              });
            }
          },
          error => {
            console.log("Error: " + error.code);
          }
        );
    });
  }

  componentWillUnmount() {
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }

  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        <CssBaseline />
        {/*=============WELCOME USER HEADER=============*/}
        <div className="user-header">
          <Typography component="h2" variant="h3" style={{ flex: 1 }}>
            Welcome, {this.state.userName}
            <Button
              style={{ float: "right" }}
              onClick={() => {
                firebase.auth().signOut();
              }}
            >
              <Logout style={{ marginRight: "5px" }} /> Signout
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={() => {
                this.props.history.push(`/user/profile`);
              }}
            >
              <Profile /> Profile
            </Button>
          </Typography>
        </div>
        <Divider />
        <UserInputFoodChoices userUID={this.state.user.userUID} />
      </div>
    );
  }
}

export default UserHome;
