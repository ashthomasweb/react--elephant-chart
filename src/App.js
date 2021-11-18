import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import './App.css';

import HomePage from './pages/homepage/home.component'
import Header from './components/header/header.component'


class App extends Component {

  constructor() {
    super()

    this.state = {
      name: "Ash",
      age: "37"
    }

  }

  render() {
    return (
      <div>
        <Header className='header' />
          <Switch>
            <Route exact path='/' component={HomePage} />
          </Switch>
        
          
      </div>
    );


  }

}


export default App;
