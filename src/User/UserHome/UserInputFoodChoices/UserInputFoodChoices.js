import React, { Component } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Snackbar,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import "./UserInputFoodChoices.css"
import { firebase } from "../../../Config";
import GoogleM from "../../../Map/googleMaps.js";

class UserInputFoodChoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputFoodName: '',
            foodNames: [],
            reloads: 0,
            keyVal: "first",
            randomFoodName: '',
            lastRandomFood: 'nothing',
            addressName: '',
            processing: false,
            notify: false,
            notifyMsg: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRandomFood = this.handleRandomFood.bind(this);
    }
    componentDidMount() {
        this.fetchInitialData();
        this.fetchInitialData2();
    }
    fetchInitialData() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.database().ref(`Users/${user.uid}/foodNames`).once("value", (snapshot) => {
                    if (snapshot.val() != null) {
                        this.setState({
                            foodNames: this.state.foodNames.concat(snapshot.val())
                        })
                    }
                }, (error) => {
                    console.log("Error: " + error.code);
                })
            }
        });
    }
    fetchInitialData2() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.database().ref(`Users/${user.uid}/address`).once("value", (snapshot) => {
                    if (snapshot.val() != null) {
                        this.setState({
                            addressName: this.state.addressName.concat(snapshot.val())
                        })
                    }
                }, (error) => {
                    console.log("Error: " + error.code);
                })
            }
        });
    }
    handleInputChange(e) {
        if (e.target.value) {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.inputFoodName) {
            this.setState({
                foodNames: this.state.foodNames.concat(this.state.inputFoodName),
                inputFoodName: '',
                processing: true
            });
            const foodNamesRef = firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/foodNames`)
            foodNamesRef.set(this.state.foodNames.concat(this.state.inputFoodName))
                .then(() => {
                    this.setState({ processing: false })
                })
                .catch((error) => {
                    this.setState({
                        notify: true,
                        notifyMsg: error.message,
                        processing: false,
                    });
                })
        }
    }
    handleRandomFood(e) {
        e.preventDefault();
        const rand = this.state.foodNames[Math.floor(Math.random() * this.state.foodNames.length)];
        this.setState({
            lastRandomFood: this.state.randomFoodName,
            randomFoodName: rand,
            processing: true
        })
        
        const foodSelectedRef = firebase.database().ref(`Users/${firebase.auth().currentUser.uid}/foodSelected`)
        foodSelectedRef.set(rand)
            .then(() => {
                this.setState({ processing: false })
            })
            .catch((error) => {
                this.setState({
                    notify: true,
                    notifyMsg: error.message,
                    processing: false,
                });
            })
    }
    renderMaps() { 
        if (this.state.randomFoodName !== this.state.lastRandomFood) {
            if(this.state.reloads % 2 == 0 && this.state.reloads > 0) {
                this.state.reloads++;
                this.state.keyVal = "first";
                // return (
                //     <GoogleM food={this.state.randomFoodName} address={this.state.addressName} key={this.state.keyVal}/>
                // );
            } else {
                this.state.reloads++;
                this.state.keyVal = "second";
                // If the food isn't the same as last time, show the new food
                return (
                    <GoogleM food={this.state.randomFoodName} address={this.state.addressName} key={this.state.keyVal}/>
                );
            }
        } else {
            // If the food is the same as last time, no need to update
            return (
                <GoogleM food={this.state.randomFoodName} address={this.state.addressName} key={this.state.keyVal}/>
            );
        }
    }
    render() {
        return (
            <Card className="input-paper">
                <CardHeader
                    title="Please enter your food choices:"
                />
                <CardContent >
                    <Snackbar
                        onClose={() => {
                            this.setState({ notify: false, notifyMsg: "" });
                        }}
                        open={this.state.notify}
                        autoHideDuration={6000}
                        message={this.state.notifyMsg}
                    />
                    <TextField
                        fullWidth
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                        value={this.state.inputFoodName}
                        className="addFoodChoice"
                        onChange={this.handleInputChange}
                        title="Add your favorite foods"
                        name="inputFoodName"
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
                    {this.state.foodNames.length > 0 ? (
                        <Paper>
                            <Table
                                style={{textAlign: 'center', }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Food Name</TableCell>
                                        <TableCell>Edit</TableCell>
                                        <TableCell>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.foodNames.map((food) => (
                                        <TableRow key={food}>
                                            <TableCell>{food}</TableCell>
                                            <TableCell>
                                                <Button
                                                    color="primary"
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                            <Button
                                                    color="secondary"
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Button
                                style={{ marginTop: 50, marginBottom: 5, marginLeft: 20, marginRight: 20, }}
                                variant="raised"
                                color="secondary"
                                className="input-button"
                                onClick={this.handleRandomFood}
                            >
                                Generate Random Food
                            </Button>
                        </Paper>
                    ) : null}
                    {this.state.randomFoodName !== '' ? (
                        <div>
                            Your Food is: {this.state.randomFoodName}
                            {this.renderMaps()}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        )
    }
}


export default UserInputFoodChoices;