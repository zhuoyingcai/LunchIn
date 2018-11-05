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
  Typography,
  Tooltip
} from "@material-ui/core";
import Visible from "@material-ui/icons/Visibility";
import Hidden from "@material-ui/icons/VisibilityOff";
import Next from "@material-ui/icons/PlayCircleFilled";
import Done from "@material-ui/icons/CheckCircle";
import { Link } from "react-router-dom";
import { firebase } from "../../Config";

const validation = {
  invalid: 0,
  valid: 1
};

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
      notifyMsg: "",
      message: "Show Password"
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
      if (
        this.state.name === "" ||
        this.state.email === "" ||
        this.state.password === ""
      ) {
        return validation.invalid;
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
            this.setState({
              processing: false,
              step1complete: true
            });
          },
          this.setState({
            processing: false,
            step1complete: true
          })
        )
        .catch(error => {
          this.setState({
            notify: true,
            notifyMsg: error.message,
            processing: false,
            step1complete: false
          });
        });
    } else {
      this.setState({
        notify: true,
        notifyMsg: "Looks like you're missing stuff."
      });
    }
  }
  finalizeUserUpdate() {
    const isValid = this.validate("finalizeUser");
    if (isValid === validation.valid) {
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
        .then(() => {
          this.setState({
            processing: false,
            step2complete: true
          });
        })
        .catch(error => {
          this.setState({
            notify: true,
            notifyMsg: error.message,
            processing: false,
            step2complete: false
          });
        });
    } else {
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
        <div>
          <Card
            className="signup-page-content"
            style={{ marginTop: "10px" }}
            data-aos="slide-up"
          >
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
                      <Tooltip title={this.state.message} placement="top">
                        <IconButton
                          onClick={() => {
                            if (this.state.message === "Show Password") {
                              this.setState({
                                showPassword: !this.state.showPassword,
                                message: "Hide Password"
                              });
                            } else if (this.state.message === "Hide Password") {
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
            <Card className="push-down signup-page-content" data-aos="slide-up">
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
