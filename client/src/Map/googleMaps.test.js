import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import GoogleM from "./googleMaps";

describe("Maps Component", () => {
  describe("When provided with no info", () => {
    it("Should render correctly", () => {
      const mapInstance = shallow(
        <GoogleM />
      );
      expect(mapInstance).toMatchSnapshot();
    });
  });
  describe("When provided with food and address info", () => {
    it("Should render correctly", () => {
      const food = "Pizza";
      const address = "160 Convent Ave, New York, NY 10031"
      const lat = 40.8216144
      const lng = -73.9479427
      const mapInstance = shallow(
        <GoogleM 
            food={food} 
            address={address}
            lat={lat}
            lng={lng}
        />
      );
      expect(mapInstance).toMatchSnapshot();
    });
  });
});
