import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import "./Review.css";

class Review extends Component {
  constructor(props) {
    super(props);
    this.renderReview = this.renderReview.bind(this);
  }

  renderReview(review) {
    return (
      <Card className="review-card" key={review.name}>
        <CardActionArea>
          <CardMedia
            className="review-card-media"
            image={review.image_url}
            title={review.image_url}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {review.name}
            </Typography>
            <Typography component="p">
              Price: {review.price} <br />
              Rating: {review.rating} <br />
              Review Counts: {review.review_count}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  render() {
    return (
      <div className="review-list">
        {!!this.props.businesses
          ? (this.props.businesses.map(this.renderReview))
          : null
        }
      </div>
    );
  }
}
export default Review;
