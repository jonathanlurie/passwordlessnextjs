import React from 'react'
import Router from 'next/router'
import SDK from '../../core/frontend/SDK'


export default class TokenizedPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false
    }
  }


  componentDidMount() {
    this.init()
  }


  init = async () => {
    // trying to fetch the access token. If success, it is put somewhere safe
    // by the SDK (no need to get it from here)
    const tokenInfo = await SDK.refreshToken()

    if (!tokenInfo && this.props.redirectOnFailedLogin) {
      Router.push( this.props.redirectOnFailedLogin === true ? '/' : this.props.redirectOnFailedLogin)
    } else {
      this.setState({ready: true})
      if (typeof this.props.onReady === 'function'){
        this.props.onReady()
      }
    }
  }


  render() {
    const ready = this.state.ready
    return (
      <div>
        {ready ? this.props.children : null}
      </div>
    )
  }
}