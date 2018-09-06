import React, { Component } from 'react';
import queryString from 'query-string';

class MainPage extends Component {

    state = {
        searchTrack: "",
        searchResult: {},
        showSearchList: false,
        masterPlaylist: {},
        deviceId: "add2238910e276e27e693896d661b1257859c046"
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
        .then(masterPlaylist => this.setState({ masterPlaylist: masterPlaylist }))
    }

    onHandleSearch = (event) => {

        this.setState({ [event.target.name]: event.target.value })

        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        fetch(`https://api.spotify.com/v1/search?query=${event.target.value}&type=track&market=SE&offset=0&limit=3`, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => response.json())
        .then(data => this.setState({
            searchResult: data, 
            showSearchList: true 
        }))
    }

    addTrackPlaylist = (trackId) => {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
       
        fetch(`https://api.spotify.com/v1/playlists/06wlDvTG9kGkPtOIxpgDm8/tracks?uris=spotify:track:${trackId}`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })
    }

    resetSearchResult = () => {
        this.setState({ searchResult: {} });
    }

    onHandleAddTrack = (trackId) => {
        console.log(trackId)
        this.setState({ showSearchList: false })
        this.addTrackPlaylist(trackId);
    }

    playPlaylist = () => {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=add2238910e276e27e693896d661b1257859c046`, {
            method: 'PUT',
            body: JSON.stringify({
                "context_uri": "spotify:user:amaron:playlist:06wlDvTG9kGkPtOIxpgDm8",
                "offset": {
                "position": 0
                },
                "position_ms": 0
            }),
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })
    }

    render() {
        
        let playlist;
        if (Object.getOwnPropertyNames(this.state.masterPlaylist).length !== 0) {
        
        const masterPlaylist = this.state.masterPlaylist.tracks.items;
        console.log(masterPlaylist)
        playlist = masterPlaylist.map(item => (
            <div onClick={() => this.play(item.track.id)}>
                {item.track.name}
            </div>
        ))
    }
        

        let listOfResult;
        if (Object.getOwnPropertyNames(this.state.searchResult).length !== 0) {
            if(this.state.searchTrack) {
                const search = this.state.searchResult.tracks.items;
                listOfResult = search.map(track => (
                <div key={track.id} onClick={() => this.onHandleAddTrack(track.id)}>
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
                { this.state.showSearchList && listOfResult }
                { playlist }
                <button onClick={this.playPlaylist}>Play</button>
            </div>
        )
    }
}

export default MainPage;