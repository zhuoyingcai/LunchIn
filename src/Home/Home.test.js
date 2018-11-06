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
