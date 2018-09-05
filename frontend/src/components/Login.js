import React from 'react';
import seleqt from '../images/seleqt.png';
import { BrowserRouter, Route, Link } from 'react-router-dom';

function Login() {
    return (
        <div>
            <img className="logo" alt="sd" src={seleqt} />
            <h3 className="header">ENTER CODE</h3>
            <div className="inputContainer">
                <input
                    className="inputField"
                    type="number"
                    placeholder="number"
                />
                <input
                    className="inputField"
                    type="number"
                    placeholder="number"
                />
                <input
                    className="inputField"
                    type="number"
                    placeholder="number"
                />
                <input
                    className="inputField"
                    type="number"
                    placeholder="number"
                />
            </div>

            {/* <button className="submit btn">Submit</button> */}
            <Link  to="/firstTimeUser"><button className="frontPageBtn btn">Submit</button> </ Link>

        </div>
    )
}

export default Login;