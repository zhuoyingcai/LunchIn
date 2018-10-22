import React, { Component } from "react";
import "./Review.css";

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
		fetch(`/api/yelp?term=${this.props.term}&location=${this.props.location}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({businesses: data.jsonBody.businesses});
			})
			.catch(e => console.log(e));
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
