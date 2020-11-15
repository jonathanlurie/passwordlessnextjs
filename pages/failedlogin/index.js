import React from 'react'
import { withRouter } from 'next/router'
import { getMessageFromCode } from '../../core/fullstack/ErrorCodes'


class FailedLoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    // in case we need a message or error code, it could be in the URL
    const query = this.props.router.query
    let message = getMessageFromCode(query.error)

    return (
      <div>
        <h1>The login failed :(</h1>
        <p>
          {message}
        </p>
      </div>
    )
  }
}

export default withRouter(FailedLoginPage)