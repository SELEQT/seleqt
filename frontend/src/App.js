import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import Login from './components/Login';
import QueueWindow from './components/QueueWindow';

class App extends Component {

  state = {
    serverData: {},
    accessToken: "",
    searchResult: {},
    searchTrack: "",
    bool: false,
    queuedTracks: [],
    goToQueue: false
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    this.setState({accessToken: accessToken});

    fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => console.log(data)
    )
  }

  onHandleSearchInput = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onHandleSearch = () => {
    fetch(`https://api.spotify.com/v1/search?query=${this.state.searchTrack}&type=track&market=SE&offset=0&limit=3`, {
      headers: {'Authorization': 'Bearer ' + this.state.accessToken}
    }).then(response => response.json())
    .then(data => this.setState({searchResult: data, bool: true}))
  }

  addToQueue = (track) => {
    let songs = [...this.state.queuedTracks];
    track.votes = 0;
    songs.push(track);
    this.setState({ queuedTracks: songs })
  }


  render() {
   let listOfResult;
    if (this.state.bool) {
    const annonser = this.state.searchResult.tracks.items;
    listOfResult = annonser.map(annons => (
      <div key={annons.id}>
      <p><strong>{annons.name}</strong></p>
        <p><em>{annons.artists[0].name}</em></p>
        <img src={annons.album.images[2].url} />
        <br/>
        <button onClick={ () =>  this.addToQueue(annons)}> Add to queue </button>
        <hr></hr>
      </div>
    ))
  } 
    return (
      <div className="App">

        {/* <Login /> */}
        {!this.state.goToQueue ?
          <div> 
            <button onClick={() => window.location = 'http://localhost:8888/login'}>Sign in with spotify</button>
            <input
              type="text"
              name="searchTrack"
              value={this.state.searchTrack}
              onChange={this.onHandleSearchInput}
            />
            <button onClick={this.onHandleSearch}> Search </button>
            <h2>Search Result</h2>
            { listOfResult }
          </div>
        : 
        <QueueWindow queuedTracks={this.state.queuedTracks} />}
        <button onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Switch </button> 
      </div>
    );
  }
}

export default App;
