import React, { Component } from 'react';
import firebase from '../firebase';
import queryString from 'query-string';
import missingAlbum from '../images/seleqt_icon_gradient.png';

class Player extends Component {

    state = {
        queuedTracks: [],
        popped: false,
        currentLoop: "",
        devices: "5326eff26026e253173bf71d0aa50e2492b49c2a",
        playing: false,
        remainingTime: 0,
        userId: {},
        myCurrentPoints: 0,
        canPlay: false
    }

    componentDidMount() {
        this.displayTimer()
    }

    playPlaylist = () => {
        if (!this.props.queuedTracks.length == 0){
            this.setState({ canPlay: true });
            let parsed = queryString.parse(window.location.search);
            let accessToken = parsed.access_token;
            this.setState({
                accessToken: accessToken,
                popped : false,
                playing: true
            });
            this.setVotesHigh(this.props.queuedTracks[0]);
            let duration = this.props.queuedTracks[0].duration_ms;
            let startTime;
            let timePlayed = 0;
            let ticker = 0;
            let secondsOfSong = 0;
            let updateTime = duration/1000;
            let tickerWidth = 10/updateTime;

            let width = 0;

            
            // console.log(updateTime)

            // console.log(this.props.queuedTracks);
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.devices}`, {
                method: 'PUT',
                body: JSON.stringify({
                    "uris": [`${this.props.queuedTracks[0].uri}`],
                    "position_ms": 0
                }),
                headers: { 'Authorization': 'Bearer ' + accessToken } 
            })
            .then( startTime = Date.now() )
            const interval = setInterval(() =>{
                timePlayed = Date.now() - startTime;
                if (timePlayed >= duration && !this.state.popped){
                    let songs = [...this.props.queuedTracks];
                    songs.shift();
                    firebase.database().ref(`/queue/${this.props.queuedTracks[0].key}`).remove();
                    this.setState({ queuedTracks: songs })
                    this.setState({ popped : true });    
                };
                if (this.state.popped) {
                    this.middleware();
                    clearInterval(interval)
                } else {
                    
                    width += tickerWidth;
                    // progressBar.style.width = width + '%';
                    // console.log(width)
                    firebase.database().ref(`/nowPlaying/musicbar`).set(width);

                }
            
                // Clock
                if (ticker % 10 == 0) {

                    secondsOfSong ++;
                    let durationSeconds = duration / 1000;
                    let seconds = Math.round(durationSeconds - secondsOfSong); 
                    
                    firebase.database().ref(`/nowPlaying/timer`).set(seconds);
                }

                ticker++;
            }, 100)
        } else {
            firebase.database().ref(`/nowPlaying/musicbar`).set(0);
            firebase.database().ref(`/nowPlaying/timer`).set(0);
            console.log("ADASDADAS")
        }
    }

    order = () => {
        let orderedTracks = [...this.state.queuedTracks];
        orderedTracks.sort(function(a, b){
            return b.votes - a.votes
        });
        this.setState({ queuedTracks : orderedTracks });
    }

    middleware = () => {
            this.playPlaylist();
    }

    setVotesHigh = (track) => {
        track.votes = 100000;
        // this.props.setVotesHigh(track);

        firebase.database().ref(`/queue/${track.key}`).set(track);
    
    }
     
    toArray = (firebaseObject) => {
        let array = []
        for (let item in firebaseObject) {
          array.push({ ...firebaseObject[item], key: item })
        }
        return array;
    }

    displayTimer = () => {
        /* Set variables for now playing progress bar */ 
        // const progressBar = document.querySelector('.myBar');

        firebase.database().ref(`/nowPlaying/musicbar`).on('value', (snapshot) => {
            let width = snapshot.val();
            // progressBar.style.width = width + '%';
        })

        firebase.database().ref(`/nowPlaying/timer`).on('value', (snapshot) => {
            let timer = snapshot.val();
            this.setState({ remainingTime: timer });
        })
    }

    render() {

        let restS = this.state.remainingTime % 60;
        let wholeMinS = this.state.remainingTime - restS;
        let min = wholeMinS / 60;

        return (
            <React.Fragment>
                <button className="testbutton" onClick={this.playPlaylist}> Play </button>
            {this.state.canPlay &&
                <div className="nowPlaying">
                    <div className="nowPlayingFlexContainer">
                        <div className="nowPlayingFlexItem">
                        { this.props.queuedTracks[0] &&
                            <img className="nowPlayingImage" alt="Track image" src={
                                !this.props.queuedTracks[0].album.images
                                ? missingAlbum
                                : this.props.queuedTracks[0].album.images[2].url
                                } />
                        }
                        </div>
                        <div className="nowPlayingFlexItem"> 
                            <div>
                            { this.props.queuedTracks[0] &&
                                <p className="nowPlayingText master">Now playing: {this.props.queuedTracks[0].name} by {this.props.queuedTracks[0].artists[0].name}</p>
                            }
                            </div>
                            <div className="myProgress">
                                { this.props.queuedTracks[0] && 
                                <div>
                                    <div className="emptyMyBar"></div>
                                    <p className="remainingTime">{min} m {Math.round(restS)} s</p>
                                </div>
                                }
                                <div className="myBar"></div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            }
            </React.Fragment>
        )
    }            
}

export default Player;