import React, { Component } from 'react';
import queryString from 'query-string';


class QueueWindow extends Component {

  state = {
    tracks: [],
  }

  componentDidMount(){
      let songs = [];
      for (let song of this.props.queuedTracks){
        songs.push(song);
      }
    this.setState({ tracks: songs })
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
      <div key={annons.id} className="track">
        <img className="songImage" src={annons.album.images[2].url} />
        <div className="info">
            <p className="songName">{annons.name}</p>
            <p className="artistName">{annons.artists[0].name} -</p>
            <p className="albumName">{annons.album.name}</p>
            <p className="length"> {this.convertToMinSeC(annons.duration_ms)} </p>
        </div>
        <p className="voteNumber"> {annons.votes} </p>
        <button className="upvote"onClick={ () =>  this.upvote(annons)}> V</button>
        {/* <button onClick={ () =>  this.removeFromQueue(annons)}> Remove from queue </button>  */}
      </div>
    ))
  } 
    return (
      <div className="window">
        <div className="queueHeader">
            <h1> Active Queue </h1>
            <h2> at 'Restaurant-name' </h2>
        </div>
        <div className="queue">
            { queue } 
        </div>
      </div>
    );
  }
}

export default QueueWindow;
