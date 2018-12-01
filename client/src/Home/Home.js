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
  Typography,
  Tooltip
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Visible from "@material-ui/icons/Visibility";
import Hidden from "@material-ui/icons/VisibilityOff";
import { firebase } from "../Config";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      notify: false,
      notifyMsg: "",
      processing: false,
      message: "Show Password"
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
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        resp => {
          this.props.history.push(`/user/home`);
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
        <CssBaseline />
        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={3000}
          message={this.state.notifyMsg}
        />

        <div className="title-bar" data-aos="fade-up">
          <Typography
            component="h2"
            variant="h1"
            className="title"
            style={{ color: "#000000" }}
          >
            <strong>LunchIn</strong>
          </Typography>
          <Typography
            component="h2"
            variant="h3"
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
            <CardContent className="login-form-content">
              <TextField
                disabled={this.state.processing}
                className="email"
                id="email"
                label="E-mail"
                value={this.state.email}
                onChange={this.handleChange("email")}
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
              />
              <Button
                style={{ marginTop: 5, marginBottom: 5 }}
                disabled={this.state.processing}
                variant="contained"
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
                component="h2"
                style={{ marginTop: 5, marginBottom: 5 }}
                variant="subtitle1"
                className="signup-line"
              >
                Don't have an account? Signup now!
              </Typography>
              <Button
                style={{ marginTop: 5, marginBottom: 5 }}
                disabled={this.state.processing}
                variant="contained"
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
          </Card>
        </div>
      </div>
    );
  }
}
export default Home;
