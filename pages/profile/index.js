import React from 'react'
import { Input, Button, message, Space } from 'antd'
import Head from 'next/head'
import { 
  CommentOutlined,
  UserOutlined,
  GlobalOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GithubOutlined,
  DeleteOutlined,
  CloudUploadOutlined
} from '@ant-design/icons'

// codeMirror uses references to 'navigator' so we use Dynamics to make sure
// the dependency is pulled only on client side.
import dynamic from 'next/dynamic'
const CodeMirror = dynamic(() => import('../../components/ReactCodeMirror'), {
  ssr: false
})

import SDK from '../../core/frontend/SDK'
import { getMessageFromCode } from '../../core/fullstack/ErrorCodes'
import TokenizedPage from '../../components/TokenizedPage'
import AppLayout from '../../components/AppLayout'
import ProfilePicture from '../../components/ProfilePicture'
import Styles from './styles.module.css'
const { TextArea } = Input


export default class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      picture: null,
      text: null,
      displayName: null,
      twitterUsername: null,
      instagramUsername: null,
      githubUsername: null,
      website: null,
      photo: null,
      email: null,
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
      userExtraInfo = await SDK.getUserData()
    } catch(e) {
      // TODO: deal with this error
      console.log('error 1', e)
      return
    }

    if (userExtraInfo.error) {
      // TODO: deal with the error
      console.log('error 2', e)
      return
    }

    this._userExtra = userExtraInfo.data

    console.log('this._userExtra: ', this._userExtra)

    if (!this._userExtra) {
      this._userExtra = {}
    }

    this.setState({
      ...this._userExtra
    })
  }


  onTextChange = (codeMirrorInstance, changes) => {    
    this.setState({
      text: codeMirrorInstance.getValue(),
    })
  }


  onDisplayNameChange = (e) => {
    this.setState({
      displayName: e.target.value,
    })
  }



  onWebsiteChange = (e) => {
    this.setState({
      website: e.target.value,
    })
  }


  onTwitterUsernameChange = (e) => {
    this.setState({
      twitterUsername: e.target.value,
    })
  }
  

  onInstagramUsernameChange = (e) => {
    this.setState({
      instagramUsername: e.target.value,
    })
  }
  
  onGithubUsernameChange = (e) => {
    this.setState({
      githubUsername: e.target.value,
    })
  }


  onEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    })
  }


  onFileSelected = (evt) => {
    let f = evt.target.files[0]

    if (f.type !== 'image/jpeg' && f.type !== 'image/png') {
      message.error('Only jpeg and png format are accepted')
      return
    }

    const maxByteSize = 2**20
    if (f.size > maxByteSize) {
      message.error('The image must be less than 1MB')
      return
    }
    const reader = new FileReader()
  
    reader.onload = (e) => {
      this.setState({picture: e.target.result})
    }
  
    reader.readAsDataURL(f)
  }
  


  deletePicture = () => {
    this.setState({picture: null})
  }


  addPicture = () => {
    const input = document.createElement('input')
    input.type='file'
    input.onchange = this.onFileSelected
    input.click()
  }


  save = async () => {
    let successMessage = 'Saved!'
    if (this._userExtra.email && this._userExtra.email !== this.state.email) {
      successMessage = 'Saved! Please confirm the email update from your former mailbox.'
    }

    this._userExtra = {...this.state}
    try {
      const response = await SDK.postUserData(this._userExtra)
      if (response.error) {
        message.error(getMessageFromCode(response.error))
      } else {
        message.success(successMessage)
      }
    } catch (e) {
      message.error('Failed to save!')
    }  
  }


  cancel = () => {
    this.setState({
      ...this._userExtra,
    })
  }


  render() {
    const pictureSize = 200
    return (
      <TokenizedPage redirectOnFailedLogin onReady={this.onTokenizedPageReady}>
        <AppLayout>

        <Head>
          <title>Passwordless Next.js</title>
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="description" content='The Next.js boilerplate for passwordless authentication.'/>
          <meta name="author" content='Jonathan Lurie'/>

          <meta property="og:title" content='Passwordless Next.js' key="title_OG" />
          {/* <meta property="og:url" content={`${process.env.}`} key="url_OG"/> */}
          <meta property="og:image" content='/images/social_cover.png' key="image_OG"/>
          <meta property="og:description" content='The Next.js boilerplate for passwordless authentication.' key="description_OG"/>
          <meta property="og:site_name" content="Passwordless Nextjs" key="sitename_OG"/>
          <meta property="og:type" content="article" key="type_OG"/>

          <meta name="twitter:title" content='Passwordless Next.js' key="title_TW"/>
          <meta name="twitter:description" content='The Next.js boilerplate for passwordless authentication.' key="description_TW"/>
          <meta name="twitter:image" content='/images/social_cover.png' key="image_TW"/>
          <meta name="twitter:card" content="summary_large_image" key="card_TW"/>
          <meta name="twitter:site" content="@jonathanlurie" key="site_TW"/>
        </Head>

        <Space direction='vertical' className={Styles['spacer']}>            
            <Space>
            <ProfilePicture img={this.state.picture} />
              <Button type="primary" shape="circle" icon={<CloudUploadOutlined />} onClick={this.addPicture}/>
              {
                this.state.picture ?
                <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={this.deletePicture}/> :
                null
              }
            </Space>
            
            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Email' value={this.state.email} onChange={this.onEmailChange} prefix={<CommentOutlined />} />
            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Display name' value={this.state.displayName} onChange={this.onDisplayNameChange} prefix={<UserOutlined />} />
            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Website URL' value={this.state.website} onChange={this.onWebsiteChange} prefix={<GlobalOutlined />} />
            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Twitter username' value={this.state.twitterUsername} onChange={this.onTwitterUsernameChange} prefix={<TwitterOutlined />} />
            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Instagram username' value={this.state.instagramUsername} onChange={this.onInstagramUsernameChange} prefix={<InstagramOutlined />} />
            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Github username' value={this.state.githubUsername} onChange={this.onGithubUsernameChange} prefix={<GithubOutlined />} />

            <div
              className={Styles['codemirror-wrapper']}
            >
              <CodeMirror
                height="65vh"
                value={this.state.text}
                onChange={this.onTextChange}
                options={{
                  tabSize: 2,
                  mode: 'markdown',
                  lineWrapping: true,
                  autofocus: true,
                  placeholder: 'PasswordlessNextjs is Markdown-friendly!'
                }}
              />
            </div>

            <Space>
              <Button type='primary' onClick={this.save} >Save</Button>
              <Button type='primary' onClick={this.cancel} >Cancel</Button>
            </Space>

            

          </Space>
        </AppLayout>
      </TokenizedPage>
    )
  }
}