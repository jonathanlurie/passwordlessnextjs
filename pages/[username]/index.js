import React from 'react'
import { withRouter } from 'next/router'
import Marked from 'marked'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import DB from '../../core/backend/DB'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import { Button, Input, Space, Col, Row, Divider } from 'antd'
import { FrownOutlined, GlobalOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons'
import SDK from '../../core/frontend/SDK'
import TokenizedPage from '../../components/TokenizedPage'
import AppLayout from '../../components/AppLayout'
import ProfilePicture from '../../components/ProfilePicture'
import Styles from './styles.module.css'
const { TextArea } = Input


class UserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this._htmlDivRef = React.createRef()
  }


  render() {
    const router = this.props.router
    const { username } = router.query
    const data = this.props.data
    const error = this.props.error
    const pictureSize = 200
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
        <div className={Styles['content']}>
          <Row gutter={[8, 8]} justify='center'>
            <Col>
              <ProfilePicture img={data.picture} />
            </Col>
          </Row>

          <Row justify='center'>
            <Col className={Styles['display-name']}>
              {data.displayName ? data.displayName : data.username}
            </Col>
            
          </Row>
          <Row justify='center'>
            <Col className={Styles['username']}>
              {`@${data.username}`}
            </Col>
          </Row>
          <Divider>
            <Space>
              {
                data.instagramUsername
                ?
                <Button type='primary' size='small' shape="circle" icon={<InstagramOutlined />} href={`https://instagram.com/${data.instagramUsername}`}/>
                :
                null
              }

              {
                data.githubUsername
                ?
                <Button type='primary' size='small' shape="circle" icon={<GithubOutlined />} href={`https://github.com/${data.githubUsername}`}/>
                :
                null
              }

              {
                data.twitterUsername
                ?
                <Button type='primary' size='small' shape="circle" icon={<TwitterOutlined />} href={`https://twitter.com/${data.twitterUsername}`}/>
                :
                null
              }

              {
                data.website
                ?
                <Button type='primary' size='small' shape="circle" icon={<GlobalOutlined />} href={data.website}/>
                :
                null
              }
            </Space>
          </Divider>
          <div
              className={Styles['long-text']}
              ref={this._htmlDivRef} dangerouslySetInnerHTML={{ __html: data.text }}
            />
        </div>
      )
    }


    return (
      <TokenizedPage>
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

  // convert markdown to html on server side
  // in order to benefit from SEO if necessary.
  // If SEO doe not matter, it's probably better to do it all
  // on client and not use getServerSideProps at all.
  userExtra.text = mdToHtml(userExtra.text)

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


function mdToHtml(md) {
  const { window } = new JSDOM('<!DOCTYPE html>')
  const domPurify = DOMPurify(window)
  return domPurify.sanitize(Marked(md), { ADD_TAGS: ["iframe"] })
}




export default withRouter(UserPage)