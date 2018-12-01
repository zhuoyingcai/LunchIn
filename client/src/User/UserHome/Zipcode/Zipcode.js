import React, { Component } from "react";
import "./Zipcode.css";
import { firebase as firebaseAuth } from "../../../Config";
import firebase from "firebase/app";
import "firebase/auth";
import { Button, Typography, Divider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Back from "@material-ui/icons/ArrowBack";

class Zipcode extends Component {
  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        <CssBaseline />
        <div className="header">
          <Typography variant="display2" style={{ flex: 1 }}>
            Search Restaurant by Zipcode
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
      </div>
    );
  }
}

export default Zipcode;
