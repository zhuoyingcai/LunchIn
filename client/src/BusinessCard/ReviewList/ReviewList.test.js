import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import ReviewList from "./ReviewList";

describe("ReviewList Component", () => {
  describe("When provided with no info", () => {
    it("Should render correctly", () => {
      const businessListInstance = shallow(
        <ReviewList />
      );
      expect(businessListInstance).toMatchSnapshot();
    });
  });
  describe("When provided with selectedBusinessId", () => {
    it("Should render correctly", () => {
      const selectedBusinessId = "E8RJkjfdcwgtyoPMjQ_Olg";
      const businessListInstance = shallow(
        <ReviewList selectedBusinessId={selectedBusinessId} />
      );
      expect(businessListInstance).toMatchSnapshot();
    });
  });
});
