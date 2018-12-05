import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import toJson, { shallowToJson } from "enzyme-to-json";
import UserProfile from "./UserProfile";

describe("UserProfile Component", () => {
  describe("When provided with no props", () => {
    it("Should render correctly", () => {
      const userProfileInstance = shallow(<UserProfile />);
      expect(toJson(userProfileInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with address info", () => {
    it("Should render correctly", () => {
      const address = "160 Convent Ave, New York, NY 10031";
      const lat = 40.8216144;
      const lng = -73.9479427;
      const userProfileInstance = shallow(
        <UserProfile address={address} lat={lat} lng={lng} />
      );
      expect(shallowToJson(userProfileInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with empty address info", () => {
    it("Should render correctly", () => {
      const address = " ";
      const userProfileInstance = shallow(<UserProfile address={address} />);
      expect(shallowToJson(userProfileInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with invalid address info", () => {
    it("Should render correctly", () => {
      const address = "alskdfhwoei";
      const userProfileInstance = shallow(<UserProfile address={address} />);
      expect(shallowToJson(userProfileInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with correct current password and new password", () => {
    it("Should render correctly", () => {
      const currentPassword = "Testing123";
      const email = "gerry@gmail.com";
      const newPassword = "Test1234";
      const userProfileChangePasswordInstance = shallow(
        <UserProfile
          currentPassword={currentPassword}
          email={email}
          newPassword={newPassword}
        />
      );
      expect(
        shallowToJson(userProfileChangePasswordInstance)
      ).toMatchSnapshot();
    });
  });
  describe("When provided with wrong current password and no new password", () => {
    it("Should render correctly", () => {
      const currentPassword = "Testing123";
      const email = "Testing123@gmail.com";
      const newPassword = "";
      const userProfileChangePasswordInstance = shallow(
        <UserProfile
          currentPassword={currentPassword}
          email={email}
          newPassword={newPassword}
        />
      );
      expect(
        shallowToJson(userProfileChangePasswordInstance)
      ).toMatchSnapshot();
    });
  });
  describe("When provided with correct email and new email", () => {
    it("Should render correctly", () => {
      const currentPassword = "gerry123";
      const email = "gerry@gmail.com";
      const newEmail = "gerry@email.com";
      const userProfileChangeEmailInstance = shallow(
        <UserProfile
          currentPassword={currentPassword}
          email={email}
          newEmail={newEmail}
        />
      );
      expect(shallowToJson(userProfileChangeEmailInstance)).toMatchSnapshot();
    });
  });
  describe("When provided with incorrect email and new email", () => {
    it("Should render correctly", () => {
      const currentPassword = "fakdsjfkladj123";
      const email = "fsdjfla@gmail.com";
      const newEmail = "gerry@email.com";
      const userProfileChangeEmailInstance = shallow(
        <UserProfile
          currentPassword={currentPassword}
          email={email}
          newEmail={newEmail}
        />
      );
      expect(shallowToJson(userProfileChangeEmailInstance)).toMatchSnapshot();
    });
  });
});
