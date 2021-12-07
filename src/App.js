import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { auth, createNewUserProfile } from './firebase/firebase.utils'

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
    this.unsubsribeFromAuth = auth.onAuthStateChanged( async (user) => {
      this.setState({ currentUser: user })
      createNewUserProfile(user)
    })

    // partially handles bad clientX value on fast note clicking
    window.addEventListener('dragover', (e) => e.preventDefault(), false)
    window.addEventListener('dragend', (e) => e.preventDefault(), false)
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
              className='custom-button log'
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
