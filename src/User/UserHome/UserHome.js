import React, { Component } from "react";
import "./UserHome.css";
import Review from "./Review/Review";
import { firebase } from "../../Config";
import { Typography, Divider, Button } from "@material-ui/core";
import Logout from "@material-ui/icons/ExitToApp";
import UserInputFoodChoices from './UserInputFoodChoices/UserInputFoodChoices.js';

class UserHome extends Component {
  constructor(props) {
    super(props);
    console.log('hello world user home');
    fetch('/api/yelp').then(response => response.json()).then(data => console.log(data)).catch(e => console.log('Yelp doesnt work', e));
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
<<<<<<< HEAD
        <Review term="Pizza" location="New York, NY"/>
=======
        <UserInputFoodChoices userUID={this.state.user.userUID}/>
>>>>>>> 5b327e5cc336d47aa4b8c660263689a9fbbb6917
      </div>
    );
  }
}

export default UserHome;
