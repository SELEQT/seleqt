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
        playing: false,
        remainingTime: 0,
        userId: {},
        myCurrentPoints: 0,
        removeTopTrackFromQueue: false,
        timePlayed: 0,
        firebaseUserId: "",
        devices: [],
        activeDevice: "",
        autoAdd: true
    }
        
    componentDidMount() {
        const progressBar = document.querySelector('.myBar');
        progressBar.style.width = 0 + '%';

        let parsed = queryString.parse(window.location.search);

        let refreshToken = parsed.refresh_token;


        /*  Refresh_token API Call <----------
            Get request to seleqt oauth backend. Sends refresh_token from url as param.
            Response: get a new access_token
            When the response is completed run the rest of the logic in componentDidMount
            by calling the function componentDidMountLogic. Input response as input parameter
        */
        fetch(`http://localhost:8888/refresh_token?refresh_token=${refreshToken}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => this.componentDidMountLogic(data.access_token))        
    
    }   // --------> End function componentDidMount   


    /***************************************** 
    
    ----------> Function sektion <------------
    
    ******************************************/


    /*  Function that contains all logic that shall be done at componentDidMount
        Reason for putting the logic in its own function is because this logic should
        only run once the fetch for retrieving the refreshtoken is complete
        
        Takes the accessToken from the refresh_token API call as input parameter
    */

    componentDidMountLogic = (accessToken) => {

        fetch('https://api.spotify.com/v1/me', {
            headers: {'Authorization': 'Bearer ' + accessToken}
        })
        .then(response => response.json())
        .then(data => this.setState({ userId: data }))
        .then(firebase.database().ref(`/users`).once('value', (snapshot) => {
            let users = this.toArray(snapshot.val());
            this.checkUser(users);
        }))

        fetch(`https://api.spotify.com/v1/recommendations?limit=1&market=SV&seed_artists=${"4dpARuHxo51G3z768sgnrY"}&min_energy=0.4&min_popularity=50`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())
        .then(data => {console.log("Data Tracks " + data.tracks[0].id)})

        fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {'Authorization': 'Bearer ' + accessToken}
        })
        .then(response => response.json())
        .then(data => this.setState({devices: data, activeDevice: data.devices[0].id})) //If no device has been chosen, run on the first found

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
    
    changeDevice = (device) => {
        this.setState({ activeDevice: device })
    }

    addToQueue = (track) => {
        let songs = [...this.state.queuedTracks];
        let checkedSongs = songs.filter((song) => {
            return song.id == track.id
        })
        if (checkedSongs.length == 0){
            track.addedBy = this.state.userId.email;
            track.addedByKey = this.state.firebaseUserId;
            track.votes = 0;
            firebase.database().ref(`/queue`).push(track);
        } else {
            alert(track.name + " is already queued.");
        }
    }

    /*  Similar to addToQueue() but used during autoAdd by spotify recommendation 
        Database value addedBy SELEQT and addedByKey AutoAdded
        Can be utilized in the future for specific handling of autoadded tracks 
    */

    autoAddToQueue = (track) => {
        let songs = [...this.state.queuedTracks];
        let checkedSongs = songs.filter((song) => {
            return song.id == track.id
        })
        if (checkedSongs.length == 0){
            
            track.addedBy = "SELEQT";
            track.addedByKey = "AutoAdded";
            track.votes = 0;
            firebase.database().ref(`/queue`).push(track);
        }
        else {
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

    /* refreshToken = () => {
        fetch(localhost:8888)
    } */

    playPlaylist = () => {
        if (!this.state.queuedTracks.length == 0){


            /*  If theres only 1 track left in queue, use that track and run spotify seed recommendation to get a similar track
                AutoAdd recommended track to queuelist by calling autoAddToQueue() 
                API Documentation https://developer.spotify.com/console/get-recommendations/?limit=&market=US&seed_artists=4YwbSZaYeYja8Umyt222Qf&seed_genres=&seed_tracks=0c6xIDDpzE81m2q797ordA&min_acousticness=&max_acousticness=&target_acousticness=&min_danceability=&max_danceability=&target_danceability=&min_duration_ms=&max_duration_ms=&target_duration_ms=&min_energy=0.4&max_energy=&target_energy=&min_instrumentalness=&max_instrumentalness=&target_instrumentalness=&min_key=&max_key=&target_key=&min_liveness=&max_liveness=&target_liveness=&min_loudness=&max_loudness=&target_loudness=&min_mode=&max_mode=&target_mode=&min_popularity=50&max_popularity=&target_popularity=&min_speechiness=&max_speechiness=&target_speechiness=&min_tempo=&max_tempo=&target_tempo=&min_time_signature=&max_time_signature=&target_time_signature=&min_valence=&max_valence=&target_valence=
            */

            if (this.state.queuedTracks.length == 1) {

                let parsed = queryString.parse(window.location.search);
                let accessToken = parsed.access_token;
    
                console.log(this.state.queuedTracks[0].id)
                fetch(`https://api.spotify.com/v1/recommendations?limit=1&market=SV&seed_tracks=${this.state.queuedTracks[0].id}&min_energy=0.4`, {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                }).then(response => response.json())
                .then(data => {this.autoAddToQueue(data.tracks[0])})
            }

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
            let secondsOfSong = 0;
            let songIsPlaying = false;

            let width = 0;

            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.state.activeDevice}`, {
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
                        width = ((this.state.timePlayed + 1000) / duration) * 100; // ~1s delay of first this.setState({ timeplayed }), added 1s to comenpensate
                        firebase.database().ref(`/nowPlaying/musicbar`).set(width);
                        
                        let durationSeconds = Math.round((duration / 1000 ) - ((this.state.timePlayed + 1000) / 1000));
                        console.log(durationSeconds)
                        firebase.database().ref(`/nowPlaying/timer`).set(durationSeconds);
                    }
                }
            }, 1000)
        }

        else {
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
        fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${this.state.activeDevice}`, {
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
                <Burger shutDown={this.shutDown} playPlayList={this.playPlaylist} playing={this.state.playing} userId={this.state.userId} devices={this.state.devices} activeDevice={this.changeDevice}/>
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