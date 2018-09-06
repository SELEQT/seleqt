import React, { Component } from 'react';
import queryString from 'query-string';

class MainPage extends Component {

    state = {
        searchTrack: "",
        searchResult: {}
    }
    
    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        this.setState({ accessToken: accessToken });
    
        fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())
        .then(data => console.log(data))   

        fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())
        .then(userData => console.log(userData))

        fetch('https://api.spotify.com/v1/playlists/06wlDvTG9kGkPtOIxpgDm8', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())
        .then(masterPlaylist => console.log(masterPlaylist))
    }

    onHandleSearch = (event) => {

        this.setState({ [event.target.name]: event.target.value })

        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        fetch(`https://api.spotify.com/v1/search?query=${event.target.value}&type=track&market=SE&offset=0&limit=3`, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => response.json())
        .then(data => this.setState({searchResult: data }))
    }

    resetSearchResult = () => {
        this.setState({ searchResult: {} });
    }

    render() {

        let listOfResult;
        if (Object.getOwnPropertyNames(this.state.searchResult).length !== 0) {
            if(this.state.searchTrack) {
             const search = this.state.searchResult.tracks.items;
            listOfResult = search.map(track => (
            <div key={track.id}>
                {track.name}
                <p>{track.artists[0].name}</p>
                <img src={track.album.images[2].url} />
                <hr></hr>
            </div>
            ))
        }
            else {
                this.resetSearchResult();
            }
        
        }

        return (
            <div>
                <header>


                </header>
                <input 
                    type="text"
                    name="searchTrack"
                    id="searchTrack"
                    value={this.state.searchTrack}
                    onChange={this.onHandleSearch}
                />
                <h2>Main Page</h2>
                { listOfResult }
            </div>
        )
    }
}

export default MainPage;