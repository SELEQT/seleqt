import React, { Component } from 'react';
import queryString from 'query-string';

class SpotifyLogin extends Component {

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    this.setState({ accessToken: accessToken });

    fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => console.log(data)
      )
  }

  render () {
    return (
      <div>
        <button onClick={() => window.location = 'http://localhost:8888/login'}>
          Sign in with Spotify
        </button>

          {/* <input
            type="text"
            name="searchTrack"
            value={this.state.searchTrack}
            onChange={this.onHandleSearchInput}
          />
          <button onClick={this.onHandleSearch}>search</button> */}
      </div>
    )
  }
}

export default SpotifyLogin;