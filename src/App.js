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
    window.addEventListener('click', (e) => {
      // console.log(e.target.scrollTop, e.target.scrollLeft)
      if (e.target.id === 'backing') {
        // (pad edge + 20px).clientXY + board.scrollTop/Left
        let padEdge = document.querySelector('.pad-frame').getBoundingClientRect().left

        let boardHangX = document.querySelector('.board-backing').scrollLeft
        // let boardHangY = document.querySelector('.board-backing').scrollTop
        let padZoom = document.querySelector('.pad-frame').style.zoom

        let padWidth = getComputedStyle(document.querySelector('#input-text')).getPropertyValue('width')

        padZoom = padZoom.replace(/calc\(/g, '')
        padZoom = padZoom.replace(/\)/g, '')
        padZoom = padZoom.replace(/%/g, '')
        padZoom = parseFloat(padZoom) / 100

        console.log(padWidth)
        // console.log(a)
        console.log( ((padEdge * 1.1) + parseFloat(padWidth)) * padZoom )
        console.log(boardHangX)
      }
    }
    )
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
