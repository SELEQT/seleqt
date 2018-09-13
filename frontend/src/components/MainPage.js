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
          myCurrentPoints: 0
        }
        
        componentDidMount() {

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
                this.setState({ queuedTracks: tracks});
            })

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
            let songs = [...this.state.queuedTracks];
            track.votes = 0;
            songs.push(track);
            console.log(track);
            this.setState({ queuedTracks: songs })
            
            firebase.database().ref(`/queue`).push(track)
        
        }

        playPlaylist = () => {

            let parsed = queryString.parse(window.location.search);
            let accessToken = parsed.access_token;
            this.setState({
                accessToken: accessToken,
                popped : false,
                playing: true

            });
            let duration = this.state.queuedTracks[0].duration_ms;
            let startTime;
            let difference = 0;
            let ticker = 0;
            let secondsOfSong = 0;
            let updateTime = duration/1000;
            let tickerWidth = 10/updateTime;

            
            console.log(updateTime)
            
            /* Set variables for now playing progress bar */ 
            const progressBar = document.querySelector('.myBar');
            let width = 0;

            let nowPlaying = {
                width: 0,
                time: 0
            }

            // firebase.database().ref(`/nowPlaying/playingSong`).set(nowPlaying);


            
            

            console.log(this.state.queuedTracks);
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
                difference = Date.now() - startTime;
                if (difference >= duration && !this.state.popped){
                    let songs = [...this.state.queuedTracks];
                    songs.shift();

                    firebase.database().ref(`/queue/${this.state.queuedTracks[0].key}`).remove();

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

                    // this.setState({remainingTime: seconds});
                }

                width += tickerWidth;
                // progressBar.style.width = width + '%';

                firebase.database().ref(`/nowPlaying/musicbar`).set(width);

                ticker++;
            }, 100)
        }

        middleware = () => {
            this.playPlaylist();
        }

        toArray = (firebaseObject) => {
            let array = []
            for (let item in firebaseObject) {
              array.push({ ...firebaseObject[item], key: item })
            }
            return array;
        }

        render() {
        
        let restS = this.state.remainingTime % 60;
        let wholeMinS = this.state.remainingTime - restS;
        let min = wholeMinS / 60;

        console.log(this.state.queuedTracks);
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
                <QueueWindow queuedTracks={this.state.queuedTracks} />}

                <footer className="footer">
                    <nav className="nav">
                        <div className="slider">
                            <div className="sliderWindow">
                                <button className="switch" onClick={() => this.setState({ goToQueue: false })}> Search </button>
                                <button className="switch" onClick={() => this.setState({ goToQueue: true })}> Queue </button>
                            </div>
                        </div>
                    </nav>

                    <Player className="player" queuedTracks={this.state.queuedTracks} />

                </footer>
            </div>
          );
        }
      }
export default MainPage;