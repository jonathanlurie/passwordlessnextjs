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


  static isAlphaNumericLowerCase(str) {
    for (let i = 0, len = str.length; i < len; i++) {
      let code = str.charCodeAt(i)
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false
      }
    }
    return true;
  }
}