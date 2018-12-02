import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import UserRoutes from "./UserRoutes";

describe("UserRoutes Component", () => {
  it("Should render correctly with correct path", () => {
    const match = { path: "/user/home" };
    const userRoutesInstance = shallow(<UserRoutes match={match} />);
    expect(userRoutesInstance).toMatchSnapshot();
  });
});
