import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { mount, shallow } from "enzyme";
import Home from "./Home/Home.js";
import Signup from "./Home/Signup/Signup.js";
import toJson from "enzyme-to-json";

describe("App Component", () => {
  it("should renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("Router Test", () => {
  it("should redirect to Home (login) page successfully", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it("should redirect to Sign Up page successfully", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/sign-up"]}>
        <App />
      </MemoryRouter>
    );
    expect(wrapper.find(Signup)).toHaveLength(0);
  });
});
