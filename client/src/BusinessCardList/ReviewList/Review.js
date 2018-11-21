import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import "./Review.css";

class Review extends Component {
  render() {
    return (
      <Card className="review-card">
        { this.props.review
          ? (
              <CardActionArea key={this.props.review.id}>
                <CardMedia
                  className="review-card-media"
                  image={this.props.review.user.image_url}
                  title={this.props.review.user.image_url}
                />
                <Typography component="p">
                  {this.props.review.user.name} <br />
                  {this.props.review.time_created} <br />
                  {this.props.review.rating} <br />
                  {this.props.review.text} <br />
                </Typography>
              </CardActionArea>
          ) : <CircularProgress />
        }
      </Card>
    );
  }
}
export default Review;
