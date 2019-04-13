import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import queryString from 'query-string';
import MainPage from './components/MainPage';
import Login from './components/Login';
import SpotifyLogin from './components/SpotifyLogin';
import './App.css'
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    this.setState({accessToken: accessToken});
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Login} />
            <Route path="/firstTimeUser" component={SpotifyLogin} />
            <Route path="/mainPage" component={MainPage} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
