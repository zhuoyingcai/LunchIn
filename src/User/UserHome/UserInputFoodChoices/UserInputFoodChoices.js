import React, { Component } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
} from "@material-ui/core";
import "./UserInputFoodChoices.css"

class UserInputFoodChoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foodName: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        
    }
    render() {
        return (
            <Card className="input-paper">
                <CardHeader
                    title="Please enter your food choices:"
                />
                <CardContent >
                    <TextField
                        fullWidth
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                        className="addFoodChoice"
                        onChange={this.handleInputChange}
                        title="Add your favorite foods"
                        name="foodName"
                        required
                    />
                    <Button
                        style={{ marginTop: 50, marginBottom: 5, marginLeft: 20, marginRight: 20 }}
                        variant="raised"
                        color="primary"
                        className="input-button"
                        onClick={this.handleSubmit}
                    >
                        Add Food
                        </Button>
                    {/* <Button
                            style={{ marginTop: 50, marginBottom: 5, marginLeft: 20, marginRight: 20,  }}
                            variant="raised"
                            color="secondary"
                            className="input-button"
                            onClick={this.handleSubmit}
                        >
                            Generate Random Food
                        </Button> */}
                </CardContent>
            </Card>
        )
    }
}

export default UserInputFoodChoices;