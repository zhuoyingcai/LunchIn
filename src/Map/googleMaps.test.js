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
      const mapInstance = shallow(
        <GoogleM 
            food={food} 
            address={address}
        />
      );
      expect(mapInstance).toMatchSnapshot();
    });
  });
});
