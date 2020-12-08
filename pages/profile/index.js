import React from 'react'
import { Input, Button, message, Space, Avatar } from 'antd'
import { UserOutlined, GlobalOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons'
import SDK from '../../core/frontend/SDK'
import LogoutButton from '../../components/LogoutButton'
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
      userExtraInfo = await SDK.getUserExtra()
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

    if (!this._userExtra) {
      this._userExtra = {}
    }

    this.setState({
      ...this._userExtra
    })
  }


  onTextChange = (e) => {
    this.setState({
      text: e.target.value,
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
  
  onGithubUsernameChange= (e) => {
    this.setState({
      githubUsername: e.target.value,
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
    this._userExtra = {...this.state}
    const response = await SDK.postUserExtra(this._userExtra)
    if (response.error) {
      message.error('Failed to save!')
    } else {
      message.success('Saved!')
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
        <Space direction='vertical' className={Styles['spacer']}>
            {/* <LogoutButton/> */}
            {/* <pre>
              {JSON.stringify(this._userExtra, null, 2)}
            </pre> */}
            
            
            <Space>
            <ProfilePicture img={this.state.picture} />
              <Button type="primary" shape="circle" icon={<CloudUploadOutlined />} onClick={this.addPicture}/>

              {
                this.state.picture ?
                <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={this.deletePicture}/> :
                null
              }
            
            {/* <input type='file' onChange={this.onFileSelected}/> */}
            </Space>

            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Display name' value={this.state.displayName} onChange={this.onDisplayNameChange} prefix={<UserOutlined />} />

            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Website URL' value={this.state.website} onChange={this.onWebsiteChange} prefix={<GlobalOutlined />} />

            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Twitter username' value={this.state.twitterUsername} onChange={this.onTwitterUsernameChange} prefix={<TwitterOutlined />} />

            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Instagram username' value={this.state.instagramUsername} onChange={this.onInstagramUsernameChange} prefix={<InstagramOutlined />} />

            <Input className={Styles['simple-input']} bordered={false} size='large' placeholder='Github username' value={this.state.githubUsername} onChange={this.onGithubUsernameChange} prefix={<GithubOutlined />} />


            <TextArea className={Styles['text-area']} rows={10} placeholder='What about you?' value={this.state.text} onChange={this.onTextChange}/>

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