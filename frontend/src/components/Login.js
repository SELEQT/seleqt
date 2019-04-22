import React, { Component } from 'react';
import seleqt from '../images/seleqt.png';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { timingSafeEqual } from 'crypto';

import { connect } from 'react-redux';
import { addAccessCode } from '../actions/accessCodeActions';


class Login extends Component {

    state = {
        accessCode: [0,0,0,0],
        redirect: false     
    }

    handleChange = (event) => {
        let newAccessCode = [...this.state.accessCode];
        let index = parseInt(event.target.name)
        newAccessCode[index] = event.target.value;
        this.setState({accessCode: newAccessCode});
    }

    submitCode = (event) => {
        event.preventDefault()
        let submitCode = this.state.accessCode.join("");
        console.log(submitCode)
        this.props.addAccessCode(submitCode);  
        console.log("ASDASD")
        this.setState({ redirect: true }); 
    }

    render () {

        if (this.state.redirect) {
            return <Redirect  to="/firstTimeUser"></Redirect>
        }

        return (
            <div className="center">
                <img className="loginLogo" alt="sd" src={seleqt} />
                <h2 className="loginHeader">ENTER CODE</h2>
                <div className="loginInputContainer">
                    <input
                        className="loginInputField"
                        type="number"
                        name="0"
                        value={this.state.accessCode[0]}
                        onChange={this.handleChange}
                    />
                    <input
                        className="loginInputField"
                        type="number"
                        name="1"
                        value={this.state.accessCode[1]}
                        onChange={this.handleChange}
                    />
                    <input
                        className="loginInputField"
                        type="number"
                        name="2"
                        value={this.state.accessCode[2]}
                        onChange={this.handleChange}
                    />
                    <input
                        className="loginInputField"
                        type="number"
                        name="3"
                        value={this.state.accessCode[3]}
                        onChange={this.handleChange}
                    />
                </div>

                <button onClick={this.submitCode} className="frontPageBtn btn">Submit</button>
    
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    accessCodes: state.accessCodes
})

export default connect(mapStateToProps, {addAccessCode })(Login);