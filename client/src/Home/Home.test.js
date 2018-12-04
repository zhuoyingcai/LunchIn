import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Home from "./Home";
import toJson, { shallowToJson, renderToJson } from "enzyme-to-json";
import { firebase } from "../Config";

describe("Home Component", () => {
  it("Should render correctly with correct path", () => {
    const HomeInstance = shallow(<Home />);
    expect(toJson(HomeInstance)).toMatchSnapshot();
  });

  describe("When provided with user login info", () => {
    it("Should render correctly", () => {
      const email = "gerry@gmail.com";
      const password = "gerry123";
      const loginInstance = shallow(<Home email={email} password={password} />);
      expect(shallowToJson(loginInstance)).toMatchSnapshot();
    });
  });

  describe("When provided with no email for login", () => {
    it("Should render correctly", () => {
      const email = " ";
      const password = "gerry123";
      const loginInstance = shallow(<Home email={email} password={password} />);
      expect(shallowToJson(loginInstance)).toMatchSnapshot();
    });
  });

  describe("When provided with incorrect credential for login", () => {
    it("Should render correctly", () => {
      const email = "ajfakljfad@test.com";
      const password = "kajasjdalskj";
      const loginInstance = shallow(<Home email={email} password={password} />);
      expect(shallowToJson(loginInstance)).toMatchSnapshot();
    });
  });

  describe("When provided with no email or password for login", () => {
    it("Should render correctly", () => {
      const email = "";
      const password = "";
      const loginInstance = shallow(<Home email={email} password={password} />);
      expect(shallowToJson(loginInstance)).toMatchSnapshot();
    });
  });

  describe("When provided with no password for login", () => {
    it("Should render correctly", () => {
      const email = "gerry@gmail.com";
      const password = "";
      const loginInstance = shallow(<Home email={email} password={password} />);
      expect(shallowToJson(loginInstance)).toMatchSnapshot();
    });
  });

  describe("Firebase mock firebase login when logging in", () => {
    it("Should successfully log in", async done => {
      const spy = jest.spyOn(firebase, "auth");
      const LoginInstance = shallow(<Home />);
      const instance = LoginInstance.instance();
      instance.setState({
        email: "gerry@gmail.com",
        password: "gerry123"
      });
      await instance.login();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
      done();
    });
    it("Should unsuccessfully login due to wrong email and password", async done => {
      const spy = jest.spyOn(firebase, "auth");
      const LoginInstance = shallow(<Home />);
      const instance = LoginInstance.instance();
      instance.setState({
        email: "tesdasdassadsa.com",
        password: "asdas"
      });
      await instance.login();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
      done();
    });
  });
});
