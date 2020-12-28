import React from 'react'
import Link from 'next/link'
import {
  Button,
  Menu,
  Dropdown
} from 'antd'
import {
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  PoweroffOutlined,
  ShareAltOutlined,
  FrownOutlined,
} from '@ant-design/icons'
import SDK from '../../core/frontend/SDK'
import AccessToken from '../../core/frontend/AccessToken'
import Styles from './LoggedInMenuStyles.module.css'


export default class LoggedInMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tokenData: AccessToken.getData()
    }
  }


  render() {
    if (!this.state.tokenData) {
      return (
        <div
        className={Styles['menu-title']}
        >
          <FrownOutlined/> Not connected
        </div>
      )
    }

    const menu = (
      <Menu>
        
        <Menu.Item
          key='1'
        >
          <Link href='/profile'><a>
          <SettingOutlined/> Edit profile
          </a></Link>
          
        </Menu.Item>

        <Menu.Item
          key="2"
        >
          <Link href={`/@${this.state.tokenData.username}`}><a>
            <ShareAltOutlined/> Public profile
          </a></Link>
        </Menu.Item>

        <Menu.Item
          key="3"
          danger
          onClick={async e => await SDK.logout()}
        >
          <PoweroffOutlined/> Logout
        </Menu.Item>
      </Menu>
    )

    return (
      <div>
        <Dropdown overlay={menu}>
          <a className={Styles['menu-title']} onClick={e => e.preventDefault()}>
            <UserOutlined/> {this.state.tokenData.username} <DownOutlined />
          </a>
        </Dropdown>
      </div>
    )
  }
}
