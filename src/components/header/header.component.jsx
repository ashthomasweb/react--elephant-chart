import React from 'react'

import SignInUpModal from '../signinupmodal/signinupmodal.component'

import logo from '../../assets/flow-post-logo.png'

import { auth, clearBoards } from '../../firebase/firebase.utils'

import './header.styles.scss'

const closeSignIn = () => {
  document.querySelector('.sign-modal').style.display = 'none'
}

const modalToggle = () => {
  let el = document.querySelector('.sign-modal').style
  el.display === 'block'
  ? (el.display = 'none')
  : (el.display = 'block')
}

const Header = ({ currentUser, reset }) => (
  <div className='header'>
      <img src={logo} className='logo' alt='flow-post logo' />
    
    <div className='user-options'>
      {currentUser ? ( <div>
        <div className='welcome' >Welcome,<br/>{currentUser.displayName}</div>
        <button className='option' onLoad={closeSignIn()} onClick={() => { clearBoards(); reset(); auth.signOut()}}>SIGN OUT</button></div>
      ) : (
        <button
          type='button'
          className='sign-in-modal-btn'
          onClick={() => modalToggle()}>
          SIGN IN / UP
        </button>
      )}
    </div>
    <div
      className='sign-modal'>
      <SignInUpModal />
    </div>
  </div>
)

export default Header
