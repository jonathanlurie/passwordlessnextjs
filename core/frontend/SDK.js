import Router from 'next/router'
import AccessToken from './AccessToken'
import { getMessageFromCode } from '../fullstack/ErrorCodes'
import ErrorWithCode from '../fullstack/ErrorWithCode'


let refreshIntervalId = null
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

    if (json.error) {
      if (raiseError) {
        throw new ErrorWithCode(getMessageFromCode(json.error), json.error)
      } else {
        return null
      }
    }

    if (json.data) {
      AccessToken.set(json.data)

      // logic to refresh the token but 
      const lifespan = AccessToken.getLifespan()
      const renewEveryMs = Math.round(lifespan * 0.5) * 1000
      clearInterval(refreshIntervalId)
      refreshIntervalId = setInterval(() => {
        try {
          SDK.refreshToken()
        } catch(err) {
          console.log('Refresh token failed')
        }
      }, renewEveryMs)
    }

    return json
  }


  static async getUserData() {
    const accessToken = AccessToken.get()
    const headers = {}

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const res = await fetch('/api/userdata', {
      method: 'GET',
      headers,
    })

    const json = await res.json()
    return json
  }


  static async postUserData(userData) {
    const accessToken = AccessToken.get()
    const headers = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const res = await fetch('/api/userdata', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    })

    const json = await res.json()
    return json
  }


  static async logout(redirectUrl = '/') {
    AccessToken.set(null)
    const res = await fetch('/api/logout')
    // using this instead of Router.push forces a reload of the page
    window.location.href = redirectUrl
  }

}