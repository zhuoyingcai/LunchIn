import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Home from "./Home";

describe("Home Component", () => {
  it("Should render correctly with correct path", () => {
    const HomeInstance = shallow(<Home />);
    expect(HomeInstance).toMatchSnapshot();
  });
});

describe("When provided with user login info", () => {
  it("Should render correctly", () => {
    const email = "gerry@gmail.com";
    const password = "gerry123";
    const loginInstance = shallow(<Home email={email} password={password} />);
    expect(loginInstance).toMatchSnapshot();
  });
});

describe("When provided with no email for login", () => {
  it("Should render correctly", () => {
    const email = " ";
    const password = "gerry123";
    const loginInstance = shallow(<Home email={email} password={password} />);
    expect(loginInstance).toMatchSnapshot();
  });
});

describe("When provided with incorrect credential for login", () => {
  it("Should render correctly", () => {
    const email = "ajfakljfad@test.com";
    const password = "kajasjdalskj";
    const loginInstance = shallow(<Home email={email} password={password} />);
    expect(loginInstance).toMatchSnapshot();
  });
});

describe("When provided with no email or password for login", () => {
  it("Should render correctly", () => {
    const email = "";
    const password = "";
    const loginInstance = shallow(<Home email={email} password={password} />);
    expect(loginInstance).toMatchSnapshot();
  });
});

describe("When provided with no password for login", () => {
  it("Should render correctly", () => {
    const email = "gerry@gmail.com";
    const password = "";
    const loginInstance = shallow(<Home email={email} password={password} />);
    expect(loginInstance).toMatchSnapshot();
  });
});
