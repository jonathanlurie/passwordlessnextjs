import React from 'react'
import { Input, Button} from 'antd'
import Tools from '../../core/fullstack/Tools'

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validUsername: false,
      validEmail: false,
    }
  }


  onUsernameChange = (evt) => {
    const username = evt.target.value
    const isAlphaNumericLowerCase = Tools.isAlphaNumericLowerCase(username)

    if (!isAlphaNumericLowerCase) {
      return this.setState({validUsername: false})
    }
  }

  onEmailChange = (evt) => {
    const email = evt.target.value
  }


  render() {
    return (
      <div>
        <Input placeholder='Username' onChange={this.onUsernameChange}/>
        <Input placeholder='E-mail'/>
      
        <Button type="primary" htmlType="submit" onChange={this.onEmailChange}>
          Submit
        </Button>
      </div>
    )
  }
}