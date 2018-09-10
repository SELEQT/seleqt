import React from 'react';
import seleqt from '../images/seleqt.png';
import { BrowserRouter, Route, Link } from 'react-router-dom';

function Login() {
    return (
        <div className="center">
            <img className="loginLogo" alt="sd" src={seleqt} />
            <h3 className="loginHeader">ENTER CODE</h3>
            <div className="loginInputContainer">
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="number"
                />
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="number"
                />
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="number"
                />
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="number"
                />
            </div>

            <Link  to="/firstTimeUser"><button className="frontPageBtn btn">Submit</button> </ Link>

        </div>
    )
}

export default Login;