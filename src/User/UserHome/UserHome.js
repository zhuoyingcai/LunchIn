import React, { Component } from "react";
import "./UserHome.css";
import * as firebase from "firebase";
import { Typography, Divider, Button } from "@material-ui/core";
import Logout from "@material-ui/icons/ExitToApp";
import UserInputFoodChoices from './UserInputFoodChoices/UserInputFoodChoices.js';

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
            userName: user.displayName,
            userUID: user.uid
          }
        });
      }
    });
  }

  componentWillUnmount() {
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }
  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        {/*=============WELCOME USER HEADER=============*/}
        <div className="user-header">
          <Typography variant="display2" style={{ flex: 1 }}>
            Welcome, {this.state.user.userName}
            <Button
              style={{ float: "right" }}
              onClick={() => {
                firebase.auth().signOut();
              }}
            >
              <Logout style={{ marginRight: "5px" }} /> Signout
            </Button>
          </Typography>
        </div>
        <Divider />
        <UserInputFoodChoices userUID={this.state.user.userUID}/>
      </div>
    );
  }
}

export default UserHome;
