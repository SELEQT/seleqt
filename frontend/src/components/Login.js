import React from 'react';
import seleqt from '../images/seleqt.png';
import { BrowserRouter, Route, Link } from 'react-router-dom';

function Login() {
    return (
        <div className="center">
            <img className="loginLogo" alt="sd" src={seleqt} />
            <h2 className="loginHeader">ENTER CODE</h2>
            <div className="loginInputContainer">
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="#"
                />
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="#"
                />
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="#"
                />
                <input
                    className="loginInputField"
                    type="number"
                    placeholder="#"
                />
            </div>

            <Link  to="/firstTimeUser"><button className="frontPageBtn btn">Submit</button> </ Link>

        </div>
    )
}

export default Login;