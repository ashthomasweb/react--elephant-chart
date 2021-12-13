import React, { Component } from 'react'
import {
  auth,
  createNewUserProfile,
  getUserRef,
  getUserBoards,
} from './firebase/firebase.utils'

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
        <HomePage currentUser={this.state.currentUser} />

        {/* development asset */}
        <CustomButton
          className='custom-button log'
          onClick={() => console.log(this.state.currentUser)}>
          LOG Current User
        </CustomButton>
        {/* development asset */}

      </div>
    )
  }
}

export default App
