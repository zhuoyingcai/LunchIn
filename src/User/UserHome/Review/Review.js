import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
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
				this.setState({businesses: data.jsonBody.businesses});
			})
			.catch(e => console.log(e));
  }

  renderReview(review){
    return (
      <Card className="review-card">
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
              Price: {review.price} <br/>
              Rating: {review.rating} <br/>
              Review Counts: {review.review_count}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  render(){
    return (
      <div className="review-list">
        { this.props.term
          ? (
              <div className="selected-food">
                Testing Review Cards for Google Maps for later <br />
                Food Selected: {this.props.term}
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
