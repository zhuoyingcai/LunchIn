import React from 'react';
import UserInputFoodChoices from './UserInputFoodChoices';
import renderer from 'react-test-renderer'

test('render UserInputFoodChoices Compoenent correctly', () => {
    const component = renderer.create(
        <UserInputFoodChoices >LunchIn</UserInputFoodChoices>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
