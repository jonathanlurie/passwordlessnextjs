import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Styles from './LoginRegisterButton.module.css'


export default class LoginButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  goToLogin = () => {
    Router.push('/login')
  }


  goToRegister = () => {
    Router.push('/register')
  }


  render() {
    return (
      <div
        className={Styles['login-register-button']}
      >
        <Link href='/login'><a>login</a></Link>
        <span className={Styles['separator']}>/</span>
        <Link href='/register'><a>register</a></Link>
      </div>
    )
  }
}