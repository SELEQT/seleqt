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
          myCurrentPoints: 0,
          removeTopTrackFromQueue: false
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
                this.order();
            })
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
            let songs = [...this.state.queuedTracks];
            track.votes = 0;
            songs.push(track);
            console.log(track);
            this.setState({ queuedTracks: songs })
            
            firebase.database().ref(`/queue`).push(track)
        
        }

        toArray = (firebaseObject) => {
            let array = []
            for (let item in firebaseObject) {
              array.push({ ...firebaseObject[item], key: item })
            }
            return array;
        }

        setVotes = (orderedTracks) => {
            this.setState({ queuedTracks: orderedTracks });
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
                <QueueWindow queuedTracks={this.state.queuedTracks} setVotes={this.setVotes}/>}

                <footer className="footer">
                    <nav className="nav">
                        <button className="switch" onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Search </button>
                        <button className="switch" onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Queue </button>
                        {/* <button className="switch" onClick={this.triggerChildPlayplaylist}> Play </button> */}
                    </nav>

                    <Player queuedTracks={this.state.queuedTracks}/>
                    
                </footer>
            </div>
          );
        }
      }
export default MainPage;