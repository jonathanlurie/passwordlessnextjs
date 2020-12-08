import React from 'react'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

export default class ProfilePicture extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    if (this.props.img) {
      return (
        <div
        style={{
          width: this.props.size || 200,
          height: this.props.size || 200,
          background: `url(${this.props.img}) center center / cover no-repeat`,
          borderRadius: '50%',
          ...this.props.style
        }}
      />
      )
    }

    return (
      <Avatar style={this.props.style} size={this.props.size || 200} icon={<UserOutlined />} />
    )
  }
}