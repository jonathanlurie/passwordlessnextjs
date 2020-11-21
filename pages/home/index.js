import React from 'react'
import { Input, Button } from 'antd'
import SDK from '../../core/frontend/SDK'
import LogoutButton from '../../components/LogoutButton'
import TokenizedPage from '../../components/TokenizedPage'
const { TextArea } = Input


export default class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }

    this._userExtra = null
  }


  /**
   * This method is called only when the TokenizedPage is ready and since
   * we are using `redirectOnFailedLogin`, this is executed only if a valid
   * access token could be fetched.
   */
  onTokenizedPageReady = async () => {
    // fetching user extra data

    let userExtraInfo = null
    
    try {
      userExtraInfo = await SDK.getUserExtra()
    } catch(e) {
      // TODO: deal with this error
      console.log('error 1')
      return
    }

    if (userExtraInfo.error) {
      // TODO: deal with the error
      console.log('error 2')
      return
    }

    this._userExtra = userExtraInfo.data

    if (!this._userExtra) {
      this._userExtra = {}
    }

    if (this._userExtra.text) {
      this.setState({
        text: this._userExtra.text
      })
    }
  }


  onTextChange = (e) => {
    this.setState({
      text: e.target.value
    })
  }


  saveText = async () => {
    this._userExtra.text = this.state.text
    const response = await SDK.postUserExtra(this._userExtra)
    console.log('response: ', response)
  }


  render() {
    return (
      <TokenizedPage redirectOnFailedLogin onReady={this.onTokenizedPageReady}>
        <div>
          <LogoutButton/>
          {/* <pre>
            {JSON.stringify(this._userExtra, null, 2)}
          </pre> */}
          <TextArea rows={10} value={this.state.text} onChange={this.onTextChange}/>
          <Button onClick={this.saveText}>Save</Button>
        </div>
      </TokenizedPage>
    )
  }
}