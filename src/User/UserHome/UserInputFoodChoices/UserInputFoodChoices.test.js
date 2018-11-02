import React from 'react';
import UserInputFoodChoices from './UserInputFoodChoices';
import { shallow } from 'enzyme';

test('render UserInputFoodChoices Compoenent correctly', () => {

    const wrapper = shallow(<UserInputFoodChoices >LunchIn</UserInputFoodChoices>)
    expect(wrapper).toMatchSnapshot();
});
