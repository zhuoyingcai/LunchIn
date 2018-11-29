import React, { Component } from "react";
// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Typography from '@material-ui/core/Typography';
import Review from './Review';
import "./ReviewList.css";


class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = { reviewList: [] };
  }
  componentDidMount(){
    fetch(
      `/api/yelp/reviews?id=${this.props.selectedBusinessId}`
    )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({ reviewList: data.reviews });
    })
    .catch(e => console.log(e));
  }
  renderReview(review) {
    return (
      <Review review={review} key={review.id} />
    );
  }
  render() {
    return (
      <div className="review-card-list">
        {this.state.reviewList.map(this.renderReview)}
      </div>
    );
  }
}
export default ReviewList;
