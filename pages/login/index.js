import React from 'react'
import { Input, Button} from 'antd'
import Tools from '../../core/fullstack/Tools'
import SDK from '../../core/frontend/SDK'

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validEmailOrUsername: false,
      messageEmailOrUsername: null,
      successMessage: null,
    }

    this._hasEmailOrUsernameUpdated = false
    this._emailOrUsernameTest = ''

    setInterval(async () => {
      if (this._hasEmailOrUsernameUpdated ) {
        this._hasEmailOrUsernameUpdated = false

        if (this._emailOrUsernameTest === '') {
          return this.setState({messageEmailOrUsername: null, validEmailOrUsername: false})
        }

        if (await SDK.hasEmailOrUsername(this._emailOrUsernameTest)) {
          return this.setState({messageEmailOrUsername: null, validEmailOrUsername: true})
        } else {
          return this.setState({messageEmailOrUsername: 'This email or username does not exist.', validEmailOrUsername: false})
        }
      }
    }, 500)

  }


  onSubmit = async () => {    
    const res = await fetch('/api/sendloginlink', 
      {
        method: 'POST',
        body: JSON.stringify({emailorusername: this._emailOrUsernameTest }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
    const resObj = await res.json()

    console.log(resObj)

    if (resObj.error) {
      this.setState({successMessage: resObj.error})
    } else {
      this.setState({successMessage: 'Check you inbox! We just sent you a link to connect :)'})
    }
  }


  onEmailOrUsernameChange = (evt) => {
    this._emailOrUsernameTest = evt.target.value
    this._hasEmailOrUsernameUpdated = true

    this.setState({
      validEmailOrUsername: false
    })
  }


  render() {
    return (
      <div>
        <Input placeholder='Email or username' onChange={this.onEmailOrUsernameChange}/>
        <p>
          {this.state.messageEmailOrUsername}
        </p>

        <Button disabled={!this.state.validEmailOrUsername} type="primary" onClick={this.onSubmit}>
          Login
        </Button>

        {this.state.successMessage ? <p>{this.state.successMessage}</p> : null}
        
      </div>
    )
  }
}