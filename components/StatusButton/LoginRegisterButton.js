import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import RegisterModal from '../RegisterModal'
import LoginModal from '../LoginModal'
import Styles from './LoginRegisterButtonStyles.module.css'


export default class LoginRegisterButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      registerModalVisible: false,
      loginModalVisible: false,
    }
  }


  showRegisterModal = () => {
    this.setState({registerModalVisible: true})
  }

  hideRegisterModal = () => {
    this.setState({registerModalVisible: false})
  }

  showLoginModal = () => {
    this.setState({loginModalVisible: true})
  }

  hideLoginModal = () => {
    this.setState({loginModalVisible: false})
  }


  


  render() {
    return (
      <div
        className={Styles['login-register-button']}
      >
        <span onClick={this.showLoginModal}>login</span>
        <span className={Styles['separator']}>/</span>
        <span onClick={this.showRegisterModal}>register</span>

        {
          this.state.registerModalVisible
          ? <RegisterModal onCancel={this.hideRegisterModal}/>
          : null
        }

        {
          this.state.loginModalVisible
          ? <LoginModal onCancel={this.hideLoginModal}/>
          : null
        }
        


      </div>
    )
  }
}