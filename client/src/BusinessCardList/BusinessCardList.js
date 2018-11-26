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
    this.onClickReviewBtn = this.onClickReviewBtn.bind(this);
  }
  onClickReviewBtn(businessId){
    console.log("hello world");
    this.setState({selectedBusinessId: businessId});
  }
  renderBusinessCard(business) {
    return (
      <div className="item"
        key={business.id}
        >
        <BusinessCard
          business={business}
          onClickReviewBtn={this.onClickReviewBtn}
          key={business.id}
        />
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
