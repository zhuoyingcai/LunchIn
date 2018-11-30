import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Signup from "./Signup";
import toJson, { shallowToJson, mountToJson, renderToJson } from 'enzyme-to-json';
import { firebase } from "../../Config";

describe("Signup Component", () => {
  it("Should render correctly with correct path", () => {
    const SignupInstance = shallow(<Signup />);
    expect(renderToJson(SignupInstance)).toMatchSnapshot();
  });

  describe("When provided with missing user info", () => {
    it("Should render correctly", () => {
      const name = "Test";
      const email = " "
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
      expect(shallowToJson(SignupInstance)).toMatchSnapshot();
    });
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
      expect(shallowToJson(SignupInstance)).toMatchSnapshot();
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
      expect(shallowToJson(SignupInstance)).toMatchSnapshot();
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
      expect(shallowToJson(SignupInstance)).toMatchSnapshot();
    });
  });

	describe("the firebase when signing up", () => {
    it("successfully signs up", async (done) => {
      const spy = jest.spyOn(firebase, 'auth');
      const SignupInstance = shallow(
        <Signup />
      );
      const instance = SignupInstance.instance();
      instance.setState({
        name: "Test",
        email: "testing@testing.com",
        address: "20 W 34th St, New York, NY 10001",
        password: "password"
      });
      const valid = await instance.createUser();
      expect(spy).toHaveBeenCalled();
      const hello = await firebase
        .database()
        .ref()
        .child("users")
        .orderByChild("name")
        .equalTo("Test")
        .on("value", function(snapshot) {
          expect(snapshot.exists());
        });
      spy.mockRestore();
      done();
    });
    it("unsuccessfully sign up due to wrong address", async(done) => {
      const spy = jest.spyOn(firebase, 'auth');
      const SignupInstance = shallow(
        <Signup />
      );
      const instance = SignupInstance.instance();
      instance.setState({
        name: "Tester",
        email: "testing1@testing.com",
        address: "dsadas",
        password: "password"
      });
      const valid = await instance.createUser();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
      done();
    });
	});
});
