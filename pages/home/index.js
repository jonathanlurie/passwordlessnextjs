import React from 'react'
import SDK from '../../core/frontend/SDK'
import { getMessageFromCode } from '../../core/fullstack/ErrorCodes'
import LogoutButton from '../../components/LogoutButton'


export default class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      message: 'Fetching data...',
      privateData: null,
    }
  }


  componentDidMount() {
    this.init()
  }


  init = async () => {
    // trying to fetch the access token. If success, it is put somewhere safe
    // by the SDK (no need to get it from here)
    const tokenInfo = await SDK.refreshToken()
    if (tokenInfo.error) {
      return this.setState({
        message: getMessageFromCode(tokenInfo.error)
      })
    }

    const userData = await SDK.getUserExtra()
    this.setState({
      ready: true,
      privateData: userData,
    })
  }


  render() {

    if (!this.state.ready) {
      return (
        <div>
        {this.state.message}
        </div>
      )
    }

    return (
      <div>
        <LogoutButton/>
        <pre>
          {JSON.stringify(this.state.privateData, null, 2)}
        </pre>
      </div>
    )
  }
}