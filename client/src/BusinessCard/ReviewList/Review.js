import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import "./Review.css";

class Review extends Component {
  render() {
    if(this.props.review){
      const r = this.props.review;
      return (
        <Card className="review-card">
            <Grid container>
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <img
                  className="review-card-media"
                  src={r.user.image_url}
                  alt="Failed to load review URL."
                />
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8} xl={8}
                className="review-content"
                >
                <Typography variant="h6" component="h6">
                  {r.user.name}
                </Typography>
                <Typography component="p">
                  {r.time_created.split(' ')[0]} Rating: {r.rating} <br />
                  {r.text}
                </Typography>
              </Grid>
            </Grid>
        </Card>
      );
    }
    else{
      return (<CircularProgress />);
    }
  }
}
export default Review;
