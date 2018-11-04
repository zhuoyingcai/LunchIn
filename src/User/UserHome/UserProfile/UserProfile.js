import React, { Component } from "react";
import "./UserProfile.css";
import { firebase } from "../../../Config";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Snackbar,
  TextField,
  Typography,
  Tabs,
  Tab,
  AppBar
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import Back from "@material-ui/icons/ArrowBack";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  );
}

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      address: "",
      newAddress: "",
      processing: false,
      notify: false,
      notifyMsg: "",
      value: 0
    };
    this.submitNewAddress = this.submitNewAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.onChangePasswordPress = this.onChangePasswordPress.bind(this);
    this.reauthenticate = this.reauthenticate.bind(this);
  }
  componentDidMount() {
    this.fetchInitialData();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  fetchInitialData() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref(`Users/${user.uid}`)
          .once(
            "value",
            snapshot => {
              if (snapshot.val() != null) {
                this.setState({
                  name: snapshot.val().name,
                  address: snapshot.val().address
                });
              }
            },
            error => {
              this.setState({
                processing: false,
                notify: true,
                notifyMsg: error.message
              });
            }
          );
      }
    });
  }

  submitNewAddress(e) {
    e.preventDefault();
    if (this.state.address) {
      this.setState({
        address: this.state.address,
        processing: true
      });
      const addressRef = firebase
        .database()
        .ref(`Users/${firebase.auth().currentUser.uid}/address`);
      addressRef
        .set(this.state.address)
        .then(() => {
          this.setState({
            processing: false,
            notify: true,
            notifyMsg: "Email update successfully!"
          });
        })
        .catch(error => {
          this.setState({
            notify: true,
            notifyMsg: error.message,
            processing: false
          });
        });
    }
  }

  reauthenticate = currentPassword => {
    var user = firebase.auth().currentUser;
    console.log(currentPassword);
    console.log(this.state.newPassword);
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    console.log(cred);
    return user.reauthenticateAndRetrieveDataWithCredential(cred);
  };

  onChangePasswordPress = () => {
    this.reauthenticate(this.state.currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(this.state.newPassword)
          .then(() => {
            this.setState({
              notify: true,
              notifyMsg: "Password updated successfully!",
              processing: false
            });
          })
          .catch(error => {
            this.setState({
              notify: true,
              notifyMsg: error.message,
              processing: false
            });
          });
      })
      .catch(error => {
        this.setState({
          notify: true,
          notifyMsg: error.message,
          processing: false
        });
      });
  };

  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        {/*=============WELCOME USER HEADER=============*/}
        <div className="user-header">
          <Typography variant="display2" style={{ flex: 1 }}>
            {this.state.name}
            's Profile
            <Button
              style={{ float: "right" }}
              onClick={() => {
                this.props.history.push(`/user/home`);
              }}
            >
              <Back />
              Back
            </Button>
          </Typography>
        </div>
        <Divider />

        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={3000}
          message={this.state.notifyMsg}
        />
        <AppBar
          className="bar"
          data-aos="zoom-in-up"
          position="static"
          color="default"
        >
          <Tabs
            value={this.state.value}
            onChange={this.handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="User Info" />
            <Tab label="Change Email Section" />
            <Tab label="Change Password Section" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer>
            <Card className="input-paper" data-aos="zoom-in-up">
              <CardContent>
                <TextField
                  id="name"
                  label="Full Name"
                  value={this.state.name}
                  fullWidth
                  className="push-down"
                  InputProps={{
                    readOnly: true
                  }}
                />

                <TextField
                  onChange={this.handleChange("address")}
                  id="address"
                  label="Full Address"
                  required
                  value={this.state.address}
                  fullWidth
                  className="push-down"
                  disabled={this.state.processing}
                />

                <Button
                  style={{
                    float: "right",
                    marginTop: 10
                  }}
                  variant="raised"
                  color="primary"
                  className="input-button"
                  onClick={this.submitNewAddress}
                >
                  Update Address
                </Button>
              </CardContent>
            </Card>
          </TabContainer>
          <TabContainer>{this.state.email}</TabContainer>
          <TabContainer>
            <Card className="input-paper" data-aos="zoom-in-up">
              <CardContent>
                <TextField
                  onChange={this.handleChange("currentPassword")}
                  id="currentPassword"
                  label="Current Password"
                  required
                  value={this.state.currentPassword}
                  fullWidth
                  type="password"
                  className="push-down"
                  disabled={this.state.processing}
                />

                <TextField
                  onChange={this.handleChange("newPassword")}
                  id="password"
                  label="New Password"
                  required
                  type="password"
                  value={this.state.newPassword}
                  fullWidth
                  className="push-down"
                  disabled={this.state.processing}
                />

                <Button
                  style={{
                    float: "right",
                    marginTop: 10
                  }}
                  variant="raised"
                  color="primary"
                  className="input-button"
                  onClick={this.onChangePasswordPress}
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}
export default UserProfile;
