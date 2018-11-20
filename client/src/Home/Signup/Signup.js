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
import CssBaseline from "@material-ui/core/CssBaseline";
import Visible from "@material-ui/icons/Visibility";
import Hidden from "@material-ui/icons/VisibilityOff";
import Check from "@material-ui/icons/CheckCircle";
import { firebase } from "../../Config";
import Geocode from "react-geocode";

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
      lat: 0,
      lng: 0,
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

      Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
      console.log(this.state.address);
      Geocode.fromAddress(this.state.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log(lat, lng);

          var setData = {
            type: this.state.userType,
            name: this.state.name,
            address: this.state.address,
            lat: lat,
            lng: lng
          };
          firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
              firebase
                .database()
                .ref(`Users/${firebase.auth().currentUser.uid}/`)
                .set(setData)
                .then(() => {
                  this.setState({
                    processing: false,
                    step1complete: true
                  }).then(() => {
                    this.props.history.push("/user/home");
                  });
                })
                .catch(error => {
                  this.setState({
                    notify: true,
                    notifyMsg: error.message,
                    processing: false,
                    step1complete: false
                  });
                });
            })
            .catch(error => {
              this.setState({
                notify: true,
                notifyMsg: error.message,
                processing: false,
                step1complete: false
              });
            });

        },
        error => {
          if (error.message === "Server returned status code ZERO_RESULTS") {
            console.error(error.message)
            this.setState({
              processing: false,
              notify: true,
              notifyMsg: "Invalid address. Please enter a valid address"
            });
          }
          if (error.message === "Server returned status code OVER_QUERY_LIMIT") {
            console.error(error.message)
            this.setState({
              processing: false,
              notify: true,
              notifyMsg: "Please try agian later"
            });
          }
        })

      // var setData = {
      //   type: this.state.userType,
      //   name: this.state.name,
      //   address: this.state.address
      // };
      // firebase
      //   .auth()
      //   .createUserWithEmailAndPassword(this.state.email, this.state.password)
      //   .then(() => {
      //     firebase
      //       .database()
      //       .ref(`Users/${firebase.auth().currentUser.uid}/`)
      //       .set(setData)
      //       .then(() => {
      //         this.setState({
      //           processing: false,
      //           step1complete: true
      //         }).then(() => {
      //           this.props.history.push("/user/home");
      //         });
      //       })
      //       .catch(error => {
      //         this.setState({
      //           notify: true,
      //           notifyMsg: error.message,
      //           processing: false,
      //           step1complete: false
      //         });
      //       });
      //   })
      //   .catch(error => {
      //     this.setState({
      //       notify: true,
      //       notifyMsg: error.message,
      //       processing: false,
      //       step1complete: false
      //     });
      //   });
    } else {
      this.setState({
        notify: true,
        notifyMsg: "Looks like you're missing stuff."
      });
    }
  }
  render() {
    return (
      <div className="signup-page">
        <CssBaseline />
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
          <Typography variant="subheading">
            Fill out the form below to sign-up for an account.
          </Typography>
        </div>
        <Divider />
        <div>
          <Card
            className="signup-page-content"
            style={{ marginTop: "5px" }}
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
                <Check style={{ marginRight: "10px" }} />
                Sign Up
              </Button>
              <Button
                onClick={() => {
                  this.props.history.push(`/`);
                }}
                fullWidth
                variant="outlined"
                color="default"
                className="push-down"
                disabled={this.state.step1complete || this.state.processing}
              >
                Already have an account? Sign in here!
              </Button>
            </CardContent>
          </Card>
          {this.state.step1complete ? (
            <Card className="push-down signup-page-content" data-aos="slide-up">
              <CardHeader
                title="Confirmation"
                subheader="Click done to create your account!"
              />
            </Card>
          ) : null}
        </div>
      </div>
    );
  }
}
