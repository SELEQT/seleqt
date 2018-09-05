import React from 'react';
import seleqt from '../images/seleqt.png';

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

            <button className="submit btn">Submit</button>

        </div>
    )
}

export default Login;