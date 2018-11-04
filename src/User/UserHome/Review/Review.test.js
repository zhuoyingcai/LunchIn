import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Review from "./Review";

describe("Review Component", () => {
  describe("When provided with no info", () => {
    it("Should render correctly", () => {
      const reviewInstance = shallow(
        <Review />
      );
      expect(reviewInstance).toMatchSnapshot();
    });
  });
  describe("When provided with review info", () => {
    it("Should render correctly", () => {
      const businesses = [
        {
          "rating": 4.5,
          "price": "$$",
          "phone": "+14154212337",
          "id": "molinari-delicatessen-san-francisco",
          "categories": [
            {
              "alias": "delis",
              "title": "Delis"
            }
          ],
          "review_count": 910,
          "name": "Molinari Delicatessen",
          "url": "https://www.yelp.com/biz/molinari-delicatessen-san-francisco",
          "coordinates": {
            "latitude": 37.7983818054199,
            "longitude": -122.407821655273
          },
          "image_url": "http://s3-media4.fl.yelpcdn.com/bphoto/6He-NlZrAv2mDV-yg6jW3g/o.jpg",
          "location": {
            "city": "San Francisco",
            "country": "US",
            "address2": "",
            "address3": "",
            "state": "CA",
            "address1": "373 Columbus Ave",
            "zip_code": "94133"
          }
        },
        {
          "rating": 4,
          "image_url": "",
          "name": "North India Restaurant",
          "url": "https://www.yelp.com/biz/north-india-restaurant-san-francisco",
          "review_count": 551,
          "coordinates": {
            "latitude": null,
            "longitude": null
          },
          "id": "north-india-restaurant-san-francisco",
          "categories": [
            {
              "alias": "indpak",
              "title": "Indian"
            }
          ]
        }
      ];
      const reviewInstance = shallow(
        <Review businesses={businesses} />
      );
      expect(reviewInstance).toMatchSnapshot();
    });
  });
});
