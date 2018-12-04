import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Review from "./Review";
import toJson, { shallowToJson, mountToJson, renderToJson } from 'enzyme-to-json';

describe("Review Component", () => {
  describe("When provided with no info", () => {
    it("Should render correctly", () => {
      const reviewInstance = shallow(
        <Review />
      );
      expect(shallowToJson(reviewInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with review info", () => {
    it("Should render correctly", () => {
      const review =
      {
        "id": "xAG4O7l-t1ubbwVAlPnDKg",
        "rating": 5,
        "user": {
          "id": "W8UK02IDdRS2GL_66fuq6w",
          "profile_url": "https://www.yelp.com/user_details?userid=W8UK02IDdRS2GL_66fuq6w",
          "image_url": "https://s3-media3.fl.yelpcdn.com/photo/iwoAD12zkONZxJ94ChAaMg/o.jpg",
          "name": "Ella A."
        },
        "text": "Went back again to this place since the last time i visited the bay area 5 months ago, and nothing has changed. Still the sketchy Mission, Still the cashier...",
        "time_created": "2016-08-29 00:41:13",
        "url": "https://www.yelp.com/biz/la-palma-mexicatessen-san-francisco?hrid=hp8hAJ-AnlpqxCCu7kyCWA&adjust_creative=0sidDfoTIHle5vvHEBvF0w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=0sidDfoTIHle5vvHEBvF0w"
      };
      const reviewInstance = shallow(
        <Review review={review} />
      );
      expect(shallowToJson(reviewInstance)).toMatchSnapshot();
    });
  });
});
