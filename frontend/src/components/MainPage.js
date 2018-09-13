import React, { Component } from 'react';
import ReactDOM from "react-dom";
import queryString from 'query-string';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Burger from './Burger';
import QueueWindow from './QueueWindow';
import SearchWindow from './SearchWindow';
import seleqt from '../images/seleqt.png';
import firebase from '../firebase';
import Player from './Player';
import missingAlbum from '../images/seleqt_icon_gradient.png';


class MainPage extends Component {

    state = {
        queuedTracks: [],
        goToQueue: true,
        popped: false,
        currentLoop: "",
        devices: "5326eff26026e253173bf71d0aa50e2492b49c2a",
        playing: false,
        remainingTime: 0,
        userId: {},
        myCurrentPoints: 0,
        removeTopTrackFromQueue: false,
        timePlayed: 0,
        firebaseUserId: ""
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

    doubleOrder = () => {
        let orderedTracks = [...this.state.queuedTracks];
        orderedTracks.sort(function(a, b){
            return b.votes - a.votes
        });
        return orderedTracks;
    }

    checkUser = (users) => {
        let checkedUsers = users.filter((user) => {
            return user.email == this.state.userId.email
        })
        if (checkedUsers.length == 0) {
            this.addUserToFirebase(this.state.userId)
        } 
        else {
            firebase.database().ref(`/users/${checkedUsers[0].key}`).on('value', (snapshot) => {
                let user = snapshot.val();
                this.setState({ 
                    myCurrentPoints: user.points,
                    firebaseUserId: checkedUsers[0].key
                });
            })
        }

    }

    addUserToFirebase = (data) => {
        const user = {
            points: 100,
            email: data.email
        }
        firebase.database().ref(`/users`).push(user)

        firebase.database().ref(`/users`).once('value', (snapshot) => {
            let users = this.toArray(snapshot.val());
            this.checkUser(users);
        })
    } 

    addToQueue = (track) => {
        let songs = [...this.state.queuedTracks];
        let checkedSongs = songs.filter((song) => {
            return song.id == track.id
        })
        if (checkedSongs.length == 0){
            track.addedBy = this.state.userId.email;
            track.votes = 0;
            firebase.database().ref(`/queue`).push(track);
        } else {
            alert(track.name + " is already queued.");
        }
    }

    toArray = (firebaseObject) => {
        let array = []
        for (let item in firebaseObject) {
            array.push({ ...firebaseObject[item], key: item })
        }
        return array;
    }

    middleware = () => {
        this.setState({ playing: false })
        this.playPlaylist();
    }   

    setVotesHigh = (track) => {
        track.votes = 100000;
        firebase.database().ref(`/queue/${track.key}`).set(track);
    }

    displayTimer = () => {        
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

    reducePoints = () => {
        console.log(this.state.firebaseUserId)
        let reducedPoints = this.state.myCurrentPoints - 10;
        firebase.database().ref(`/users/${this.state.firebaseUserId}/points`).set(reducedPoints);
    }

    playPlaylist = () => {
        if (!this.state.queuedTracks.length == 0){
            let orderedTracks = this.doubleOrder();
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

            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.devices}`, {
                method: 'PUT',
                body: JSON.stringify({
                    "uris": [`${orderedTracks[0].uri}`],
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
                    
                    if (this.state.timePlayed > 0){
                        songIsPlaying = true
                        width = (this.state.timePlayed / duration) * 100;
                        firebase.database().ref(`/nowPlaying/musicbar`).set(width);
                        
                        let durationSeconds = (duration / 1000 ) - (this.state.timePlayed / 1000);
                        let seconds = Math.round(durationSeconds - secondsOfSong); 
                        
                        firebase.database().ref(`/nowPlaying/timer`).set(durationSeconds);
                    }
                }
            }, 100)
        } else {
            firebase.database().ref(`/nowPlaying/musicbar`).set(0);
            firebase.database().ref(`/nowPlaying/timer`).set(0);
            console.log("ADASDADAS")
        }
    }

    shutDown = () => {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;

        firebase.database().ref(`/nowPlaying/musicbar`).set(0);
        firebase.database().ref(`/nowPlaying/timer`).set(0);
        firebase.database().ref(`/queue`).remove();
        this.setState({ queuedTracks: [] })
        this.setState({ popped : true });
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${this.state.devices}`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + accessToken } 
        }) 
    }

    render() {
    
    let restS = this.state.remainingTime % 60;
    let wholeMinS = this.state.remainingTime - restS;
    let min = wholeMinS / 60;

    return (
        <div className="center mainPage">
            <div className="header">
            <div className="pointsFlexContainer">
                <div className="pointsText"> <p> Points</p> </div>
                <div className="points"> {this.state.myCurrentPoints} </div>
            </div>
                <img className="logo" alt="sd" src={seleqt} />
                <Burger shutDown={this.shutDown} playPlayList={this.playPlaylist} playing={this.state.playing} userId={this.state.userId}/>
            </div>

            {!this.state.goToQueue ?
            <SearchWindow addToQueue={this.addToQueue}/>
            : 
            <QueueWindow queuedTracks={this.state.queuedTracks} setVotes={this.setVotes} reducePoints={this.reducePoints}
            myCurrentPoints={this.state.myCurrentPoints} userId={this.state.userId}/>}

            <footer className="footer">
                <nav className="nav">
                <div className="slider">
                    <div className="sliderWindow">
                        { this.state.goToQueue == true ?
                        <React.Fragment>
                            <button className="switch" onClick={() => this.setState({ goToQueue: false })}> Search </button>
                                <button className="switch activeSwitch" onClick={() => this.setState({ goToQueue: true })}> Queue </button>
                        </React.Fragment>
                        :
                        <React.Fragment>
                                <button className="switch activeSwitch" onClick={() => this.setState({ goToQueue: false })}> Search </button>
                            <button className="switch" onClick={() => this.setState({ goToQueue: true })}> Queue </button>
                        </React.Fragment>
                        }
                        </div>
                    </div>
                </nav>

                <React.Fragment>
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
                                        <p className="nowPlayingText master"> <span className="nowPlayingTextStyle">Now playing:</span> {this.state.queuedTracks[0].name} · <span className="playerArtistText">{this.state.queuedTracks[0].artists[0].name}</span></p>
                                }
                                </div>
                                <div className="myProgress">
                                    { this.state.queuedTracks[0] && 
                                    <div>
                                        <div className="emptyMyBar"></div>
                                        <p className="remainingTime"><span className="far fa-clock"> </span> {min}m {Math.round(restS)}s</p>
                                    </div>
                                    }
                                    <div className="myBar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>  
            </footer>
        </div> );
    }
}
export default MainPage;