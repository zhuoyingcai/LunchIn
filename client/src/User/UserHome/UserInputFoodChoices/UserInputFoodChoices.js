import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Snackbar,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import "./UserInputFoodChoices.css";
import { firebase } from "../../../Config";
import GoogleM from "../../../Map/googleMaps.js";
import Geocode from 'react-geocode';
import Delete from "@material-ui/icons/DeleteForever";
import Restaurant from "@material-ui/icons/Restaurant";
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Chip from '@material-ui/core/Chip';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

class UserInputFoodChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFoodName: "",
      foodNames: [],
      randomFoodName: "",
      sanitizedRandomFood: "",
      addressName: "",
      lat: 0,
      lng: 0,
      processing: false,
      notify: false,
      notifyMsg: "",
      businesses: [],
      address: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRandomFood = this.handleRandomFood.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.fetchInitialData();
    this.fetchInitialData2();
  }
  fetchInitialData() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref(`Users/${user.uid}/foodNames`)
          .once(
            "value",
            snapshot => {
              if (snapshot.val() != null) {
                this.setState({
                  foodNames: this.state.foodNames.concat(snapshot.val())
                });
              }
            },
            error => {
              console.log("Error: " + error.code);
            }
          );
        firebase
          .database()
          .ref(`Users/${user.uid}/address`)
          .once(
            "value",
            snapshot => {
              if (snapshot.val() != null) {
                this.setState({
                  address: snapshot.val()
                });
              }
            },
            error => {
              console.log("Error: " + error.code);
            }
          );
          firebase
          .database()
          .ref(`Users/${user.uid}/lat`)
          .once(
            "value",
            snapshot => {
              if (snapshot.val() != null) {
                this.setState({
                  lat: snapshot.val()
                });
              }
            },
            error => {
              console.log("Error: " + error.code);
            }
          );
          firebase
          .database()
          .ref(`Users/${user.uid}/lng`)
          .once(
            "value",
            snapshot => {
              if (snapshot.val() != null) {
                this.setState({
                  lng: snapshot.val()
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
  fetchInitialData2() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref(`Users/${user.uid}/address`)
          .once(
            "value",
            snapshot => {
              if (snapshot.val() != null) {
                this.setState({
                  addressName: this.state.addressName.concat(snapshot.val())
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
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.randomFoodName !== this.state.randomFoodName) {
      Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
      Geocode.fromAddress(this.state.addressName).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({ lat: lat, lng: lng });
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  checkFoodExist(e) {
    var food = e.toLowerCase()

    for (var i = 0; i < this.state.foodNames.length; i++) {
      var tmp = this.state.foodNames[i].toLowerCase()
      if (food === tmp) {
        return true
      }
    }

    return false
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.inputFoodName) {
      if (this.checkFoodExist(this.state.inputFoodName)) {
        this.setState({
          notify: true,
          processing: false,
          notifyMsg: "Food already exist",
          inputFoodName: ""
        })
      }
      else {
        const newList = this.state.foodNames
        newList.splice(0, 0, this.state.inputFoodName)

        this.setState({
          foodNames: newList,
          inputFoodName: "",
          processing: true
        });
        const foodNamesRef = firebase
          .database()
          .ref(`Users/${firebase.auth().currentUser.uid}/foodNames`);
        foodNamesRef
          .set(newList)
          .then(() => {
            this.setState({ processing: false });
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
  }
  handleRandomFood(e, isRand) {
    e.preventDefault();
    let rand = this.state.foodNames[
      Math.floor(Math.random() * this.state.foodNames.length)
    ];
    if (!isRand) {
      rand = e.currentTarget.value;
    }
    let sanitizedRandomFood = this.sanitizeInput(rand);
    this.setState({
      randomFoodName: rand,
      sanitizedRandomFood: sanitizedRandomFood,
      processing: true
    });
    const foodSelectedRef = firebase
      .database()
      .ref(`Users/${firebase.auth().currentUser.uid}/foodSelected`);
    foodSelectedRef
      .set(rand)
      .then(() => {
        this.setState({ processing: false });
      })
      .catch(error => {
        this.setState({
          notify: true,
          notifyMsg: error.message,
          processing: false
        });
      });
  }
  handleDelete(e) {
    e.preventDefault();
    const x = e.currentTarget.value;
    const foodList = this.state.foodNames;
    const foodIndex = foodList.indexOf(x);
    foodList.splice(foodIndex, 1);

    this.setState({
      processing: true
    });
    const deleteFoodRef = firebase
      .database()
      .ref(`Users/${firebase.auth().currentUser.uid}/foodNames`);
    deleteFoodRef
      .set(foodList)
      .then(() => {
        this.setState({ processing: false });
      })
      .catch(error => {
        this.setState({
          notify: true,
          notifyMsg: error.message,
          processing: false
        });
      });
  }
  renderMaps() {
    // checks if the lng and lat are being pass through before rendering gmaps on your screen.
    if (
      this.state.lat !== 0 &&
      this.state.lng !== 0 &&
      this.state.sanitizedRandomFood
    ) {
      return (
        <GoogleM
          food={this.state.sanitizedRandomFood}
          address={this.state.addressName}
          lat={this.state.lat}
          lng={this.state.lng}
          key={this.state.sanitizedRandomFood}
        />
      );
    }
    else if (this.state.lat !== 0 && this.state.lng !== 0) {
      return (
        <GoogleM
          address={this.state.addressName}
          lat={this.state.lat}
          lng={this.state.lng}
        />
      );
    }
  }
  sanitizeInput(string) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;"
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, match => map[match]);
  }

  render() {
    return (
      <Card className="input-paper" data-aos="zoom-in-up">
        <CardHeader title="Please enter your food choices:" />
        <CardContent>
        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={6000}
          message={this.state.notifyMsg}
        />
        <TextField
          fullWidth
          inputProps={{
            id: "input-food-choices",
            maxLength: 20,
            style: { textAlign: "center" }
          }}
          value={this.state.inputFoodName}
          className="addFoodChoice"
          onChange={this.handleInputChange}
          placeholder="Food name"
          name="inputFoodName"
          required
        />
        <Button
          style={{
            marginTop: 10,
            marginBottom: 5
          }}
          variant="contained"
          id="foodSubmit"
          color="primary"
          className="input-button"
          onClick={this.handleSubmit}
          disabled={!this.state.inputFoodName}
        >
          Add Food
        </Button>
        <div>
          <Grid container>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              {this.state.foodNames ? (
                <Paper className="food-list-paper">
                  <div className="food-choices">
                    <List className="food-choices-list" 
                      style={{height: '70vh', 
                              backgroundColor: "white",   
                              overflow: 'auto',
                              position: 'relative',
                              padding: 0}}>
                    <ListSubheader style={{backgroundColor: "inherit"}}>
                      <Typography variant="h6">Food Name</Typography>
                    </ListSubheader>
                      {this.state.foodNames.map(food => (
                        <ListItem key={food} style={{width: "75%"}}>
                          <ListItemText >
                            {food}
                          </ListItemText>

                          <ListItemSecondaryAction style={{paddingRight: 10, width: '50%'}}>
                            <IconButton
                              id="delete"
                              aria-label="Delete"
                              style={{ float: "right", padding: 5  }}
                              value={food}
                              onClick={e => this.handleDelete(e)}
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              value={food}
                              onClick={e => this.handleRandomFood(e, false)}
                              className="table-btn"
                              style={{
                                color: "#66bb6a",
                                float: "right",
                                padding: 5
                              }}
                            >
                              <Restaurant />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </div>
                {this.state.foodNames.length > 0 ? (
                  <Button
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      marginLeft: '5%',
                      marginRight: '5%'
                    }}
                    variant="contained"
                    color="secondary"
                    className="input-button-2"
                    value=""
                    onClick={e => this.handleRandomFood(e, true)}
                  >
                    Generate Random Food
                  </Button>
                ) : null}
              </Paper>
            ) : null}
            { this.state.randomFoodName && this.state.foodNames.length > 0
              ? (
                <Typography variant="h6">
                  <Paper className="random-food-section">
                  <span>
                    The food selected is:{" "}
                    <Chip style={{fontSize: 18}} label={this.state.randomFoodName} />
                  </span>
                  </Paper>
                </Typography>
              ) : (null)
            }
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
              <Paper>{this.renderMaps()}</Paper>
            </Grid>
          </Grid>
        </div>
        </CardContent>
      </Card>
    );
  }
}

export default UserInputFoodChoices;
