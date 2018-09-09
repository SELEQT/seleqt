import React, { Component } from 'react';
import queryString from 'query-string';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import QueueWindow from './QueueWindow';
import SearchWindow from './SearchWindow';
import seleqt from '../images/seleqt.png';

class MainPage extends Component {

        state = {
          queuedTracks: [],
          goToQueue: false,
          popped: false,
          currentLoop: "",
          devices: "cf2b62f3ed26ac4b74beaabd28a5d1a9fc46f1bd",
          playing: false
        }
      
        addToQueue = (track) => {
          let songs = [...this.state.queuedTracks];
          track.votes = 0;
          songs.push(track);
          this.setState({ queuedTracks: songs })
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

            /* Set variables for now playing progress bar */ 
            const progressBar = document.querySelector('.myBar');
            let width = 0;

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
            const s = setInterval(() =>{
                difference = Date.now() - startTime;
                if (difference >= duration && !this.state.popped){
                    let songs = [...this.state.queuedTracks];
                    songs.shift();
                    this.setState({ queuedTracks: songs })
                    this.setState({ popped : true });    
                };
                if (this.state.popped) {
                    this.middleware();
                    clearInterval(s)
                    
                }
                // console.log(difference % duration)
                if ((difference % (duration/1000)) < 10 ) {
                    width += 0.1;
                    progressBar.style.width = width + '%';
                }
            }, 10)
        //    .then(this.setState({ currentLoop : setInterval(this.popp(duration, startTime), 10)}))
        }


        middleware = () => {
            this.playPlaylist();
        }

       /*  popp = (duration, startTime) => {
            console.log("go");
            if (Date.now() - startTime >= duration && !this.state.popped){
                let songs = [...this.state.queuedTracks];
                songs.pop(0);
                this.setState({ queuedTracks: songs })
                this.setState({ popped : true });    
            };
            if (this.state.popped) {
                console.log("stop");
                clearInterval(this.state.currentLoop)
                this.playPlaylist();
            }
        } */
        
        

        render() {
          return (
            <div className="center mainPage">
                <header className="header"> 
                    <img className="logo" alt="sd" src={seleqt} />
                </header>
                
                {!this.state.goToQueue ?
                <SearchWindow addToQueue={this.addToQueue}/>
                : 
                <QueueWindow queuedTracks={this.state.queuedTracks} />}

                <footer className="footer">
                    <nav className="nav">
                        <button className="switch" onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Switch </button>
                        <button className="switch" onClick={() => this.setState({ goToQueue: !this.state.goToQueue })}> Switch </button>
                        <button onClick={() => this.playPlaylist()}>hello</button>
                    </nav>
                    
                    <div className="nowPlaying">
                        
                        <div className="nowPlayingFlexContainer">
                            <div className="nowPlayingFlexItem">
                            { this.state.playing &&
                                <a href={this.state.queuedTracks[0].uri}><img className="nowPlayingImage" alt="Track image" src={this.state.queuedTracks[0].album.images[2].url} /></a>  
                            }
                            </div>
                            <div className="nowPlayingFlexItem"> 
                                <div>
                                { this.state.playing &&
                                    <p>Now playing: {this.state.queuedTracks[0].name} by {this.state.queuedTracks[0].artists[0].name}</p>
                                }
                                </div>
                                <div className="myProgress">
                                    { this.state.playing && 
                                        <div className="emptyMyBar"></div>
                                    }
                                    <div className="myBar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
          );
        }
      }

export default MainPage;