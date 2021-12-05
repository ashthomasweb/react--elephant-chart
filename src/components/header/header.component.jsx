import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase/firebase.utils'
// import { connect } from 'react-redux'

import logo from '../../assets/flow-post-logo.png'
import SignInUpModal from '../signinupmodal/signinupmodal.component'

import './header.styles.scss'

function close() {
  document.querySelector('#sign-modal').style.display = 'none'
}

const Header = ({ currentUser }) => (
  <div className='header'>
    <Link className='logo-container' to='/'>
      <img src={logo} className='logo' alt='flow-post logo' />
    </Link>

    <div className='options'>
      {currentUser ? ( <div>
        <div className='welcome' >Welcome,<br/>{currentUser.displayName}</div>
        <div className='option' onLoad={close()} onClick={() => auth.signOut()}>SIGN OUT</div></div>
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
