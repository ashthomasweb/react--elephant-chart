import React, { Component } from 'react'

import SignInUpModal from '../signinupmodal/signinupmodal.component'

import logo from '../../assets/elephant-logo.png'

import { auth, clearBoards } from '../../firebase/firebase.utils'

import './header.styles.scss'

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  closeSignIn = () => {
    document.querySelector('.sign-modal').style.display = 'none'
  }

  modalToggle = () => {
    let el = document.querySelector('.sign-modal').style
    el.display === 'block' ? (el.display = 'none') : (el.display = 'block')
  }

  render() {
    return (
      <div className='header'>
        <div className='user-options'>
          {this.props.currentUser ? (
            <div>
              <div className='welcome'>
                {this.props.currentUser.displayName}
                {/* <h2 style={{margin: '-10px 0 -10px 0' }}>TadaMat</h2> */}
              </div>
              <div className='logo-container' >
                <img src={logo} className='logo' alt='elephant-logo'/>
              <button
                className='option'
                onLoad={this.closeSignIn()}
                onClick={() => {
                  clearBoards()
                  this.props.reset()
                  auth.signOut()
                }}>
                SIGN OUT
              </button>
              </div>
            </div>
          ) : (
            <div>
              <img src={logo} className='logo' alt='elephant-logo'/>
              <button
                type='button'
                className='sign-in-modal-btn'
                onClick={() => this.modalToggle()}>
                SIGN IN / UP
              </button>
            </div>
          )}
        </div>
        <div className='sign-modal'>
          <SignInUpModal />
        </div>
      </div>
    )
  }
}

export default Header
