let _accessToken = null

export default class AccessToken {
  static get() {
    return _accessToken
  }


  static set(t) {
    _accessToken = t
  }


  static getData() {
    try {
      return JSON.parse(atob(t.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  
}

