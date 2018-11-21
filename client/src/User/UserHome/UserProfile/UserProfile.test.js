import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import UserProfile from "./UserProfile";

describe("UserProfile Component", () => {
  describe("When provided with no props", () => {
    it("Should render correctly", () => {
      const userProfileInstance = shallow(<UserProfile />);
      expect(userProfileInstance).toMatchSnapshot();
    });
  });
  describe("When provided with address info", () => {
    it("Should render correctly", () => {
      const address = "160 Convent Ave, New York, NY 10031"
      const lat = 40.8216144
      const lng = -73.9479427
      const userProfileInstance = shallow(
        <UserProfile 
            address={address}
            lat={lat}
            lng={lng}
        />
      );
      expect(userProfileInstance).toMatchSnapshot();
    });
  });
  describe("When provided with empty address info", () => {
    it("Should render correctly", () => {
      const address = " "
      const userProfileInstance = shallow(
        <UserProfile 
            address={address}
        />
      );
      expect(userProfileInstance).toMatchSnapshot();
    });
  });
  describe("When provided with invalid address info", () => {
    it("Should render correctly", () => {
      const address = "alskdfhwoei"
      const userProfileInstance = shallow(
        <UserProfile 
            address={address}
        />
      );
      expect(userProfileInstance).toMatchSnapshot();
    });
  });

});
