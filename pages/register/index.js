import React from 'react'
import { Input, Button} from 'antd'
import Tools from '../../core/fullstack/Tools'
import SDK from '../../core/frontend/SDK'

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validEmail: false,
      message: null,
    }

    this._hasEmailUpdated = false
    this._emailTest = ''

    // just to debounce validation
    setInterval(async () => {
      if (!this._hasEmailUpdated) {
        return
      }
      this._hasEmailUpdated = false

      if (this._emailTest === '') {
        return this.setState({message: null, validEmail: false})
      }

      if (!Tools.isEmail(this._emailTest)) {
        return this.setState({message: 'The email format is invalid.', validEmail: false})
      } 

      if (await SDK.hasEmail(this._emailTest)) {
        return this.setState({message: 'This email is already taken', validEmail: false})
      }

      this.setState({message: null, validEmail: true})

      
    }, 500)

  }


  onEmailChange = (evt) => {
    this._emailTest = evt.target.value
    this._hasEmailUpdated = true

    this.setState({
      validEmail: false
    })
  }


  render() {
    return (
      <div>
        <Input placeholder='E-mail' onChange={this.onEmailChange}/>
      
        <Button disabled={!this.state.validEmail} type="primary" htmlType="submit" onChange={this.onEmailChange}>
          Submit
        </Button>
        <p>
          {this.state.message}
        </p>
      </div>
    )
  }
}