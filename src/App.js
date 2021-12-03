import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import './App.css';

import HomePage from './pages/homepage/homepage.component'

class App extends Component {

  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <div>
          <Switch>
            <Route exact path='/' component={HomePage} />
          </Switch>
      </div>
    );
  }
}

export default App;
