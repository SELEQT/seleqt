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
          devices: "add2238910e276e27e693896d661b1257859c046",
          playing: false,
          remainingTime: 0
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
            let ticker = 0;
            let secondsOfSong = 0;
            let updateTime = duration/1000;
            let tickerWidth = 10/updateTime;

            console.log(updateTime)

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
              
                // Clock
                if (ticker % 10 == 0) {

                    secondsOfSong ++;
                    let durationSeconds = duration / 1000;
                    let seconds = Math.round(durationSeconds - secondsOfSong); 
                    
                    this.setState({remainingTime: seconds});
                    
                    
                    
                    // this.setState({remainingTime : <p>${min} m ${Math.round(restS)} s</p>});
                    // progressBar.insertHTML=`<p>${min} m ${Math.round(restS)} s</p>`;
                }
                
                width += tickerWidth;
                progressBar.style.width = width + '%';


                /* if (ticker % (duration/10000) < 3) {
                    width += 0.1;
                    progressBar.style.width = width + '%';
                } */

                ticker++;
                
                /* console.log(duration)
                console.log(updateTime)
                width += updateTime;
                progressBar.style.width = width + '%'; */
            }, 100)
        //    .then(this.setState({ currentLoop : setInterval(this.popp(duration, startTime), 10)}))
        }


        middleware = () => {
            this.playPlaylist();
        }
        
        

        render() {

        let restS = this.state.remainingTime % 60;
        let wholeMinS = this.state.remainingTime - restS;
        let min = wholeMinS / 60;

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
                                    <p className="nowPlayingText">Now playing: {this.state.queuedTracks[0].name} by {this.state.queuedTracks[0].artists[0].name}</p>
                                }
                                </div>
                                <div className="myProgress">
                                    { this.state.playing && 
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
                </footer>
            </div>
          );
        }
      }

export default MainPage;