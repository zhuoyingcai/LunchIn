import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import BusinessCard from "./BusinessCard";
import toJson, { shallowToJson, mountToJson, renderToJson } from 'enzyme-to-json';

describe("BusinessCard Component", () => {
  describe("When provided with no info", () => {
    it("Should render correctly", () => {
      const businessInstance = shallow(
        <BusinessCard />
      );
      expect(shallowToJson(businessInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with randomFoodName and address", () => {
    it("Should render correctly", () => {
      const randomFoodName = "pizza";
      const address = "20 W 34th St, New York, NY 10001";
      const businessInstance = shallow(
        <BusinessCard randomFoodName={randomFoodName} address={address} />
      );
      expect(shallowToJson(businessInstance)).toMatchSnapshot();
    });
  });
});
