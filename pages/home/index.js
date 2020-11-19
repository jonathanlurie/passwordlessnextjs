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
      userExtra: null,
    }

    this._text = null
  }


  /**
   * This method is called only when the TokenizedPage is ready and since
   * we are using `redirectOnFailedLogin`, this is executed only if a valid
   * access token could be fetched.
   */
  onTokenizedPageReady = async () => {
    // fetching user extra data
    const userExtraInfo = await SDK.getUserExtra()
    this._text = userExtraInfo.data || ''
    this.setState({
      userExtra: userExtraInfo.data,
    })
  }


  onTextChange = (e) => {
    this._text = e.target.value
  }


  saveText = async () => {
    // TODO: use the SDK to save the text stored in this._text
    // in the DB, userExtra is now a text
  }

  


  render() {

    return (
      <TokenizedPage redirectOnFailedLogin onReady={this.onTokenizedPageReady}>
        <div>
          <LogoutButton/>
          <pre>
            {JSON.stringify(this.state.userExtra, null, 2)}
          </pre>
          <TextArea rows={10} defaultValue={this._text} onChange={this.onTextChange}/>
          <Button onClick={this.saveText}>Save</Button>
        </div>
      </TokenizedPage>
    )
  }
}