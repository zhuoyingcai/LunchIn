import React, { Component } from "react";
import BusinessCard from './BusinessCard';
import ReviewList from './ReviewList/ReviewList';
import "./BusinessCardList.css";

class BusinessCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBusinessId: null,
      businesses: []
    };
    this.renderBusinessCard = this.renderBusinessCard.bind(this);
  }
  
  retrieveData(){
    const data = {
      term: this.props.randomFoodName,
      location: this.props.address
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
        this.setState({ businesses: data.jsonBody.businesses });
      })
      .catch(e => console.log(e));
  }

  // Fetch businesses for every update in the props
  componentDidUpdate(prevProps, prevState) {
    if(this.props.randomFoodName
      && (this.props.randomFoodName !== prevProps.randomFoodName
        || this.props.address !== prevProps.address)){
      this.setState({ businesses: [] });
      this.fetchBusinessesFromYelp();
    }
  }

  renderBusinessCard(business) {
    return (
      <div className="item"
        key={business.id}
        onClick={() => this.setState({selectedBusinessId: business.id})}>
        <BusinessCard business={business} />
        { this.state.selectedBusinessId === business.id
          ? (
            <ReviewList
              key="review-list"
              selectedBusinessId={ this.state.selectedBusinessId } />
          )
          : null
        }
      </div>
    );
  }

  render() {
    return (
      <div className="business-card-list">
        {this.state.businesses
          ? (this.state.businesses.map(this.renderBusinessCard))
          : null
        }
      </div>
    );
  }
}
export default BusinessCardList;
