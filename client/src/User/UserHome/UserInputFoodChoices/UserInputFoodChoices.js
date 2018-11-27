import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton
} from "@material-ui/core";
import "./UserInputFoodChoices.css";
import { firebase } from "../../../Config";
import GoogleM from "../../../Map/googleMaps.js";
import Geocode from 'react-geocode';
import BusinessCardList from "../../../BusinessCardList/BusinessCardList";
import Delete from "@material-ui/icons/DeleteForever";
import Restaurant from "@material-ui/icons/Restaurant";

class UserInputFoodChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFoodName: "",
      foodNames: [],
      randomFoodName: "",
      addressName: "",
      lat: 0,
      lng: 0,
      processing: false,
      notify: false,
      notifyMsg: "",
      businesses: [],
      address: "",
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
      this.setState({ businesses: [] });
      fetch(
        `/api/yelp/search?term=${this.sanitizeInput(this.state.randomFoodName)}&location=${
        this.state.address
        }`
      )
        .then(response => response.json())
        .then(data => {
          console.log(data.jsonBody.businesses);
          this.setState({ businesses: data.jsonBody.businesses });
        })
        .catch(e => console.log(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.inputFoodName) {
      this.setState({
        foodNames: this.state.foodNames.concat(this.state.inputFoodName),
        inputFoodName: "",
        processing: true
      });
      const foodNamesRef = firebase
        .database()
        .ref(`Users/${firebase.auth().currentUser.uid}/foodNames`);
      foodNamesRef
        .set(this.state.foodNames.concat(this.state.inputFoodName))
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
  handleRandomFood(e, isRand) {
    e.preventDefault();
    let rand = this.state.foodNames[
      Math.floor(Math.random() * this.state.foodNames.length)
    ];
    if (!isRand) {
      rand = e.currentTarget.value;
    }
    this.setState({
      randomFoodName: rand,
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
    console.log(x);

    const foodList = this.state.foodNames;
    const foodIndex = foodList.indexOf(x);
    foodList.splice(foodIndex, 1);
    console.log(foodList);

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
    if (this.state.lat !== 0 && this.state.lng !== 0) {
      return (
        <GoogleM
          food={this.sanitizeInput(this.state.randomFoodName)}
          address={this.state.addressName}
          lat={this.state.lat}
          lng={this.state.lng}
          key={this.sanitizeInput(this.state.randomFoodName)}
        />
      );
    }
  }
  sanitizeInput(string) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
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
          {this.state.foodNames.length > 0 ? (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: "left", fontSize: 25 }}>
                      Food Name
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.foodNames.map(food => (
                    <TableRow key={food}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ fontSize: 15 }}
                      >
                        {food}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          id="delete"
                          aria-label="Delete"
                          style={{ float: "right" }}
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
                            fontSize: 12
                          }}
                        >
                          <Restaurant /> SELECT
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : null}
          {this.state.foodNames.length > 0 ? (
            <Button
              style={{
                marginTop: 10,
                marginBottom: 5
              }}
              variant="contained"
              color="secondary"
              className="input-button"
              value=""
              onClick={e => this.handleRandomFood(e, true)}
            >
              Generate Random Food
            </Button>
          ) : null}
          <div className="random-food-section">
            {this.state.randomFoodName ? (
              <Typography variant="subtitle1">
                The food selected is: <Chip label={this.state.randomFoodName} />
                {this.renderMaps()}
                <BusinessCardList businesses={this.state.businesses} />
              </Typography>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default UserInputFoodChoices;
