let _accessToken = null


export default class AccessToken {
  static get() {
    return _accessToken
  }


  static set(t) {
    _accessToken = t
  }


  static getLifespan(){
    const data = AccessToken.getData()

    if (data === null) {
      return null
    }

    return data.exp - data.iat
  }


  static getData() {
    try {
      return JSON.parse(atob(_accessToken.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  
}

