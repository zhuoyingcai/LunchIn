import React, { Component } from "react";
import "./UserProfile.css";
import { firebase as firebaseAuth } from "../../../Config";
import firebase from "firebase/app";
import "firebase/auth";
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
import Geocode from "react-geocode";

function TabContainer({ children, dir }) {
  return (
    <Typography component="h2" dir={dir}>
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
      oldAddress: "",
      address: "",
      lat: 0,
      lng: 0,
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
                  address: snapshot.val().address,
                  oldAddress: snapshot.val().address,
                  lat: snapshot.val().lat,
                  lng: snapshot.val().lng
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
    if (this.state.address === "") {
      this.setState({
        processing: false,
        notify: true,
        notifyMsg: "Address cannot be blank"
      });
    }
    if (this.state.address) {
      if (this.state.address === this.state.oldAddress) {
        this.setState({
          processing: false,
          notify: true,
          notifyMsg:
            "The new address you entered is the same as the current address, please enter a different address"
        });
      } else {
        Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
        Geocode.fromAddress(this.state.address).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;

            this.setState({
              oldAddress: this.state.address,
              processing: true
            });

            const addressRef = firebase
              .database()
              .ref(`Users/${firebase.auth().currentUser.uid}/address`);

            const latRef = firebase
              .database()
              .ref(`Users/${firebase.auth().currentUser.uid}/lat`);

            const lngRef = firebase
              .database()
              .ref(`Users/${firebase.auth().currentUser.uid}/lng`);

            addressRef.set(this.state.address);
            latRef.set(lat);
            lngRef
              .set(lng)
              .then(() => {
                this.setState({
                  processing: false,
                  notify: true,
                  notifyMsg: "Address update successfully!"
                });
              })
              .catch(error => {
                this.setState({
                  notify: true,
                  notifyMsg: error.message,
                  processing: false
                });
              });
          },
          error => {
            if (error.message === "Server returned status code ZERO_RESULTS") {
              this.setState({
                processing: false,
                notify: true,
                notifyMsg: "Invalid address. Please enter a valid address"
              });
            }
            if (
              error.message === "Server returned status code OVER_QUERY_LIMIT"
            ) {
              this.setState({
                processing: false,
                notify: true,
                notifyMsg: "Please try agian later"
              });
            }
          }
        );
      }
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
      <div style={{ padding: "3.5% 18.5%" }}>
        <CssBaseline />
        {/*=============WELCOME USER HEADER=============*/}
        <div className="user-header">
          <Typography component="h2" variant="h3" style={{ flex: 1 }}>
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
        <div style={{ marginLeft: "15%", marginRight: "15%" }}>
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
                  variant="contained"
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
                  variant="contained"
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
                  variant="contained"
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
      </div>
    );
  }
}
export default UserProfile;
