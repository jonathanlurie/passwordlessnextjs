import React from 'react'
import Link from 'next/link'
import { Input, Button, Modal, Tooltip, Space } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import SDK from '../../core/frontend/SDK'
import Styles from './styles.module.css'

export default class LoginModal extends React.Component {
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
    if(!this.state.validEmailOrUsername) {
      return
    }

    const res = await fetch('/api/sendloginlink', 
      {
        method: 'POST',
        body: JSON.stringify({emailorusername: this._emailOrUsernameTest }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
    const resObj = await res.json()


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
            <Tooltip color='volcano' placement='bottom' visible={!!this.state.messageEmailOrUsername} title={this.state.messageEmailOrUsername}>
              <Input placeholder='Email or username' onChange={this.onEmailOrUsernameChange}  onPressEnter={this.onSubmit}/>
            </Tooltip>

            <Button disabled={!this.state.validEmailOrUsername} type="primary" onClick={this.onSubmit} block>
              Login
            </Button>
          </Space>
        }
      </Modal>
    )
  }
}