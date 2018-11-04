import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import UserProfile from "./UserProfile";

describe("UserProfile Component", () => {
  describe("When provided with no props", () => {
    it("Should render correctly", () => {
      const userProfileInstance = shallow(
        <UserProfile />
      );
      expect(userProfileInstance).toMatchSnapshot();
    });
  });
});
