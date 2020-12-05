import React from 'react'
import { withRouter } from 'next/router'
import DB from '../../core/backend/DB'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import { Input, Button, message, Space, Avatar } from 'antd'
import { FrownOutlined, UserOutlined, GlobalOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons'
import SDK from '../../core/frontend/SDK'
import TokenizedPage from '../../components/TokenizedPage'
import AppLayout from '../../components/AppLayout'
import Styles from './styles.module.css'
const { TextArea } = Input


class UserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    const router = this.props.router
    const { username } = router.query
    const data = this.props.data
    const error = this.props.error
    const pictureSize = 200
    console.log(this.props)

    let content = null

    if (error) {
      content =  (
        <Space direction='vertical' className={Styles['spacer']}>
        <div className={Styles['error-div']}>
          <p>
            {error.message}
          </p>
          <p>
            <FrownOutlined/>
          </p>
        </div>
        </Space>
      )
    } else {
      content = (
        <Space direction='vertical' className={Styles['spacer']}>
          {
            data.picture ?
            <img className={Styles['profile-picture']} src={data.picture} height={pictureSize}/> :
            <Avatar size={pictureSize} icon={<UserOutlined />} />
          }

        <h1>{data.displayName ? data.displayName : data.username}</h1>
        <h2>{`@${data.username}`}</h2>

        
        </Space>
      )
    }


    return (
      <TokenizedPage redirectOnFailedLogin onReady={this.onTokenizedPageReady}>
        <AppLayout>
          
            {content}

        </AppLayout>
      </TokenizedPage>
    )
  }
}


export async function getServerSideProps(context) {
  const urlQuery = context.query
  let username = urlQuery.username
  console.log('username', username)

  // if the username does not start with @, then redurect to same page
  // but with @ prepended
  if (!username.startsWith('@')) {
    context.res.setHeader("location", `/@${username}`)
    context.res.statusCode = 302
    context.res.end()
    return
  }

  // the username is missing and there is only @ in the URL,
  // redirecting to /
  if (username === '@') {
    context.res.setHeader("location", '/')
    context.res.statusCode = 302
    context.res.end()
    return
  }


  // remove the @ from username
  username = username.slice(1)

  // check if the username exists in the DB
  const user = DB.getUserFromUsername(username)

  // return props with error code if the user does not exist
  if (!user) {
    return {
      props: {
        error: ErrorCodes.USERNAME_NOT_EXISTING,
        data: null,
      },
    }
  }

  const userExtra = DB.getUserExtraDataById(user.userId)

  return {
    props: {
      error: null,
      data: {
        ...userExtra,
        username: user.username,
      },
    },
  }
}



export default withRouter(UserPage)