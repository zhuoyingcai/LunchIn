import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { mount, shallow } from "enzyme";
import Home from "./Home/Home.js";
import Signup from "./Home/Signup/Signup.js";
import toJson, {
  shallowToJson,
  mountToJson,
  renderToJson
} from "enzyme-to-json";

describe("App Component", () => {
  it("should renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it("converts shallow wrapper correctly", () => {
    const wrapper = shallow(<App />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
  it("converts mount wrapper correctly", () => {
    const wrapper = shallow(<App />);
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
  it("converts render wrapper correctly", () => {
    const wrapper = shallow(<App />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
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
