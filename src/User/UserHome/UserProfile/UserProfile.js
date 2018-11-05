import React, { Component } from 'react';
import "./UserProfile.css";
import { firebase } from "../../../Config";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";
import Back from "@material-ui/icons/ArrowBack";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      address: "",
      processing: false,
      notify: false,
      notifyMsg: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.fetchInitialData();
  }
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
              console.log("Error: " + error.code);
            }
          );
      }
    });
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleSubmit(e) {
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
            notifyMsg: "Update successfully.",
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

  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        {/*=============WELCOME USER HEADER=============*/}
        <div className="user-header">
          <Typography variant="display2" style={{ flex: 1 }}>
            Profile

        <Button
              style={{ float: "right" }}
              onClick={() => {
                this.props.history.push(`/user/home`);
              }}>
              <Back />Back
        </Button>

          </Typography>
        </div>
        <Divider />

        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={6000}
          message={this.state.notifyMsg}
        />

        <div className="user-profile-content">
          <Card className="input-paper" data-aos="zoom-in-up">
            <CardContent>
              <TextField
                id="name"
                label="Full Name"
                value={this.state.name}
                fullWidth
                className="push-down"
                InputProps={{
                  readOnly: true,
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
                  marginTop: 10,
                }}
                variant="raised"
                color="primary"
                className="input-button"
                onClick={this.handleSubmit}
              >
                Update
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}
export default UserProfile;