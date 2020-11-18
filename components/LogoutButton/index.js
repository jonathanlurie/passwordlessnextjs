import React from 'react'
import { Button } from 'antd'
import SDK from '../../core/frontend/SDK'

export default class LogoutButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  onClick = async () => {
    await SDK.logout()
  }


  render() {
    return <Button danger onClick={this.onClick}>Logout</Button>
  }
}
