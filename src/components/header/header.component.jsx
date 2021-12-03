import React from 'react'
import { Link } from 'react-router-dom'
// import { auth } from '../../firebase/firebase.utils'
// import { connect } from 'react-redux'

import logo from '../../assets/flow-post-logo.png'
import SignInUpModal from '../signinupmodal/signinupmodal.component'
import CustomButton from '../custom-button/custom-button.component'

import './header.styles.scss'

const Header = ({ currentUser }) => (
  <div className='header'>
    <Link className='logo-container' to='/'>
      <img src={logo} className='logo' alt='flow-post logo' />
    </Link>

    <div className='options'>
      <CustomButton
        className='log-user'
        onClick={() => console.log(currentUser)}>
        LOG: Current User
      </CustomButton>

      {currentUser ? (
        // <div className='option' onClick={() => auth.signOut()}>
        <div className='option'>SIGN OUT</div>
      ) : (
        <button
          type='button'
          className='sign-in-modal-btn'
          onClick={() => {
            document.querySelector('#sign-modal').style.display === 'block'
              ? (document.querySelector('#sign-modal').style.display = 'none')
              : (document.querySelector('#sign-modal').style.display = 'block')
          }}>
          SIGN IN / UP
        </button>
      )}
    </div>
    <div
      id='sign-modal'
      className='sign-modal'>
      <SignInUpModal />
    </div>
  </div>
)

// const mapStateToProps = state => ({
//   currentUser: state.user.currentUser
// })

export default Header
// export default connect(mapStateToProps)(Header)
