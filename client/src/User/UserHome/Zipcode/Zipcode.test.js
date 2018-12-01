import React from "react";
import {
    shallow
} from "enzyme";
import Zipcode from "./Zipcode";

describe("UserProfile Component", () => {
    describe("When provided with no info", () => {
        it("Should render correctly", () => {
            const zipCodeInstance = shallow( 
                <Zipcode /> 
            );
            expect(zipCodeInstance).toMatchSnapshot();
        });
    });
    describe("When provided with zip code info", () => {
        it("Should render correctly", () => {
            const zipcode = "11102"
            const zipCodeInstance = shallow(
                <Zipcode
                    zipcode={zipcode}
                />
            );
            expect(zipCodeInstance).toMatchSnapshot();
        });
    });
    describe("When provided with no zip code info", () => {
        it("Should render correctly", () => {
            const zipcode = ""
            const zipCodeInstance = shallow(
                <Zipcode
                    zipcode={zipcode}
                />
            );
            expect(zipCodeInstance).toMatchSnapshot();
        });
    });
});