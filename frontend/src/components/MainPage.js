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
        }
      
        addToQueue = (track) => {
            let songs = [...this.state.queuedTracks];
            track.votes = 0;
            songs.push(track);
            console.log(track);
            this.setState({ queuedTracks: songs })
        }
      
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