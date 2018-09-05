import React, { Component } from 'react';
import queryString from 'query-string';

class MainPage extends Component {
    
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

    render() {
        return (
            <div>
                <h2>Main Page</h2>
            </div>
        )
    }
}

export default MainPage;