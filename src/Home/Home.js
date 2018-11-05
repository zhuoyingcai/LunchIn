import React, { Component } from "react";
import "./Home.css";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";
import Visible from "@material-ui/icons/Visibility";
import Hidden from "@material-ui/icons/VisibilityOff";
import Next from "@material-ui/icons/CheckCircle";
import Signout from "@material-ui/icons/Cancel";
import { firebase } from "../Config";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: false,
      notify: false,
      notifyMsg: "",
      processing: this.props.loggedIn
    };
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }
  login() {
    this.setState({
      processing: true
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(
        resp => {
          // wait for AuthStateChange
        },
        err => {
          this.setState({
            notify: true,
            notifyMsg: err.message,
            processing: false
          });
        }
      );
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loggedIn !== this.state.processing) {
      nextState.processing = nextProps.loggedIn;
    }
    return true;
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  render() {
    return (
      <div className="home-page">
        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={3000}
          message={this.state.notifyMsg}
        />

        <div className="title-bar" data-aos="fade-up">
          <Typography variant="display4" className="title">
            <strong>LunchIn</strong>
          </Typography>
          <Typography
            variant="display2"
            className="tag-line"
            data-aos="fade-up"
          >
            Automatically Choose a Lunch Option For You
          </Typography>
        </div>
        <div className="home-page-content">
          <Card className="login-form" data-aos="slide-right">
            {this.state.processing ? (
              <LinearProgress className="loading" />
            ) : null}
            <CardHeader
              className="login-form-header"
              title="Sign In"
              subheader="Your Lunch Option Awaits"
            />
            {this.props.loggedIn === true ? (
              <CardContent className="login-form-content">
                <Typography className="push-down" variant="subheading">
                  Welcome, {firebase.auth().currentUser.displayName}!
                </Typography>
                <Button
                  fullWidth
                  color="primary"
                  variant="raised"
                  className="push-down"
                  onClick={() => {
                    this.props.history.push(`/user/home`);
                  }}
                >
                  <Next style={{ marginRight: "10px" }} />
                  Continue to Your Account
                </Button>
                <Button
                  fullWidth
                  color="secondary"
                  variant="raised"
                  className="push-down"
                  onClick={() => {
                    firebase.auth().signOut();
                  }}
                >
                  <Signout style={{ marginRight: "10px" }} />
                  Sign Out
                </Button>
              </CardContent>
            ) : (
              <CardContent className="login-form-content">
                <TextField
                  disabled={this.state.processing}
                  className="username"
                  id="username"
                  label="E-mail"
                  value={this.state.username}
                  onChange={this.handleChange("username")}
                  fullWidth
                  required
                  type="email"
                />
                <TextField
                  disabled={this.state.processing}
                  className="password"
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
                />
                <Button
                  style={{ marginTop: 5, marginBottom: 5 }}
                  disabled={this.state.processing}
                  variant="raised"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    this.login();
                  }}
                  className="login"
                >
                  Sign-In
                </Button>
                <Typography
                  style={{ marginTop: 5, marginBottom: 5 }}
                  variant="subheading"
                  className="signup-line"
                >
                  Don't have an account? Signup now!
                </Typography>
                <Button
                  style={{ marginTop: 5, marginBottom: 5 }}
                  disabled={this.state.processing}
                  variant="raised"
                  color="secondary"
                  fullWidth
                  className="login"
                  onClick={() => {
                    this.props.history.push("/sign-up");
                  }}
                >
                  Sign-Up
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    );
  }
}
export default Home;
