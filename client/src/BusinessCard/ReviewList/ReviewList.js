import React, { Component } from "react";
// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Review from './Review';
import "./ReviewList.css";


class ReviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewList: null,
      loading: false
    };
  }
  componentDidMount(){
    this.setState({ loading: true });
    fetch(
      `/api/yelp/reviews?id=${this.props.selectedBusinessId}`
    )
    .then(response => response.json())
    .then(data => {
      this.setState({ reviewList: data.reviews });
      this.setState({ loading: false });
    })
    .catch(e => {
      this.setState({ loading: false });
      console.log(e);
    });
  }
  renderReview(review) {
    return (
      <Review review={review} key={review.id} />
    );
  }
  render() {
    return (
      <div className="review-card-list">
      { this.state.reviewList
        ? this.state.reviewList.map(this.renderReview)
        : ( this.state.loading
            ? (<CircularProgress />)
            : (null)
        )
      }
      </div>
    );
  }
}
export default ReviewList;