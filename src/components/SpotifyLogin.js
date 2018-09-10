import React, { Component } from 'react';

class SpotifyLogin extends Component {

  render () {
    return (
      <div className="center">

        <h2>Connect to AW-ACADEMY</h2>
        <p>Password: Melodifestivalen</p> 

        <button className="btn" onClick={() => window.location = 'http://localhost:8888/login'}>
          Sign in with Spotify
        </button>
      </div>
    )
  }
}

export default SpotifyLogin;