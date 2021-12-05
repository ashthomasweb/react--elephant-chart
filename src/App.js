import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { auth } from './firebase/firebase.utils'

import './App.css'

import HomePage from './pages/homepage/homepage.component'
import CustomButton from './components/custom-button/custom-button.component'

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUser: null,
    }
  }

  unsubsribeFromAuth = null

  componentDidMount() {
    this.unsubsribeFromAuth = auth.onAuthStateChanged((user) => {
      this.setState({ currentUser: user })
    })
  }

  componentWillUnmount() {
    this.unsubsribeFromAuth()
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/'>
            <HomePage currentUser={this.state.currentUser} />
            <CustomButton
              className='custom-button'
              onClick={() => console.log(this.state.currentUser)}>
              LOG Current User
            </CustomButton>
          </Route>
        </Switch>
      </div>
    )
  }
}

export default App
