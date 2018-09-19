import React, { Component } from 'react';
import seleqtIcon from "../images/seleqt_icon_gradient.png";

class SpotifyLogin extends Component {

  render () {
    return <div className="firstTimeUserContainer">
        <h1 className="tutorialHeader">Welcome to SELEQT</h1>
        <div className="tutorialWindow">
          <div className="queueHeaderText">
            <h1>How to use SELEQT</h1>
          </div>

          <p>1. Search for your favorite tracks</p>
          <p>2. Add them to the qurrent queue</p>
          <p>3. Earn Vote-Points when ur track is voted on</p>
          <p>4. Spend Vote-Points when voting for tracks in the queue</p>
          <p>5. The top voted tracks are being played!</p>

        </div>
        <div>
          <button className="spotifyBtn" onClick={() => (window.location = "https://glacial-meadow-88529.herokuapp.com/login")}>
            Connect to Spotify
          </button>
        </div>
      </div>;
  }
}

export default SpotifyLogin;

