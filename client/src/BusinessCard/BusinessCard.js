import React, { Component } from "react";
import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
// import ExpandMore from "@material-ui/icons/ExpandMore";
import ReviewList from './ReviewList/ReviewList';
import "./BusinessCard.css";

class BusinessCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      mainBusiness: null,
      businessesMemo: [],
      loading: false
    };
    if(this.props.storeName){
      this.fetchBusinessesFromYelp();
    }
  }

  retrieveData(){
    const data = {
      term: this.props.storeName,
      latitude:this.props.storeLat,
      longitude:this.props.storeLng,
      location: this.props.address,
    };
    return data;
  }
  fetchBusinessesFromYelp(){
    const url = "/api/yelp/search?";
    let data = this.retrieveData();
    let urlParams = Object.entries(data).map(e => e.join('=')).join('&');
    fetch(url + urlParams)
      .then(response => response.json())
      .then(data => {
        this.setState({ businessesMemo: data.jsonBody.businesses });
        if(this.state.businessesMemo.length > 0){
          this.setState({ mainBusiness: this.state.businessesMemo[0]});
        }
        else{
          this.setState({ mainBusiness: null });
        }
        this.setState({ loading: false });
      })
      .catch(e => console.log(e));
  }
  render() {
    let b = this.state.mainBusiness;
    return (
      <div>
        {this.state.mainBusiness
          ? (
            <Card className="business-card">
              <Grid container>
                <Grid item xs={6} sm={6} md={3} lg={3} xl={3}
                  className="grid-item">
                  <img src={b.image_url} className="business-card-media"/>
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3} xl={3}
                  className="grid-item"
                  className="business-info-content">
                  <Typography variant="h5" component="h2">
                    {b.name}
                  </Typography>
                  <Typography component="p">
                    Rating: {b.rating} <br />
                    {b.review_count} reviews <br />
                    Price: {b.price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
                  className="grid-item">
                  <ReviewList selectedBusinessId={ b.id } />
                </Grid>
              </Grid>
            </Card>
            )
            : ( this.state.loading
                ? (<CircularProgress />)
                : (null)
            )
          }
      </div>
    );
  }
}
export default BusinessCard;
