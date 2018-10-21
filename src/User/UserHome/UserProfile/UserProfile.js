import React, { Component } from 'react';
import { firebase } from "../../../Config";
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
            notifyMsg: ""
        };
    }

    render() {
        return(
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

        <div className="signup-page-content">
          <Card style={{ marginTop: "10px" }} data-aos="slide-up">
            <CardContent>

            <TextField
                id="outlined-required"
                label="Name"
                //className={classes.textField}
                value="joy"
                //onChange={this.handleChange('name')}
                fullWidth
                margin="normal"
                variant="outlined"
            />

                    <TextField
          id="outlined-email-input"
          label="Email"
          //className={classes.textField}
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="outlined"
          fullWidth
        />
   
            </CardContent>
          </Card>

          </div>
          </div>
        )
    }
}
export default UserProfile;