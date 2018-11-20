import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Signup from "./Signup";

describe("Signup Component", () => {
  it("Should render correctly with correct path", () => {
    const SignupInstance = shallow(<Signup />);
    expect(SignupInstance).toMatchSnapshot();
  });
  describe("When provided with user info", () => {
    it("Should render correctly", () => {
      const name = "Test";
      const email = "test@example.com"
      const address = "160 Convent Ave, New York, NY 10031"
      const password = "password"
      const lat = 40.8216144
      const lng = -73.9479427
      const SignupInstance = shallow(
        <Signup 
            name={name} 
            email={email}
            address={address}
            password={password}
            lat={lat}
            lng={lng}
        />
      );
      expect(SignupInstance).toMatchSnapshot();
    });
  });
  describe("When provided with empty address info", () => {
    it("Should render correctly", () => {
      const name = "Test";
      const email = "test@example.com"
      const password = "password"
      const address = " "
      const SignupInstance = shallow(
        <Signup  
            name={name} 
            email={email}
            address={address}
            password={password}
        />
      );
      expect(SignupInstance).toMatchSnapshot();
    });
  });
  describe("When provided with invalid address info", () => {
    it("Should render correctly", () => {
      const name = "Test";
      const email = "test@example.com"
      const password = "password"
      const address = "alskdfhwoei"
      const SignupInstance = shallow(
        <Signup  
            name={name} 
            email={email}
            address={address}
            password={password}
        />
      );
      expect(SignupInstance).toMatchSnapshot();
    });
  });
});
