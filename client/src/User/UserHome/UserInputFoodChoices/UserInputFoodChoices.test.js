import React from 'react';
import UserInputFoodChoices from './UserInputFoodChoices';
import { shallow } from 'enzyme';

describe('UserInputFoodChoices Component', () => {
    const wrapper = shallow(<UserInputFoodChoices >LunchIn</UserInputFoodChoices>)
    it('render UserInputFoodChoices Compoenent correctly', () => {
        expect(wrapper).toMatchSnapshot();
    })

    it('sanitize the input before passing as props.', () => {
        expect(wrapper.instance().sanitizeInput('\'')).toBe('&#x27;')      
    })
    
});
