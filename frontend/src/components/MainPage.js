import React, { Component } from 'react';
import ReactDOM from "react-dom";
import queryString from 'query-string';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Menu from './Menu';
import QueueWindow from './QueueWindow';
import SearchWindow from './SearchWindow';
import seleqt from '../images/seleqt.png';
import firebase from '../firebase';
import Player from './Player';
import missingAlbum from '../images/seleqt_icon_gradient.png';


class MainPage extends Component {

        state = {
          queuedTracks: [],
          goToQueue: false,
          popped: false,
          currentLoop: "",
          devices: "5326eff26026e253173bf71d0aa50e2492b49c2a",
          playing: false,
          remainingTime: 0,
          userId: {},
          myCurrentPoints: 0,
          removeTopTrackFromQueue: false,
          timePlayed: 0
        }
        
        componentDidMount() {
            const progressBar = document.querySelector('.myBar');
            progressBar.style.width = 0 + '%';

            let parsed = queryString.parse(window.location.search);
            let accessToken = parsed.access_token;

            fetch('https://api.spotify.com/v1/me', {
                headers: {'Authorization': 'Bearer ' + accessToken}
            })
            .then(response => response.json())
            .then(data => this.setState({ userId: data }))
            .then(firebase.database().ref(`/users`).once('value', (snapshot) => {
                let users = this.toArray(snapshot.val());
                this.checkUser(users);
            }))

            firebase.database().ref(`/queue`).on('value', (snapshot) => {
                let tracks = this.toArray(snapshot.val());
                this.setState({ queuedTracks: tracks})
                setTimeout( () => {
                    this.order();

                }, 100)
            })

            this.displayTimer();
        }

        order = () => {
            let orderedTracks = [...this.state.queuedTracks];
            orderedTracks.sort(function(a, b){
                return b.votes - a.votes
            });
            this.setState({ queuedTracks : orderedTracks });
        }

        checkUser = (users) => {
            // this.addUserToFirebase(this.state.userId)           
            let checkedUsers = users.filter((user) => {
                return user.email == this.state.userId.email
            })
            console.log(checkedUsers);
            // console.log(checkedUsers[0].points)
            if (checkedUsers.length == 0) {
                this.addUserToFirebase(this.state.userId)
            } 
            else {
                this.setState({ myCurrentPoints: checkedUsers[0].points });
            }
        }

        addUserToFirebase = (data) => {
            const user = {
                points: 100,
                email: data.email
            }
            firebase.database().ref(`/users`).push(user)
        } 

        addToQueue = (track) => {
            track.votes = 0;
            firebase.database().ref(`/queue`).push(track);
        }

        toArray = (firebaseObject) => {
            let array = []
            for (let item in firebaseObject) {
              array.push({ ...firebaseObject[item], key: item })
            }
            return array;
        }

        middleware = () => {
            this.playPlaylist();
    }   

    setVotesHigh = (track) => {
        track.votes = 100000;

        firebase.database().ref(`/queue/${track.key}`).set(track);
    
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

        playPlaylist = () => {
            if (!this.state.queuedTracks.length == 0){
                this.setState({ canPlay: true });
                let parsed = queryString.parse(window.location.search);
                let accessToken = parsed.access_token;
                this.setState({
                    accessToken: accessToken,
                    popped : false,
                    playing: true
                });
                this.setVotesHigh(this.state.queuedTracks[0]);
                let duration = this.state.queuedTracks[0].duration_ms;
                let startTime;
                let timePlayed = 0;
                let ticker = 0;
                let secondsOfSong = 0;
                let updateTime = duration/1000;
                let tickerWidth = 10/updateTime;
                let songIsPlaying = false;
    
                let width = 0;
    
                
                // console.log(updateTime)
    
                fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.devices}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        "uris": [`${this.state.queuedTracks[0].uri}`],
                        "position_ms": 0
                    }),
                    headers: { 'Authorization': 'Bearer ' + accessToken } 
                })
                .then( startTime = Date.now() )
                const interval = setInterval(() =>{

                    fetch("https://api.spotify.com/v1/me/player", {
                        headers: { 'Authorization': 'Bearer ' + accessToken } 
                    }).then(response => response.json())
                    .then(data => this.setState({ timePlayed: data.progress_ms }));
                    
                    if (this.state.timePlayed > 0){
                        songIsPlaying = true
                    }

                    console.log(this.state.timePlayed)
                    if (this.state.timePlayed == 0 && songIsPlaying && !this.state.popped){
                        let songs = [...this.state.queuedTracks];
                        songs.shift();
                        firebase.database().ref(`/queue/${this.state.queuedTracks[0].key}`).remove();
                        this.setState({ queuedTracks: songs })
                        this.setState({ popped : true });    
                    };
                    if (this.state.popped) {
                        this.middleware();
                        clearInterval(interval)
                    } else {
                        
                        width += tickerWidth;
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

        render() {

        let restS = this.state.remainingTime % 60;
        let wholeMinS = this.state.remainingTime - restS;
        let min = wholeMinS / 60;

        return (
            <div className="center mainPage">
                <div className="header"> 
                <div className="test"></div>
                    <img className="logo" alt="sd" src={seleqt} />
                    <Menu />
                </div>

                {!this.state.goToQueue ?
                <SearchWindow addToQueue={this.addToQueue}/>
                : 
                <QueueWindow queuedTracks={this.state.queuedTracks} setVotes={this.setVotes}/>}

                <footer className="footer">
                    <nav className="nav">
                        <button className="switch" onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Search </button>
                        <button className="switch" onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Queue </button>
                    </nav>

                    <React.Fragment>
                <button className="testbutton" onClick={this.playPlaylist}> Play </button>
            {/* {this.state.canPlay  */}
                <div className="nowPlaying">
                    <div className="nowPlayingFlexContainer">
                        <div className="nowPlayingFlexItem">
                        { this.state.queuedTracks[0] &&
                            <img className="nowPlayingImage" alt="Track image" src={
                                !this.state.queuedTracks[0].album.images
                                ? missingAlbum
                                : this.state.queuedTracks[0].album.images[2].url
                                } />
                        }
                        </div>
                        <div className="nowPlayingFlexItem"> 
                            <div>
                            { this.state.queuedTracks[0] &&
                                <p className="nowPlayingText master">Now playing: {this.state.queuedTracks[0].name} by {this.state.queuedTracks[0].artists[0].name}</p>
                            }
                            </div>
                            <div className="myProgress">
                                { this.state.queuedTracks[0] && 
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
                {/* :<div className="myBar"></div> */}
            {/* } */}
            </React.Fragment>
                    
                </footer>
            </div>
          );
        }
      }
export default MainPage;