import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import queryString from 'query-string';
import Login from './components/Login';
import SpotifyLogin from './components/SpotifyLogin';
import "./App.css";


class App extends Component {

  state = {
    serverData: {},
    accessToken: "",
    searchResult: {},
    searchTrack: "",
    bool: false
  };

  

  onHandleSearchInput = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onHandleSearch = () => {
    fetch(`https://api.spotify.com/v1/search?query=${this.state.searchTrack}&type=track&market=SE&offset=0&limit=3`, {
      headers: {'Authorization': 'Bearer ' + this.state.accessToken}
    }).then(response => response.json())
    .then(data => this.setState({searchResult: data, bool: true}))
  }

  render() {
    /* let listOfResult;
    if (this.state.bool) {
    const annonser = this.state.searchResult.tracks.items;
    console.log(annonser)
    listOfResult = annonser.map(annons => (
      <div key={annons.id}>
        {annons.name}
        <p>{annons.artists[0].name}</p>
        <img src={annons.album.images[2].url} />
        <hr></hr>
      </div>
    ))
  } */
    return (
      <BrowserRouter>
        <div className="App">
          <Login />
          <SpotifyLogin />
           <div>
             <Link  to="/firstTimeUser"><button> Test click </button> </ Link>
           </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
