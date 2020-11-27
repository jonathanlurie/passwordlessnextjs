import React from 'react'
import SDK from '../../core/frontend/SDK'
import LoginRegisterButton from './LoginRegisterButton'
import LoggedInMenu from './LoggedInMenu'
import AccessToken from '../../core/frontend/AccessToken'


export default class LoginLogoutButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tokenData: AccessToken.getData(),
    }
  }


  render() {
    if (this.state.tokenData) {
      return <LoggedInMenu/>
    }
    
    return <LoginRegisterButton/>
  }
}