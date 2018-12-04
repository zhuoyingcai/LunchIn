import React, { Component } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Review from './Review';
import "./ReviewList.css";


class ReviewList extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      reviewList: null,
      loading: false
    };
  }
  componentDidMount(){
    this._isMounted = true;
    this.setState({ loading: true });
    fetch(
      `/api/yelp/reviews?id=${this.props.selectedBusinessId}`
    )
    .then(response => response.json())
    .then(data => {
      if(this._isMounted){
        this.setState({ reviewList: data.reviews });
        this.setState({ loading: false });
      }
    })
    .catch(e => {
      console.log(e);
    });
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  renderReview(review) {
    return (
      <ListItem className="review-item" key={review.id}>
        <Review review={review} />
      </ListItem>
    );
  }
  render() {
    return (
      <List component="nav" className="review-list">
        { this.state.reviewList
          ? this.state.reviewList.map(this.renderReview)
          : ( this.state.loading === true
              ? (<CircularProgress />)
              : (null)
          )
        }
      </List>
    );
  }
}
export default ReviewList;
