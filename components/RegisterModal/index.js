import React from 'react'
import Link from 'next/link'
import { Input, Button, Modal, Tooltip, Space } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import Tools from '../../core/fullstack/Tools'
import SDK from '../../core/frontend/SDK'
import Styles from './styles.module.css'

export default class RegisterModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      validEmail: false,
      validUsername: false,
      messageEmail: null,
      messageUsername: null,
      successMessage: null,
    }

    this._hasEmailUpdated = false
    this._emailTest = ''
    this._hasUsernameUpdated = true
    this._usernameTest = ''


    // just to debounce validation
    setInterval(async () => {
      let validEmail = this.state.validEmail

      if (this._hasEmailUpdated ) {
      
        if (this._emailTest === '') {
          validEmail = false
          return this.setState({messageEmail: null, validEmail})
        }
        
        if (!Tools.isEmail(this._emailTest)) {
          validEmail = false
          return this.setState({messageEmail: 'The email format is invalid', validEmail})
        } 

        if (await SDK.hasEmail(this._emailTest)) {
          validEmail = false
          return this.setState({messageEmail: 'This email is already taken', validEmail})
        }

        this._hasEmailUpdated = false
        this.setState({messageEmail: null, validEmail: true})
      }
    }, 500)



    setInterval(async () => {
      let validUsername = this.state.validUsername

      if (this._hasUsernameUpdated ) {

        if (this._usernameTest === '') {
          validUsername = false
          return this.setState({messageUsername: null, validUsername})
        }

        if (this._usernameTest.length > 25) {
          validUsername = false
          return this.setState({messageUsername: 'The username must be 25 charaters or less', validUsername})
        }

        if (!Tools.isUsername(this._usernameTest)) {
          validUsername = false
          return this.setState({messageUsername: 'The username must be lowercase and only letters and digits', validUsername})
        } 

        if (await SDK.hasUsername(this._usernameTest)) {
          validUsername = false
          return this.setState({messageUsername: 'This username is already taken', validUsername})
        }
        this._hasUsernameUpdated = false
      }
      
      this.setState({messageUsername: null, validUsername: true})
    }, 500)

  }


  onSubmit = async () => {
    if (!this.state.validEmail || !this.state.validUsername) {
      return
    }
    
    const res = await fetch('/api/sendsignuplink', 
      {
        method: 'POST',
        body: JSON.stringify({email: this._emailTest, username: this._usernameTest}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
    const resObj = await res.json()

    if (resObj.error) {
      this.setState({successMessage: resObj.error})
    } else {
      this.setState({successMessage: 'Check you inbox! We just sent you a link to connect.'})
    }
  }


  onEmailChange = (evt) => {
    this._emailTest = evt.target.value
    this._hasEmailUpdated = true

    this.setState({
      validEmail: false
    })
  }


  onUsernameChange = (evt) => {
    this._usernameTest = evt.target.value
    this._hasUsernameUpdated = true

    this.setState({
      validUsername: false
    })
  }


  render() {
    return (
      <Modal
        title={
          <div
            className={Styles['header']}
          >
            <Link href='/'><a>
              <span className={Styles['title-passwordless']}>Passwordless</span>
              <span className={Styles['title-nextjs']}>Nextjs</span>
            </a></Link>
          </div>
        }
        visible={true}
        closable={false}
        // centered
        maskClosable={false}
        onCancel={this.props.onCancel}
        keyboard={false}
        mask={true}
        maskStyle={{
          background: '#40a9fe'
        }}
        footer={
          <div className={Styles['cancel-button']} onClick={this.props.onCancel}>{this.state.successMessage ? 'ok' : 'cancel'}</div>
        }
      >
        
        {
          this.state.successMessage
          ?
          <div className={Styles['success-message']}>
            <p>
              {this.state.successMessage}
            </p>
            <CheckCircleOutlined className={Styles['success-icon']}/>
          </div>
          :
          <Space direction='vertical' className={Styles['main']}>
          
            <Tooltip color='volcano' placement='bottom' visible={!!this.state.messageUsername} title={this.state.messageUsername}>
              <Input placeholder='Username' onChange={this.onUsernameChange}/>
            </Tooltip>
            
            <Tooltip color='volcano' placement='bottom' visible={!!this.state.messageEmail} title={this.state.messageEmail}>
              <Input placeholder='E-mail' onChange={this.onEmailChange} onPressEnter={this.onSubmit}/>
            </Tooltip>

            <Button disabled={!this.state.validEmail || !this.state.validUsername} type="primary" onClick={this.onSubmit} block>
              Register
            </Button>
          
          </Space>
        }

      </Modal>
    )
  }
}