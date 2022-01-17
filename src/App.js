import React, { Component } from 'react'
import { auth, createNewUserProfile, getUserRef, getUserBoards } from './firebase/firebase.utils'

import './App.css'

import HomePage from './pages/homepage/homepage.component'

class App extends Component {
  constructor() {
    super()
    
    this.state = {
      currentUser: null,
    }

  }

  unsubsribeFromAuth = null

  componentDidMount() {
    this.unsubsribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        createNewUserProfile(userAuth)

        const userRef = await getUserRef(userAuth)

        userRef.onSnapshot((snapShot) => {
          this.setState(
            {
              currentUser: {
                auth: userAuth,
                id: snapShot.id,
                ...snapShot.data(),
              },
            }
          )
        })
      } else if (userAuth == null) {
        this.setState({ currentUser: userAuth })
      }
      getUserBoards(userAuth)
    })

    function setZoom() {
      let zoom = window.devicePixelRatio * 1.1
      let ui = ['.options-frame', '.header', '.pad-frame', '.update-frame', '.trash-frame']
      ui.forEach((item) => {
        document.querySelector(item).style.zoom = `calc(100% / ${zoom})`
      })
    }
    // partially handles bad clientX value on fast note clicking
    window.addEventListener('dragover', (e) => e.preventDefault(), false)
    window.addEventListener('dragend', (e) => e.preventDefault(), false)
    window.addEventListener('load', () => setZoom() )
    
  }

  componentWillUnmount() {
    this.unsubsribeFromAuth()
  }

  render() {
    return (
      <div>
        <HomePage currentUser={this.state.currentUser} />
      </div>
    )
  }
}

export default App
