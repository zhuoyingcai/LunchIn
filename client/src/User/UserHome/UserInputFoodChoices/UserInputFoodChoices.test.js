import React from 'react';
import UserInputFoodChoices from './UserInputFoodChoices';
import { shallow } from 'enzyme';
import toJSON, { shallowToJson, mountToJson, renderToJson } from 'enzyme-to-json';
import { firebase } from "../../../Config";

describe('UserInputFoodChoices Component', () => {
    it('renders UserInputFoodChoices Component correctly', () => {
        const wrapper = shallow(<UserInputFoodChoices />)
        expect(toJSON(wrapper)).toMatchSnapshot();
    })

    it('converts shallow wrapper correctly', () => {
        const wrapper = shallow(<UserInputFoodChoices />)
        expect(shallowToJson(wrapper)).toMatchSnapshot();
    })

    it('converts mount wrapper correctly', () => {
        const wrapper = shallow(<UserInputFoodChoices />)
        expect(mountToJson(wrapper)).toMatchSnapshot();
    })

    it('converts render wrapper correctly', () => {
        const wrapper = shallow(<UserInputFoodChoices />)
        expect(renderToJson(wrapper)).toMatchSnapshot();
    })

    it('sanitize the input before passing as props. Test 1', () => {
        const wrapper = shallow(<UserInputFoodChoices />)
        expect(wrapper.instance().sanitizeInput('\'')).toBe('&#x27;')
    })

    it('sanitizes the inputs before passing as props. Test 2', () => {
        const wrapper = shallow(<UserInputFoodChoices />)
        expect(wrapper.instance().sanitizeInput('"')).toBe('&quot;')
    })

    it('should render UserInputFoodChoices with inputs food.', () => {
        const wrapper = shallow(<UserInputFoodChoices inputFoodName={"halal"} />)
        expect(toJSON(wrapper)).toMatchSnapshot();
    })

    it("Should add the food into the food list ", async done => {
        const spy = jest.spyOn(firebase, "auth");
        const wrapper = shallow(<UserInputFoodChoices />);
        const instance = wrapper.instance();
        instance.setState({
            inputFoodName: 'halal',
            addressName: '160 Convent Avenue'
        });
        await firebase
            .database()
            .ref()
            .child("users")
            .orderByChild("foodNames")
            .limitToFirst(1)
            .on("value", function (snapshot) {
                expect(snapshot.exists());
            });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        done();
    });

    it("Should generate random food from the food list", async done => {
        const spy = jest.spyOn(firebase, "auth");
        const wrapper = shallow(<UserInputFoodChoices />);
        const instance = wrapper.instance();
        instance.setState({
            randomFoodName: 'halal',
            addressName: '160 Convent Avenue'
        });
        await firebase
            .database()
            .ref()
            .child("users")
            .orderByChild("foodSelected")
            .on("value", function (snapshot) {
                expect(snapshot.exists());
            });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        done();
    });

    it("Should generate sanitized random food from the food list", async done => {
        const spy = jest.spyOn(firebase, "auth");
        const wrapper = shallow(<UserInputFoodChoices />);
        const instance = wrapper.instance();
        instance.setState({
            sanitizedRandomFood: 'halal',
            addressName: '160 Convent Avenue'
        });
        await firebase
            .database()
            .ref()
            .child("users")
            .orderByChild("foodSelected")
            .on("value", function (snapshot) {
                expect(snapshot.exists());
            });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        done();
    });

});
