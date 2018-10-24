import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import "./Review.css";
import { firebase } from "../../../Config";
/*
  This component requires two properties: term, location
*/
class Review extends Component{
  constructor(props){
    super(props);
    this.state = {};
    this.renderReview = this.renderReview.bind(this);
    this.getReviews = this.getReviews.bind(this);
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        // Get user address
        firebase
          .database()
          .ref(`Users/${user.uid}/address`)
          .once(
            "value",
            snapshot => {
              if(snapshot.val() != null){
                this.setState({
                  address: snapshot.val()
                });
              };
            },
            error => {
              console.log("Error: " + error.code);
            }
          );
        // Made a handler for food selected.
        this.foodSelectedRef = firebase
          .database()
          .ref(`Users/${user.uid}/foodSelected`);
        this.foodSelectedRef.on('value', snapshot =>{
          if(snapshot.val() != null){
            this.setState({
              foodSelected: snapshot.val()
            });
            this.getReviews();
          }
        });
      }
    });
  }
  getReviews(){
    console.log(this.state.foodSelected, this.state.location);
		fetch(`/api/yelp?term=${this.state.foodSelected}&location=${this.state.address}`)
			.then(response => response.json())
			.then(data => {
				this.setState({businesses: data.jsonBody.businesses});
			})
			.catch(e => console.log(e));
  }

  renderReview(review){
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
        { this.state.businesses
          ? (this.state.businesses.map(this.renderReview))
          : ("")
        }
      </div>
    );
  }
}
export default Review;
