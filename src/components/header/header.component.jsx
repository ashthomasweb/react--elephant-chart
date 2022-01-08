import React, { Component } from 'react'

import SignInUpModal from '../signinupmodal/signinupmodal.component'

import logo from '../../assets/idea-logo.png'

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
        <img src={logo} className='logo' alt='flow-post logo' />

        <div className='user-options'>
          {this.props.currentUser ? (
            <div>
              <div className='welcome'>
                Welcome,
                <br />
                {this.props.currentUser.displayName}
              </div>
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
          ) : (
            <div>
              <div className='welcome'>Welcome!</div>
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
