import React, { Component } from 'react';
import firebase from '../firebase';
import queryString from 'query-string';

class Player extends Component {

    state = {
        queuedTracks: [],
        popped: false,
        currentLoop: "",
        devices: "5326eff26026e253173bf71d0aa50e2492b49c2a",
        playing: false,
        remainingTime: 0,
        userId: {},
        myCurrentPoints: 0
    }

    componentDidMount() {
        this.displayTimer()
    }

    playPlaylist = () => {

        
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        this.setState({
            accessToken: accessToken,
            popped : false,
            playing: true
        
        });
        let duration = this.props.queuedTracks[0].duration_ms;
        let startTime;
        let difference = 0;
        let ticker = 0;
        let secondsOfSong = 0;
        let updateTime = duration/1000;
        let tickerWidth = 10/updateTime;

        let width = 0;

        
        console.log(updateTime)

        console.log(this.props.queuedTracks);
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
            difference = Date.now() - startTime;
            if (difference >= duration && !this.state.popped){
                let songs = [...this.props.queuedTracks];
                songs.shift();

                firebase.database().ref(`/queue/${this.props.queuedTracks[0].key}`).remove();

                this.setState({ queuedTracks: songs })
                this.setState({ popped : true });    

            };
            if (this.state.popped) {
                this.middleware();
                clearInterval(interval)
                
            }
        
            // Clock
            if (ticker % 10 == 0) {

                secondsOfSong ++;
                let durationSeconds = duration / 1000;
                let seconds = Math.round(durationSeconds - secondsOfSong); 
                
                firebase.database().ref(`/nowPlaying/timer`).set(seconds);
            }

            width += tickerWidth;
            // progressBar.style.width = width + '%';
            // console.log(width)
            firebase.database().ref(`/nowPlaying/musicbar`).set(width);
            console.log(width)

            ticker++;
        }, 100)
        
    }

    middleware = () => {
        if (this.state.queuedTracks.length !== 0) {
            this.playPlaylist();
        }
    }

    displayTimer = () => {

        /* Set variables for now playing progress bar */ 
        const progressBar = document.querySelector('.myBar');

        firebase.database().ref(`/nowPlaying/musicbar`).on('value', (snapshot) => {
            let width = snapshot.val();
            progressBar.style.width = width + '%';
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

        console.log(this.props.queuedTracks[0]);

        return (
            <div className="nowPlaying">
            <button className="testbutton" onClick={this.playPlaylist}> Play </button>
                <div className="nowPlayingFlexContainer">
                    <div className="nowPlayingFlexItem">
                    { this.props.queuedTracks[0] &&
                        <a href={this.props.queuedTracks[0].uri}><img className="nowPlayingImage" alt="Track image" src={this.props.queuedTracks[0].album.images[2].url} /></a>  
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
        )
    }
}

export default Player;