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

  render() {
   let queue;
    if (this.state.tracks) {
    const annonser = [...this.state.tracks];
    queue = annonser.map(annons => (
      <div key={annons.id} className="track">
      <p className="songName"><strong>{annons.name}</strong></p>
        <button className="upvote"onClick={ () =>  this.upvote(annons)}> Upvote </button>
        <p className="artistName"><em>{annons.artists[0].name}</em></p>
        <img className="songImage" src={annons.album.images[2].url} />
        <p className="voteNumber"> Votes: {annons.votes} </p>
        {/* <button onClick={ () =>  this.removeFromQueue(annons)}> Remove from queue </button>  */}
      </div>
    ))
  } 
    return (
      <div className="window">
        <h2> Queue </h2>
        <hr></hr>
        { queue } 
      </div>
    );
  }
}

export default QueueWindow;
