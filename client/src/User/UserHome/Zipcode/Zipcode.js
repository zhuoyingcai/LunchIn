import React, { Component } from "react";
import "./Zipcode.css";
import "firebase/auth";
import { 
  Button, 
  Typography, 
  Divider, 
  Snackbar, 
  Card, 
  CardHeader, 
  CardContent, 
  Chip,
  TextField 
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Back from "@material-ui/icons/ArrowBack";
import GoogleM from "../../../Map/googleMaps.js";
import Geocode from 'react-geocode';
import BusinessCardList from "../../../BusinessCardList/BusinessCardList";

class Zipcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ziplat: 0,
      ziplng: 0,
      zipCode: "",
      displayZipMap: false,
      processing: false,
      notify: false,
      notifyMsg: "",
      businesses: [],
      address: "",
    };
    this.handleZipSubmit = this.handleZipSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.displayZipMap !== this.state.displayZipMap && this.state.displayZipMap) {
      fetch(
        `/api/yelp/search?term=restaurant&location=${
        this.state.zipCode
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
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      displayZipMap: false
    });
  }
  // Check zipcode search
  handleZipSubmit(e) {
    e.preventDefault();
    this.setState({
      ziplat: 0,
      ziplng: 0
    })
    let zipcode = this.state.zipCode;
    // Prevent negative numbers
    if (zipcode[0] === "-") {
      this.setState({
        notify: true,
        notifyMsg: "Input cannot be negative"
      })
    }

    // General input checks
    else {

      // Make sure length of input is 5
      if (zipcode.length === 5) {

        // Check if the input is a number
        if (!isNaN(zipcode)) {
          // console.log(zipcode);
          Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
          Geocode.fromAddress(zipcode).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
              // console.log(lat, lng);
              this.setState({
                ziplat: lat,
                ziplng: lng,
                displayZipMap: true
              });
            },
            error => {
              // Zip code does not exist
              if (error.message === "Server returned status code ZERO_RESULTS") {
                this.setState({
                  processing: false,
                  notify: true,
                  notifyMsg: "Invalid zipcode. Please enter a valid zipcode",
                  ziplat: 0,
                  ziplng: 0,
                  displayZipMap: false
                });
              }
              if (error.message === "Server returned status code OVER_QUERY_LIMIT") {
                this.setState({
                  processing: false,
                  notify: true,
                  notifyMsg: "Please try agian later",
                  ziplat: 0,
                  ziplng: 0,
                  displayZipMap: false
                });
              }
            }
          );
        } else {
          this.setState({
            notify: true,
            notifyMsg: "Zip Code must be a number"
          })
        }
      } else {
        this.setState({
          notify: true,
          notifyMsg: "Zip Code must be 5 digits"
        })
      }
    }
  }
  renderMaps() {
    // checks if the lng and lat are being passed through before rendering gmaps on your screen.
    if (this.state.ziplat !== 0 && this.state.ziplng !== 0) {
      return (
        <GoogleM
          food={"restaurant"}
          address={this.state.zipCode}
          lat={this.state.ziplat}
          lng={this.state.ziplng}
          key={this.state.zipCode}
        />
      );
    }
  }
  // Render Yelp correctly when searching a zip code
  renderZipBusiness() {
    if (this.state.ziplat !== 0 && this.state.ziplng !== 0) {
      return (
        <BusinessCardList businesses={this.state.businesses} />
      );
    }
  }
  render() {
    return (
      <div style={{ padding: "50px 200px" }}>
        <Snackbar
          onClose={() => {
            this.setState({ notify: false, notifyMsg: "" });
          }}
          open={this.state.notify}
          autoHideDuration={6000}
          message={this.state.notifyMsg}
        />
        <CssBaseline />
        <div className="header">
          <Typography variant="display2" style={{ flex: 1 }}>
            Search Restaurants by Zipcode
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
        <Card className="input-paper" data-aos="zoom-in-up">
          <CardHeader title="Search All Restaurants by Zipcode" />
          <CardContent>
            <TextField
              fullWidth
              inputProps={{
                maxLength: 5,
                style: { textAlign: "center" }
              }}
              value={this.state.zipCode}
              className=""
              onChange={this.handleInputChange}
              placeholder="Enter 5 Digit Zip Code"
              name="zipCode"
              required
            />            
            <div>
              <Button
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  marginLeft: 5,
                  fontSize: 11
                }}
                variant="raised"
                color="primary"
                className="input-button"
                value=""
                onClick={this.handleZipSubmit}
              >
                Search Entered Zip Code
              </Button>
              {this.state.displayZipMap ?
                <Typography variant="subtitle1">
                  Showing all restaurants in: <Chip label={this.state.zipCode} />
                  {this.renderMaps(true)}
                  {this.renderZipBusiness()}
                </Typography>
              : null}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Zipcode;