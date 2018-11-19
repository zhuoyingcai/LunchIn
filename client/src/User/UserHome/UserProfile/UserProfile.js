import React, { Component } from "react";
import "./UserProfile.css";
import { firebase as firebaseAuth }  from "../../../Config";
import firebase from "firebase/app";
import 'firebase/auth';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Snackbar,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  AppBar,
  Tooltip
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import SwipeableViews from "react-swipeable-views";
import Visible from "@material-ui/icons/Visibility";
import Hidden from "@material-ui/icons/VisibilityOff";
import Back from "@material-ui/icons/ArrowBack";
import Email from "@material-ui/icons/Email";
import Password from "@material-ui/icons/LockOpen";
import Home from "@material-ui/icons/Home";

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
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      showPassword: false,
      address: "",
      processing: false,
      notify: false,
      notifyMsg: "",
      value: 0,
      message: "Show Password"
    };
    this.submitNewAddress = this.submitNewAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.onChangePasswordPress = this.onChangePasswordPress.bind(this);
    this.onChangeEmailPress = this.onChangeEmailPress.bind(this);
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
    firebaseAuth.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          email: user.email
        });
        firebaseAuth
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
      const addressRef = firebaseAuth
        .database()
        .ref(`Users/${firebaseAuth.auth().currentUser.uid}/address`);
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
    var user = firebaseAuth.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateAndRetrieveDataWithCredential(cred);
  };

  onChangeEmailPress = () => {
    if (this.state.newEmail === this.state.email) {
      this.setState({
        notify: true,
        processing: false,
        notifyMsg:
          "The new email you entered is the same as the current email, please enter a different email.",
        currentPassword: "",
        newEmail: ""
      });
    } else {
      this.reauthenticate(this.state.currentPassword)
        .then(() => {
          var user = firebaseAuth.auth().currentUser;
          user
            .updateEmail(this.state.newEmail)
            .then(() => {
              this.setState({
                notify: true,
                notifyMsg: "Email updated successfully!",
                processing: false,
                currentPassword: "",
                newEmail: ""
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
    }
  };

  onChangePasswordPress = () => {
    if (this.state.currentPassword === this.state.newPassword) {
      this.setState({
        notify: true,
        processing: false,
        notifyMsg:
          "The new password you entered matches the current password, please try again.",
        newPassword: "",
        currentPassword: ""
      });
    } else {
      this.reauthenticate(this.state.currentPassword)
        .then(() => {
          var user = firebaseAuth.auth().currentUser;
          user
            .updatePassword(this.state.newPassword)
            .then(() => {
              this.setState({
                notify: true,
                notifyMsg: "Password updated successfully!",
                processing: false,
                newPassword: "",
                currentPassword: ""
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
    }
  };

  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        <CssBaseline />
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
            <Tab label="User Information Section" />
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
                  color="secondary"
                  className="input-button"
                  onClick={this.submitNewAddress}
                >
                  Update Address
                  <Home style={{ marginLeft: 10 }} />
                </Button>
              </CardContent>
            </Card>
          </TabContainer>
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
                  type={this.state.showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={this.state.message} placement="top">
                          <IconButton
                            onClick={() => {
                              if (this.state.message === "Show Password") {
                                this.setState({
                                  showPassword: !this.state.showPassword,
                                  message: "Hide Password"
                                });
                              } else if (
                                this.state.message === "Hide Password"
                              ) {
                                this.setState({
                                  showPassword: !this.state.showPassword,
                                  message: "Show Password"
                                });
                              }
                            }}
                          >
                            {this.state.showPassword ? <Visible /> : <Hidden />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  className="push-down"
                  disabled={this.state.processing}
                />

                <TextField
                  onChange={this.handleChange("newEmail")}
                  id="email"
                  label="New Email"
                  required
                  value={this.state.newEmail}
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
                  onClick={this.onChangeEmailPress}
                >
                  Change Email
                  <Email style={{ marginLeft: 10 }} />
                </Button>
              </CardContent>
            </Card>
          </TabContainer>
          <TabContainer>
            <Card className="input-paper" data-aos="zoom-in-up">
              <CardContent>
                <TextField
                  onChange={this.handleChange("currentPassword")}
                  id="currentUserPassword"
                  label="Current User Password"
                  required
                  value={this.state.currentPassword}
                  fullWidth
                  type={this.state.showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={this.state.message} placement="top">
                          <IconButton
                            onClick={() => {
                              if (this.state.message === "Show Password") {
                                this.setState({
                                  showPassword: !this.state.showPassword,
                                  message: "Hide Password"
                                });
                              } else if (
                                this.state.message === "Hide Password"
                              ) {
                                this.setState({
                                  showPassword: !this.state.showPassword,
                                  message: "Show Password"
                                });
                              }
                            }}
                          >
                            {this.state.showPassword ? <Visible /> : <Hidden />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  className="push-down"
                  disabled={this.state.processing}
                />

                <TextField
                  onChange={this.handleChange("newPassword")}
                  id="password"
                  label="New Password"
                  required
                  type={this.state.showPassword ? "text" : "password"}
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
                  color="inherit"
                  className="input-button"
                  onClick={this.onChangePasswordPress}
                >
                  Change Password
                  <Password style={{ marginLeft: 10 }} />
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
