import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ReviewList from './ReviewList/ReviewList';
import "./BusinessCard.css";

class BusinessCard extends Component {
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      mainBusiness: null,
      businessesMemo: [],
      loading: false
    };
  }

  componentDidMount(){
    this._isMounted = true;
    if(this.props.storeName){
      this.fetchBusinessesFromYelp();
    }
  }
  componentDidUpdate(prevProps){
    if( this.props.storeName !== prevProps.storeName ||
        this.props.address !== prevProps.address ||
        this.props.storeLat !== prevProps.storeLat ||
        this.props.storeLng !== prevProps.storeLng
    ){
      if(this.props.storeName){
        this.fetchBusinessesFromYelp();
      }
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  retrieveData(){
    const data = {
      term: this.props.storeName,
      latitude: this.props.storeLat,
      longitude: this.props.storeLng,
      location: this.props.address,
      radius: 20
    };
    return data;
  }

  fetchBusinessesFromYelp(){
    const url = "/api/yelp/search?";
    let data = this.retrieveData();
    let urlParams = Object.entries(data).map(e => e.join('=')).join('&');
    this.setState({ loading: true, mainBusiness: null });
    fetch(url + urlParams)
      .then(response => response.json())
      .then(data => {
        if(this._isMounted){
          this.setState({ businessesMemo: data.jsonBody.businesses });
          if(this.state.businessesMemo.length > 0){
            this.setState({ mainBusiness: this.state.businessesMemo[0]});
          }
          this.setState({ loading: false });
        }
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
                    <img
                      src={b.image_url}
                      className="business-card-media"
                      alt="Failed to load restaurant's URL."
                      />
                  </Grid>
                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3}
                    className="grid-item business-info-content"
                    >
                    <Typography variant="h6" component="h2">
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
            : ( this.state.loading === true
                ? (<CircularProgress />)
                : ( this.props.storeName
                    ? ( <Card style={{ padding: "1%"}}>
                          <Typography variant="h5" component="h2">
                            Sorry! We do not have a review for {this.props.storeName}!
                          </Typography>
                        </Card>
                      )
                    : (null)
                )
            )
          }
      </div>
    );
  }
}
export default BusinessCard;
