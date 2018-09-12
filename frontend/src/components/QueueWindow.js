import React, { Component } from 'react';
import queryString from 'query-string';
import firebase from '../firebase';
import missingAlbum from '../images/seleqt_icon_gradient.png';
class QueueWindow extends Component {

  state = {
    tracks: [],
  }

  componentDidMount(){
      let songs = [];
      for (let song of this.props.queuedTracks){
        songs.push(song);
      }
    // this.setState({ tracks: songs })

    firebase.database().ref(`/queue`).on('value', (snapshot) => {
      let queue = this.toArray(snapshot.val());
      let sorted = this.orderOnMount(queue);
      this.setState({ tracks: sorted })
    })
  }

  toArray = (firebaseObject) => {
    let array = []
    for (let item in firebaseObject) {
      array.push({ ...firebaseObject[item], key: item })
    }
    return array;
  }
  
  orderOnMount = (queue) => {
    let orderedTracks = queue;
    orderedTracks.sort(function(a, b){
        return b.votes - a.votes
    });
    return orderedTracks;
  }

  order = () => {
    let orderedTracks = [...this.state.tracks];
    orderedTracks.sort(function(a, b){
        return b.votes - a.votes
    });
    this.setState({ tracks : orderedTracks });
  }

  upvote = (track) => {
    track.votes++;
    this.order();
    // this.props.setVotes(this.state.queuedTracks);

    firebase.database().ref(`/queue/${track.key}`).set(track);
  }

  convertToMinSeC = (ms) => {
    let s = ms / 1000;
    let restS = s % 60;
    let wholeMinS = s - restS;
    let min = wholeMinS / 60;
    
    return min + "m " + Math.round(restS) + "s";
  }

  render() {
   let queue;
    if (this.state.tracks) {
    const annonser = [...this.state.tracks];
    queue = annonser.map(annons => (
      <React.Fragment>
        { annons.votes !== 100000 &&
        <div key={annons.id} className="track">
          <img className="songImage" src={
          !annons.album.images
          ? missingAlbum
          : annons.album.images[2].url
          }/>
          <div className="info">
              <p className="songName">{annons.name}</p>
              <p className="artistName">{annons.artists[0].name} -</p>
              <p className="albumName">{annons.album.name}</p>
              <p className="length"> {this.convertToMinSeC(annons.duration_ms)} </p>
          </div>
          <p className="voteNumber"> {annons.votes} </p>

          <i className="far fa-arrow-alt-circle-up upvote" onClick={ () =>  this.upvote(annons)}> </i>
        </div>
        }
      </React.Fragment>
    ))
  } 
    return (
    <div className="window">
        <div className="queueHeader">
          <div className="queueHeaderText">
            <h1> Active Queue </h1>
            <h2> at 'Restaurant-name' </h2>
          </div>
        </div>
        <div className="queue">
          {queue}
        </div>
      </div>
    );
  }
}

export default QueueWindow;
