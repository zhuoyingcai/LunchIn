import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Signup from "./Signup";

describe("Signup Component", () => {
  it("Should render correctly with correct path", () => {
    const SignupInstance = shallow(
      <Signup />
    );
    expect(SignupInstance).toMatchSnapshot();
  });
});
