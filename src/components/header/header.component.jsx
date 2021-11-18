import React from 'react'
import { Link } from 'react-router-dom'
// import { auth } from '../../firebase/firebase.utils'
// import { connect } from 'react-redux'

import logo from '../../assets/flow-post-logo.png'

import CustomButton from '../custom-button/custom-button.component'

import './header.styles.scss'

const Header = ({ currentUser }) => (
  <div className='header'>
    <Link className='logo-container' to='/'>
      <img src={logo} className='logo' alt='flow-post logo' />
    </Link>
    <CustomButton onClick={() => console.log(currentUser)}>
      Log State
    </CustomButton>

    <div className='options'>
   
     
      {currentUser ? (
        // <div className='option' onClick={() => auth.signOut()}>
        <div className='option' >

          SIGN OUT
        </div>
      ) : (
        <Link className='option' to='/signin'>
          SIGN IN
        </Link>
      )}
    </div>
  </div>
)

// const mapStateToProps = state => ({
//   currentUser: state.user.currentUser
// })

export default Header
// export default connect(mapStateToProps)(Header)
