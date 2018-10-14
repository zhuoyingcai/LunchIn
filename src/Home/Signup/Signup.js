import React, { Component } from "react";
import "./Signup.css";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";
import Visible from "@material-ui/icons/Visibility";
import Hidden from "@material-ui/icons/VisibilityOff";
import Next from "@material-ui/icons/PlayCircleFilled";
import Done from "@material-ui/icons/CheckCircle";
import { Link } from "react-router-dom";
import * as firebase from "firebase";

const validation = {
  invalid: 0,
  valid: 1,
  err_pwd_length: 2,
}


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: "user",
      name: "",
      email: "",
      password: "",
      address: "",
      showPassword: false,
      step1complete: false,
      step2complete: false,
      processing: false,
      notify: false,
      notifyMsg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.createUser = this.createUser.bind(this);
    this.finalizeUserUpdate = this.finalizeUserUpdate.bind(this);
    this.validate = this.validate.bind(this);
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  validate(type) {
    if (type === "createUser") {
      if (!this.state.name || !this.state.email || !this.state.password) {
        return validation.invalid;
      }
      if (this.state.password.length < 6) {
        return validation.err_pwd_length;
      }
    }
    return validation.valid;
  }
  createUser() {
    const isValid = this.validate("createUser");
    if (isValid === validation.valid) {
      this.setState({
        processing: true
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(
          resp => {
            firebase.auth().currentUser.updateProfile({
              displayName: this.state.name
            });
          },
          this.setState({
            processing: false,
            step1complete: true
          }),
          err => {
            this.setState({
              notify: true,
              notifyMsg: err.message,
              processing: false
            });
          }
        );
    } else if(isValid === validation.err_pwd_length) {
      this.setState({
        notify: true,
        notifyMsg: "Password must at least 6 characters."
      });
    }
    else {
      this.setState({
        notify: true,
        notifyMsg: "Looks like you're missing stuff."
      });
    }
  }
  finalizeUserUpdate() {
    const isValid = this.validate("finalizeUser");
    if (isValid=== validation.valid) {
      this.setState({
        processing: true
      });
      var setData = {
        type: this.state.userType,
        name: this.state.name,
        address: this.state.address
      };
      firebase
        .database()
        .ref(`Users/${firebase.auth().currentUser.uid}/`)
        .set(setData)
        .then(
          () => {
            this.setState({
              processing: false,
              step2complete: true
            });
          },
          err => {
            this.setState({
              notify: true,
              notifyMsg: err.message,
              processing: false
            });
            return;
          }
        );
    } else if(isValid === validation.err_pwd_length) {
      this.setState({
        notify: true,
        notifyMsg: "Password must at least 6 characters."
      });
    }
     else {
      this.setState({
        notify: true,
        notifyMsg: "Looks like you're missing stuff.",
        processing: false
      });
    }
  }
  render() {
    return (
      <div className="signup-page">
        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={6000}
          message={this.state.notifyMsg}
        />
        <div className="signup-title-bar">
          <Typography variant="display2">LunchIn | Sign-Up</Typography>
          <Typography variant="subheading" style={{ marginTop: "10px" }}>
            Fill out the form below to sign-up for an account.
          </Typography>
        </div>
        <Divider />
        <div className="signup-page-content">
          <Card style={{ marginTop: "10px" }} data-aos="slide-up">
            <CardHeader
              title="Essentials"
              subheader="What we need to get started"
            />
            <CardContent>
              <TextField
                onChange={this.handleChange("name")}
                id="name"
                label="Full Name"
                required
                value={this.state.name}
                fullWidth
                className="push-down"
                disabled={this.state.step1complete || this.state.processing}
              />
              <TextField
                onChange={this.handleChange("address")}
                id="address"
                label="Full Address"
                required
                value={this.state.address}
                fullWidth
                className="push-down"
                disabled={this.state.step1complete || this.state.processing}
              />
              <TextField
                onChange={this.handleChange("email")}
                label="E-Mail"
                type="email"
                id="email"
                required
                value={this.state.email}
                fullWidth
                className="push-down"
                disabled={this.state.step1complete || this.state.processing}
              />
              <TextField
                disabled={this.state.step1complete || this.state.processing}
                id="password"
                label="Password"
                value={this.state.password}
                onChange={this.handleChange("password")}
                fullWidth
                required
                type={this.state.showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          this.setState({
                            showPassword: !this.state.showPassword
                          });
                        }}
                      >
                        {this.state.showPassword ? <Visible /> : <Hidden />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                className="push-down"
              />
              <Button
                onClick={() => {
                  this.createUser();
                }}
                fullWidth
                variant="raised"
                color="primary"
                className="push-down"
                disabled={this.state.step1complete || this.state.processing}
              >
                <Next style={{ marginRight: "10px" }} />
                Continue
              </Button>
            </CardContent>
          </Card>
          {this.state.step1complete ? (
            <Card className="push-down" data-aos="slide-up">
              <CardHeader
                title="Confirmation"
                subheader="Click done to create your account!"
              />
              <CardContent>
                <Button
                  onClick={() => {
                    this.finalizeUserUpdate();
                  }}
                  fullWidth
                  variant="raised"
                  color="primary"
                  className="push-down"
                  component={Link}
                  to="/"
                  disabled={this.state.step2complete || this.state.processing}
                >
                  <Done style={{ marginRight: "10px" }} />
                  Done
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    );
  }
}
