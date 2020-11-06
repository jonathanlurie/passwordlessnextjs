import React from 'react'
import { withRouter } from 'next/router'
import ErrorCode from '../../core/fullstack/ErrorCodes'


class FailedSignupPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    // in case we need a message or error code, it could be in the URL
    const query = this.props.router.query

    let message = ''

    switch (parseInt(query.error)) {
      case ErrorCode.SINUP_MISSING_TOKEN:
        message = 'Missing signup token'
        break
      case ErrorCode.SIGNUP_INVALID_TOKEN:
        message = 'Ivalid or expired signup token'
        break
      case NaN:
        message = 'Error code not specified'
      default:
        message = 'Unknown error'
    }

    return (
      <div>
        <h1>The signup failed :(</h1>
        <p>
          {message}
        </p>
      </div>
    )
  }
}

export default withRouter(FailedSignupPage)