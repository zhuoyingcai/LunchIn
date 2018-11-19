import React, { Component } from "react";
import BusinessCard from './BusinessCard';
import ReviewList from './ReviewList/ReviewList';
import "./BusinessCardList.css";

class BusinessCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBusinessId: null
    };
    this.renderBusinessCard = this.renderBusinessCard.bind(this);
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
        {this.props.businesses
          ? (this.props.businesses.map(this.renderBusinessCard))
          : null
        }
      </div>
    );
  }
}
export default BusinessCardList;
