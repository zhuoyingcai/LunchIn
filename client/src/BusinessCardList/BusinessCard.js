import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import "./BusinessCard.css";

class BusinessCard extends Component {
  render() {
    return (
      <Card className="business-card">
        {this.props.business
          ? (
              <CardActionArea key={this.props.business.name}>
                <CardMedia
                  className="business-card-media"
                  image={this.props.business.image_url}
                  title={this.props.business.image_url}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {this.props.business.name}
                  </Typography>
                  <Typography component="p">
                    Price: {this.props.business.price} <br />
                    Rating: {this.props.business.rating} <br />
                    Review Counts: {this.props.business.review_count}
                  </Typography>
                </CardContent>
              </CardActionArea>
            )
            : (<CircularProgress />)
          }
      </Card>
    );
  }
}
export default BusinessCard;
