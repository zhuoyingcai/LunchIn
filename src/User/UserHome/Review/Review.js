import React, { Component } from "react";
import yelp from 'yelp-fusion';
import "./Review.css";
// const clientID = 'H_7NXPInp_41ZuEroRrm0w';
const yelpApiKey = 'whkFooEOGksI2QwFSlH384Ms_QthKYxnr6mhtM2KQdbKyh5AroW28JH_bS0N7Jzk3xhl0qwD4v61vnSiyrqAqvwxqjh_A-QovSzYq-bjDKyo3j5QhyMQXh7sEPzAW3Yx';

/*
  This component requires two properties: term, location
*/
class Review extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
    this.renderReview = this.renderReview.bind(this);
    this.getReviews = this.getReviews.bind(this);
    this.getReviews();
  }

  getReviews(){
    let client = yelp.client(yelpApiKey);
    client.search({
      // term: this.props.term,
      // location: this.props.location
      term:'Four Barrel Coffee',
      location: 'san francisco, ca'
    }).then(response => {
      console.log(response);
      this.setState({
        businesses: response.jsonBody.businesses
      });
    }).catch(e => {
      console.log(e);
    });
  }

  renderReview(review){
    return (
      <div className="review" key={review.id}>
        {/*console.log(review)*/}
        <div className="review-name">{review.name}</div>
        <div className="review-price">Price: {review.price}</div>
        <div className="review-rating">Rating: {review.rating}</div>
        <div className="review-review_count">Count: {review.review_count}</div>
        <div><img src={review.image_url} className="review-img"></img></div>
      </div>
    );
  }

  render(){
    return (
      <div className="review-list">
        { this.props.term
          ? (
              <div className="selected-food">
                We have selected the following food: {this.props.term}
              </div>
            )
          : (
              <div className="error">"Unable to pick a lunch..."</div>
            )
        }
        { this.state.businesses
          ? (this.state.businesses.map(this.renderReview))
          : ("")
        }
      </div>
    );
  }
}
export default Review;
