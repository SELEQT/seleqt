import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import queryString from 'query-string';
import MainPage from './components/MainPage';
import Login from './components/Login';
import MainPage from './components/MainPage';
import SpotifyLogin from './components/SpotifyLogin';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
           <Route exact path="/" component={Login} />
           <Route path="/firstTimeUser" component={SpotifyLogin} />
           <Route path="/mainPage" component={MainPage} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
