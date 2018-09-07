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
          currentLoop: ""
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
            this.setState({accessToken: accessToken});
            let duration = this.state.queuedTracks[0].duration_ms;
            let startTime;
            this.setState({ popped : false });
            
            console.log(duration);
            fetch('https://api.spotify.com/v1/me/player/play?device_id=add2238910e276e27e693896d661b1257859c046', {
                method: 'PUT',
                body: JSON.stringify({
                    "uris": [`${this.state.queuedTracks[0].uri}`],
                    "position_ms": 0
                }),
                headers: { 'Authorization': 'Bearer ' + accessToken } 
            })
            .then( startTime = Date.now() )
            const s = setInterval(() =>{
                console.log("log");
                if (Date.now() - startTime >= duration && !this.state.popped){
                    let songs = [...this.state.queuedTracks];
                    songs.shift();
                    this.setState({ queuedTracks: songs })
                    this.setState({ popped : true });    
                };
                if (this.state.popped) {
                    console.log("stop");
                    this.middleware();
                    clearInterval(s)
                    
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
                        now playing
                    </div>
                </footer>
            </div>
          );
        }
      }

export default MainPage;