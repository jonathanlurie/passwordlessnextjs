import Router from 'next/router'
import AccessToken from './AccessToken'
import { getMessageFromCode } from '../fullstack/ErrorCodes'
import ErrorWithCode from '../fullstack/ErrorWithCode'


export default class SDK {

  static async hasEmail(email) {
    const res = await fetch(`/api/hasemail?email=${encodeURIComponent(email)}`)
    const json = await res.json()
    return json.found
  }


  static async hasUsername(username) {
    const res = await fetch(`/api/hasusername?username=${encodeURIComponent(username)}`)
    const json = await res.json()
    return json.found
  }


  static async hasEmailOrUsername(emailOrUsername) {
    const res = await fetch(`/api/hasemailorusername?emailorusername=${encodeURIComponent(emailOrUsername)}`)
    const json = await res.json()
    return json.found
  }


  static async refreshToken(raiseError = false) {
    const res = await fetch('/api/refresh')
    const json = await res.json()

    if (json.error && raiseError) {
      throw new ErrorWithCode(getMessageFromCode(json.error), json.error)
    }

    if (json.data) {
      AccessToken.set(json.data)
    }

    return json
  }


  static async getUserExtra() {
    const accessToken = AccessToken.get()
    const headers = {}

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const res = await fetch('/api/userextra', {
      method: 'GET',
      headers,
    })

    // console.log('DEBUG: ', await res.clone().text())
    const json = await res.json()
    return json
  }


  static async logout(redirectUrl = '/') {
    AccessToken.set(null)
    const res = await fetch('/api/logout')
    Router.push(redirectUrl)
  }

}