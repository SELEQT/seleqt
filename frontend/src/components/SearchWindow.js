import React, { Component } from 'react';
import queryString from 'query-string';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import QueueWindow from './QueueWindow';
import firebase from '../firebase';
import missingAlbum from '../images/seleqt_icon_gradient.png';

import { connect } from 'react-redux';
import { getTracks, addTrack } from '../actions/tracksActions';
import { getUser } from '../actions/userActions';

class searchWindow extends Component {

  state = {
    serverData: {},
    accessToken: "",
    searchResult: {},
    searchTrack: "",
    gotData: false,
    goToQueue: false
  }

  componentDidMount() {
    /* let parsed = queryString.parse(window.location.search);
    let accessToken = this.props.accessToken;
    this.setState({accessToken: accessToken});
    console.log(this.props.accessToken) */

    // Load user state from redux
    this.props.getUser();

    let parsed = queryString.parse(window.location.search);

    let refreshToken = parsed.refresh_token;

    fetch(`http://localhost:8888/refresh_token?refresh_token=${refreshToken}`, {
            method: "GET"
    })
    .then(response => response.json())
    .then(data => this.setState({accessToken: data.access_token}))

    

  }
  
  onHandleSearchInput = (event) => {
    this.setState({ [event.target.name]: event.target.value })
    if (event.target.value) {
      fetch(`https://api.spotify.com/v1/search?query=${event.target.value}&type=track&market=SE&offset=0&limit=15`, {
      headers: {'Authorization': 'Bearer ' + this.state.accessToken}
    }).then(response => response.json())
    .then(data => this.setState({searchResult: data, gotData: true}))
    .catch(error => {
      console.log("No Results");
    })
    }
  }

  addToQueue = (trackToAdd) => {

    // Load state value of users and tracks from redux
    const { tracks } = this.props.track;
    const { users } = this.props.user;

    // Check if tracks is empty. If not empty, sorting needs to be applied
    if (tracks) {
      let checkedSongs = tracks.filter((track) => {
        return track.id == trackToAdd.id
      })
      
      if (checkedSongs.length === 0){
        trackToAdd.addedBy = users[0].email;
        trackToAdd.addedByKey = users[0].id;
        trackToAdd.votes = 0;
        console.log(trackToAdd)
        this.props.addTrack(trackToAdd, trackToAdd.id);
      }
      else {
        alert(trackToAdd.name + " is already queued.");
      }
    }
    else {
      trackToAdd.addedBy = users[0].email;
      trackToAdd.addedByKey = users[0].id;
      trackToAdd.votes = 0;
      console.log(trackToAdd)
      this.props.addTrack(trackToAdd, trackToAdd.id);
    }
/* 
    this.props.addTrack(track, track.id);
    console.log("track: " + track.id) */
  }

  convertToMinSeC = (ms) => {
    let s = ms / 1000;
    let restS = s % 60;
    let wholeMinS = s - restS;
    let min = wholeMinS / 60;

    return min + "m " + Math.round(restS) + "s";
  }

  render() {
    
    let listOfResult;
    if (this.state.gotData) {
    const annonser = this.state.searchResult.tracks.items;
    listOfResult = annonser.map(annons => <div key={annons.id} className="track">

      <img className="songImage" src={
        annons.album.images.length === 0
        ? missingAlbum
        : annons.album.images[2].url
        } 

        />
      <div className="info">
        <p className="songName">{annons.name}</p>
        <p className="artistName">{annons.artists[0].name}</p>
        <p className="albumName">{annons.album.name}</p>
        <p className="length"> <span className="far fa-clock"> </span> {this.convertToMinSeC(annons.duration_ms)} </p>

      </div>


      <br />
      <button className="addToQueue" onClick={() => this.addToQueue(annons)}>Queue</button>
    </div>);
  }
  
    return (
    <div className="window">
      <div className="searchHeader">
        <div className="searchHeaderText">
          <h1> Search </h1>
          <input type="text" name="searchTrack" className="searchBox" placeholder="Search for Spotify tracks here.."value={this.state.searchTrack} onChange={this.onHandleSearchInput} />
        </div>
      </div>
      <div className="search">
          {listOfResult}
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  track: state.track,
  user: state.user
})

export default connect(mapStateToProps, { getTracks, addTrack, getUser })(searchWindow);