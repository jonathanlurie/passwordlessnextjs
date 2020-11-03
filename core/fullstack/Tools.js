export default class Tools {
  static isAlphaNumeric(str) {
    for (let i = 0, len = str.length; i < len; i++) {
      let code = str.charCodeAt(i)
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false
      }
    }
    return true
  }


  static isUsername(str) {
    const validChars = 'abcdefghijkmlnopqrstuvwxyz01234567890-_'
    return Array.from(str).every((c) => validChars.includes(c))
  }

  
  static isEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
}