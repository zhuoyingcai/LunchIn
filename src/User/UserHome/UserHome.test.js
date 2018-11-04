import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import UserHome from "./UserHome";

describe("UserHome Component", () => {
  describe("When provided with no props", () => {
    it("Should render correctly", () => {
      const userHomeInstance = shallow(
        <UserHome />
      );
      expect(userHomeInstance).toMatchSnapshot();
    });
  });
});
