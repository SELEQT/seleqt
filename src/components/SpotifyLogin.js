import React, { Component } from 'react';

class SpotifyLogin extends Component {

  render () {
    return (
      <div className="center">

        <h2>Connect to AW-ACADEMY</h2>
        <p>Password: Melodifestivalen</p> 

        <button className="btn" onClick={() => window.location = 'https://whispering-plateau-16661.herokuapp.com/'}>
          Sign in with Spotify
        </button>
      </div>
    )
  }
}

export default SpotifyLogin;