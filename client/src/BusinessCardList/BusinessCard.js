import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMore from "@material-ui/icons/ExpandMore";
import "./BusinessCard.css";

class BusinessCard extends Component {
  render() {
    if(this.props.business){
      return(
        <Card className="business-card">
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
            <CardActionArea
              onClick={ () => this.props.onClickReviewBtn(this.props.business.id) }
              >
                <ExpandMore />
            </CardActionArea>
          </CardContent>
        </Card>
      );
    }
    else{
      return (<CircularProgress />);
    }
  }
}
export default BusinessCard;
