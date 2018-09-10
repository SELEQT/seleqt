import React, { Component } from 'react';
import querySearch from 'stringquery';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import QueueWindow from './QueueWindow';


class MainPage extends Component {

        state = {
          serverData: {},
          accessToken: "",
          searchResult: {},
          searchTrack: "",
          gotData: false,
          goToQueue: false
        }
      
        componentDidMount() {
          let accessToken = querySearch(this.props.location.access_token);
          this.setState({accessToken: accessToken});

        }
        
      
        onHandleSearchInput = (event) => {
          this.setState({ [event.target.name]: event.target.value })
          if (event.target.value) {
            fetch(`https://api.spotify.com/v1/search?query=${event.target.value}&type=track&market=SE&offset=0&limit=15`, {
            headers: {'Authorization': 'Bearer ' + this.state.accessToken}
          }).then(response => response.json())
          .then(data => this.setState({searchResult: data, gotData: true}))
          .catch(error => {
            console.log("No Results");
          })
          }
        }

        addToQueue = (track) => {
          console.log(track);
          this.props.addToQueue(track);
        }
      
        render() {
         let listOfResult;
          if (this.state.gotData) {
          const annonser = this.state.searchResult.tracks.items;
          listOfResult = annonser.map(annons => (
            <div key={annons.id}>
            <p><strong>{annons.name}</strong></p>
              <p><em>{annons.artists[0].name}</em></p>
       
              <img src={annons.album.images[2].url} />
              <br/>
              <button onClick={ () =>  this.addToQueue(annons)}> Add to queue </button>
              <hr></hr>
            </div>
          ))
        } 
          return (
            <div className="window">
                <div className="search"> 
                  <input
                    type="text"
                    name="searchTrack"
                    value={this.state.searchTrack}
                    onChange={this.onHandleSearchInput}
                  />
                  {/* <button onClick={this.onHandleSearch}> Search </button> */}
                  <h2>Search Result</h2>
                  { listOfResult }
                </div>
            </div>
          );
        }
      }

export default MainPage;