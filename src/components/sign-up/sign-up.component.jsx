import React, { Component } from 'react'

import FormInput from '../form-input/form-input.component'
import CustomButton from '../custom-button/custom-button.component'

// import { auth, createUserProfileDocument } from '../../firebase/firebase.utils'

import './sign-up.styles.scss'

class SignUp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  }

  // handleSubmit = async (event) => {
  //   event.preventDefault()

  //   const { displayName, email, password, confirmPassword } = this.state

  //   if (password !== confirmPassword) {
  //     alert("passwords don't match")
  //     return
  //   }

  //   try {

  //     const { user } = await auth.createUserWithEmailAndPassword(email, password) 

  //     await createUserProfileDocument(user, { displayName })

  //     this.setState({
  //       displayName: '',
  //       email: '',
  //       password: '',
  //       confirmPassword: ''
  //     })

  //   } catch (error) {
  //     console.error(error)

  //   }

  // }

  handleChange = (event) => {
    const { value, name } = event.target
    this.setState({ [name]: value })
  }

  render() {
    const { displayName, email, password, confirmPassword } = this.state
    return (
      <div className='sign-up'>
        <h2 className='title'>Create an Account</h2>
        <span>Sign up with Google or by email</span>

        <form className='sign-up-form' /*</div>onSubmit={this.handleSubmit}*/>
          <FormInput
            type='text'
            name='displayName'
            value={displayName}
            label='Display Name'
            onChange={this.handleChange}
            required
          />
          <FormInput
            type='text'
            name='email'
            value={email}
            label='Email'
            onChange={this.handleChange}
            required
          />
          <FormInput
            type='password'
            name='password'
            value={password}
            label='Password'
            onChange={this.handleChange}
            required
          />
          <FormInput
            type='password'
            name='confirmPassword'
            value={confirmPassword}
            label='Confirm Password'
            onChange={this.handleChange}
            required
          />

          <div className='buttons'>
            <CustomButton type='submit'> Sign Up </CustomButton>
          </div>
        </form>
      </div>
    )
  }
}

export default SignUp
